import { useEffect, useState } from "react";
import API from "../axiosConfig";
import { useNavigate } from "react-router-dom";

export default function MatchesDashboard() {
  const [user, setUser] = useState(null);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const navigate = useNavigate();

  const fetchUser = async () => {
    try {
      const res = await API.get("/users/me");
      setUser(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchMatches = async () => {
    try {
      const res = await API.get("/exchanges/matches");
      setMatches(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await fetchUser();
      await fetchMatches();
      setLoading(false);
    };
    fetchData();
  }, []);

  if (loading) return <p className="container spaced">Loading...</p>;

  const sendMessage = async () => {
    if (!newMessage.trim()) return;
    try {
      const res = await API.post("/messages", {
        to: selectedUser._id,
        text: newMessage,
      });
      setMessages([...messages, res.data]);
      setNewMessage("");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="container spaced">
      <div className="card pop">
        <h2>Welcome to Skill Share Dashboard</h2>
        <p className="muted"><strong>Offered:</strong> {user?.skillsOffered?.join(", ") || "None"}</p>
        <p className="muted"><strong>Wanted:</strong> {user?.skillsWanted?.join(", ") || "None"}</p>

        <div style={{display:'flex',gap:10,flexWrap:'wrap',marginTop:12}}>
          <button className="btn btn-primary" onClick={() => navigate("/profile")}>My Profile</button>
          <button className="btn btn-ghost" onClick={() => navigate("/skills")}>Update Skills</button>
          <button className="btn" style={{background:'#06b6d4',color:'#022'}} onClick={() => navigate("/chats")}>All Chats</button>
        </div>
      </div>

      <section className="spaced">
        <h3>Matching Users</h3>
        {matches.length === 0 ? (
          <p className="muted">No matches found.</p>
        ) : (
          matches.map((match) => (
            <div key={match._id} className="card spaced">
              <p><strong>{match.name}</strong></p>
              <p className="muted"><strong>Offered:</strong> {match.skillsOffered.join(", ")}</p>
              <p className="muted"><strong>Wanted:</strong> {match.skillsWanted.join(", ")}</p>
              <div style={{marginTop:8}}>
                <button className="btn btn-primary" onClick={() => navigate(`/chat/${match._id}`)}>Message</button>
              </div>
            </div>
          ))
        )}
      </section>

      {selectedUser && (
        <div className="card spaced">
          <h3>Chat with {selectedUser.name}</h3>
          <div style={{maxHeight:200,overflowY:'auto',padding:10,border:'1px solid rgba(255,255,255,0.03)'}}>
            {messages.length === 0 ? <p className="muted">No messages yet</p> : (
              messages.map((msg, idx) => (
                <div key={idx} style={{margin:'6px 0',textAlign: msg.from === user._id ? 'right' : 'left'}}>
                  <p className={`bubble ${msg.from === user._id ? 'me' : 'other'}`}>{msg.text}</p>
                </div>
              ))
            )}
          </div>

          <div style={{display:'flex',gap:8,marginTop:8}}>
            <input value={newMessage} onChange={e=>setNewMessage(e.target.value)} placeholder="Type a message" style={{flex:1,padding:10,borderRadius:8,border:'1px solid rgba(255,255,255,0.04)',background:'transparent'}} />
            <button className="btn btn-primary" onClick={sendMessage}>Send</button>
          </div>
        </div>
      )}
    </div>
  );
}
