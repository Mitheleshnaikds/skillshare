import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import API from "../axiosConfig";

export default function ChatInbox() {
  const [conversations, setConversations] = useState([]);
  const [socket, setSocket] = useState(null);
  const [onlineIds, setOnlineIds] = useState([]);
  const navigate = useNavigate();

  // ✅ Connect Socket.IO once
  useEffect(() => {
    const s = io("http://localhost:5000", {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000
    });
    
    setSocket(s);

    const userData = JSON.parse(localStorage.getItem("user"));
    if (userData?._id) {
      s.emit("user-online", userData._id);
      console.log("📡 ChatInbox: Socket connected, user online:", userData._id);
    }

    s.on("connect", () => {
      console.log("✅ ChatInbox: Socket connected:", s.id);
    });

    s.on("connect_error", (error) => {
      console.error("❌ ChatInbox: Socket connection error:", error);
    });

    // Receive initial snapshot of online users
    s.on("onlineUsers", (ids) => {
      setOnlineIds(ids || []);
      setConversations((prev) => prev.map((c) => ({
        ...c,
        status: (ids || []).includes(c.userId) ? 'online' : c.status || 'offline'
      })));
    });

    return () => {
      console.log("🔌 ChatInbox: Disconnecting socket");
      s.off("onlineUsers");
      s.disconnect();
    };
  }, []);

  // ✅ Fetch inbox messages
  useEffect(() => {
    const fetchInbox = async () => {
      try {
        const res = await API.get("/messages/inbox");
        // Apply any known online snapshot to freshly loaded conversations
        setConversations(
          (res.data || []).map((c) => ({
            ...c,
            status: (onlineIds || []).includes(c.userId) ? 'online' : (c.status || 'offline'),
          }))
        );
      } catch (err) {
        console.error("Inbox fetch error:", err);
      }
    };
    fetchInbox();
  }, [onlineIds]);

  // ✅ Listen for live status updates (online/offline/lastSeen)
  useEffect(() => {
    if (!socket) return;

    socket.on("updateUserStatus", ({ userId, status, lastSeen }) => {
      setConversations((prev) =>
        prev.map((c) =>
          c.userId === userId
            ? {
                ...c,
                status,
                lastSeen,
              }
            : c
        )
      );
    });

    return () => {
      socket.off("updateUserStatus");
    };
  }, [socket]);

  // 🧮 Utility to format last seen
  const formatLastSeen = (timestamp) => {
    if (!timestamp) return "";
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;

    if (diff < 60000) return "a moment ago";
    if (diff < 3600000) return `${Math.floor(diff / 60000)} min ago`;
    if (diff < 86400000)
      return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    return date.toLocaleDateString();
  };

  return (
    <div className="container spaced">
      <h2>Your Chats</h2>

      {conversations.length === 0 ? (
        <p className="muted">No chats yet</p>
      ) : (
        conversations.map((c, i) => (
          <div
            key={i}
            role="button"
            tabIndex={0}
            onClick={() => navigate(`/chat/${c.userId}`)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ")
                navigate(`/chat/${c.userId}`);
            }}
            className="card match-card pop"
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 12,
              marginBottom: 10,
            }}
          >
            <div style={{ flex: 1 }}>
              <strong>{c.name}</strong>
              <p
                className="muted"
                style={{
                  margin: 0,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {c.lastMessage}
              </p>
              {/* ✅ Status / Last seen */}
              <small
                style={{
                  color: c.status === "online" ? "limegreen" : "gray",
                  fontSize: "0.8rem",
                }}
              >
                {c.status === "online"
                  ? "Online"
                  : `Last seen ${formatLastSeen(c.lastSeen)}`}
              </small>
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-end",
                gap: 6,
              }}
            >
              <small className="muted">
                {new Date(c.lastMessageAt).toLocaleString()}
              </small>
              {c.unreadCount > 0 && (
                <div className="badge">{c.unreadCount}</div>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
