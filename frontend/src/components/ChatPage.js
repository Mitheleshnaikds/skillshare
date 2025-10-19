import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { io } from "socket.io-client";   // ✅ Import Socket.IO client
import API from "../axiosConfig";

export default function ChatPage() {
  const { userId } = useParams();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [chatUser, setChatUser] = useState(null);
  const [socket, setSocket] = useState(null);
  const [isOnline, setIsOnline] = useState(false); // ✅ To show online/offline
  const [onlineIds, setOnlineIds] = useState([]); // ✅ Store online snapshot to avoid race
  const scrollRef = useRef();

  // ✅ Initialize socket connection once
  useEffect(() => {
  const socketUrl = process.env.REACT_APP_SOCKET_URL || "http://localhost:5000";
  const s = io(socketUrl, {
      transports: ['websocket', 'polling'], // Ensure both transports are available
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000
    });
    
    setSocket(s);

    const userData = JSON.parse(localStorage.getItem("user"));
    if (userData?._id) {
      s.emit("user-online", userData._id);
      console.log("📡 Socket connected and user set online:", userData._id);
    }

    s.on("connect", () => {
      console.log("✅ Socket connected:", s.id);
    });

    s.on("connect_error", (error) => {
      console.error("❌ Socket connection error:", error);
    });

    return () => {
      console.log("🔌 Disconnecting socket");
      s.disconnect();
    };
  }, []);

  // ✅ Listen for incoming messages and status updates
  useEffect(() => {
    if (!socket) return;

    // Receive new messages
    socket.on("receiveMessage", (message) => {
      console.log("📩 Message received:", message);
      // Only show if message is from or to the current chat user
      if (
        message.from === userId ||
        message.to === userId
      ) {
        setMessages((prev) => {
          // Avoid duplicates
          const exists = prev.some(m => m._id === message._id);
          if (exists) return prev;
          return [...prev, message];
        });
        console.log("✅ Message added to chat");
      }
    });

    // Listen for online/offline updates
    socket.on("updateUserStatus", ({ userId: id, status }) => {
      console.log("👤 User status update:", id, status);
      if (chatUser && id === chatUser._id) {
        setIsOnline(status === "online");
      }
    });

    // Initial snapshot of who is online
    socket.on("onlineUsers", (ids) => {
      if (Array.isArray(ids)) setOnlineIds(ids);
      if (chatUser && Array.isArray(ids)) {
        setIsOnline(ids.includes(chatUser._id));
      }
    });

    return () => {
      socket.off("receiveMessage");
      socket.off("updateUserStatus");
      socket.off("onlineUsers");
    };
  }, [socket, chatUser, userId]);

  // Fetch chat user info
  useEffect(() => {
    const fetchUser = async () => {
      const res = await API.get(`/users/${userId}`);
      setChatUser(res.data);
    };
    fetchUser();
  }, [userId]);

  // ✅ Apply online status after chatUser loads using any stored snapshot
  useEffect(() => {
    if (chatUser && Array.isArray(onlineIds)) {
      setIsOnline(onlineIds.includes(chatUser._id));
    }
  }, [chatUser, onlineIds]);

  // Fetch conversation
  useEffect(() => {
    const fetchMessages = async () => {
      const res = await API.get(`/messages/${userId}`);
      setMessages(res.data);
    };
    fetchMessages();
  }, [userId]);

  // Scroll to bottom on new message
  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  // Send message (via both REST + Socket)
  const sendMessage = async () => {
    if (!newMessage.trim()) return;
    try {
      const res = await API.post("/messages", { to: userId, text: newMessage });
      console.log("📤 Message saved to DB:", res.data);
      
      // Don't add to local state yet - wait for socket confirmation
      // This prevents duplicate messages
      
      if (socket && socket.connected) {
        socket.emit("sendMessage", res.data);
        console.log("📡 Message emitted via socket");
      } else {
        console.warn("⚠️ Socket not connected, message saved to DB only");
        // Add to local state as fallback
        setMessages((prev) => [...prev, res.data]);
      }
      
      setNewMessage("");
    } catch (err) {
      console.error("❌ Error sending message:", err);
    }
  };

  if (!chatUser) return (
    <div className="container section">
      <div className="empty-state">
        <div className="spinner"></div>
        <p>Loading chat...</p>
      </div>
    </div>
  );

  return (
    <div className="container section">
      <div className="card" style={{ marginBottom: '1rem', padding: '1rem 1.5rem' }}>
        <div className="flex items-center justify-between">
          <h2 style={{ margin: 0 }}>
            Chat with {chatUser.name}
          </h2>
          <div className="flex items-center gap-2">
            <span className={`status-dot ${isOnline ? 'status-online' : 'status-offline'}`}></span>
            <span className="text-sm" style={{ color: isOnline ? 'var(--success)' : 'var(--text-muted)' }}>
              {isOnline ? "Online" : "Offline"}
            </span>
          </div>
        </div>
      </div>

      <div className="card chat-wrap">
        <div className="messages" ref={scrollRef}>
          {messages.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">💬</div>
              <p>No messages yet. Start the conversation!</p>
            </div>
          ) : (
            messages.map((msg, idx) => {
              const me = msg.from !== chatUser._id;
              return (
                <div key={idx} style={{ display: "flex" }}>
                  <div className={`bubble ${me ? "me" : "other"}`}>
                    {msg.text}
                  </div>
                </div>
              );
            })
          )}
        </div>

        <div className="chat-input-area">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Type a message..."
            className="chat-input"
            style={{ fontSize: '1rem', padding: '1rem 1.25rem' }}
          />
          <button 
            className="btn btn-primary btn-sm" 
            onClick={sendMessage}
            disabled={!newMessage.trim()}
            style={{ minWidth: '70px', paddingLeft: '1.25rem', paddingRight: '1.25rem' }}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
