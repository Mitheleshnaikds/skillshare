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
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') navigate(`/chat/${c.userId}`); }}
            className="card match-card pop"
            style={{display:'flex',justifyContent:'space-between',alignItems:'center',gap:12,marginBottom:10}}
          >
            <div style={{flex:1}}>
              <strong>{c.name}</strong>
              <p className="muted" style={{ margin: 0, overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap' }}>{c.lastMessage}</p>
            </div>

            <div style={{display:'flex',flexDirection:'column',alignItems:'flex-end',gap:6}}>
              <small className="muted">{new Date(c.lastMessageAt).toLocaleString()}</small>
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
