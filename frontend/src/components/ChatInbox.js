import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../axiosConfig";

export default function ChatInbox() {
  const [conversations, setConversations] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchInbox = async () => {
      try {
        const res = await API.get("/messages/inbox");
        setConversations(res.data);
      } catch (err) {
        console.error("Inbox fetch error:", err);
      }
    };
    fetchInbox();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2>Your Chats</h2>
      {conversations.length === 0 ? (
        <p>No chats yet</p>
      ) : (
        conversations.map((c, i) => (
          <div
            key={i}
            onClick={() => navigate(`/chat/${c.userId}`)}
            style={{
              borderBottom: "1px solid #ddd",
              padding: "10px",
              cursor: "pointer"
            }}
          >
            <strong>{c.name}</strong>
            <p style={{ margin: 0, color: "#555" }}>{c.lastMessage}</p>
            <small>{new Date(c.lastMessageAt).toLocaleString()}</small>
          </div>
        ))
      )}
    </div>
  );
}
