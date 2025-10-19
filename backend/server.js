require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const http = require("http");
const { Server } = require("socket.io");
const Message = require('./models/Message'); // Import Message model

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_ORIGIN || "*", // allow configured frontend or all
    methods: ["GET", "POST"]
  }
});
connectDB();

app.use(cors()); // optionally tighten: cors({ origin: process.env.FRONTEND_ORIGIN?.split(',') || '*' })
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/exchanges', require('./routes/exchanges'));
app.use("/api/messages", require("./routes/messages"));

// Socket.io real-time messaging
const onlineUsers = new Map(); // Use Map instead of object for better methods

io.on("connection", (socket) => {
  console.log("✅ User connected:", socket.id);

  // Send the current snapshot of online users to the newly connected client
  try {
    const currentOnline = Array.from(onlineUsers.keys());
    socket.emit("onlineUsers", currentOnline);
  } catch (e) {
    console.error("Failed to emit onlineUsers snapshot:", e);
  }

  // When user comes online
  socket.on("user-online", (userId) => {
    onlineUsers.set(userId, socket.id);
    console.log(`👤 User ${userId} is online`);
    console.log("Online users:", Array.from(onlineUsers.keys()));
    
    // Broadcast to all clients that this user is online
    io.emit("updateUserStatus", { userId, status: "online" });
  });

  // Listen for sending message (matching frontend event name)
  socket.on("sendMessage", async (message) => {
    try {
      console.log("📨 Message received:", message);
      
      // Get receiver's socket ID
      const receiverSocketId = onlineUsers.get(message.to);
      const senderSocketId = onlineUsers.get(message.from);
      
      // Emit to receiver if they're online
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("receiveMessage", message);
        console.log(`✅ Sent to receiver: ${message.to}`);
      }
      
      // Also emit back to sender for confirmation
      if (senderSocketId) {
        io.to(senderSocketId).emit("receiveMessage", message);
        console.log(`✅ Confirmed to sender: ${message.from}`);
      }
    } catch (err) {
      console.error("❌ Failed to handle message:", err);
    }
  });

  socket.on("disconnect", () => {
    // Find and remove disconnected user
    let disconnectedUserId = null;
    for (let [userId, socketId] of onlineUsers.entries()) {
      if (socketId === socket.id) {
        disconnectedUserId = userId;
        onlineUsers.delete(userId);
        break;
      }
    }
    
    if (disconnectedUserId) {
      console.log(`👋 User ${disconnectedUserId} disconnected`);
      io.emit("updateUserStatus", { 
        userId: disconnectedUserId, 
        status: "offline",
        lastSeen: new Date()
      });
    }
    
    console.log("Remaining online users:", Array.from(onlineUsers.keys()));
  });
});



const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

