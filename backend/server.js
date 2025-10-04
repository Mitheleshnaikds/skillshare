require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const http = require("http");
const { Server } = require("socket.io");
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",  // frontend URL
    methods: ["GET", "POST"]
  }
});
connectDB();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/exchanges', require('./routes/exchanges'));
app.use("/api/messages", require("./routes/messages"));

// Socket.io real-time messaging
let onlineUsers = {}; // store userId => socketId

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // when user logs in, send their userId
  socket.on("join", (userId) => {
    onlineUsers[userId] = socket.id;
    console.log("Online users:", onlineUsers);
  });

  // listen for sending message
 socket.on("send-message", async ({ from, to, text }) => {
    try {
      // 1️⃣ Save message to DB
      const message = await Message.create({ from, to, text });

      // 2️⃣ Emit message to receiver if online
      const receiverSocket = onlineUsers[to];
      if (receiverSocket) {
        io.to(receiverSocket).emit("receive-message", message);
      }

      // 3️⃣ Emit back to sender for confirmation
      socket.emit("receive-message", message);
    } catch (err) {
      console.error("Failed to save message:", err);
    }
  });


  socket.on("disconnect", () => {
    for (let id in onlineUsers) {
      if (onlineUsers[id] === socket.id) {
        delete onlineUsers[id];
        break;
      }
    }
    console.log("User disconnected:", socket.id);
  });
});



const PORT = 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

