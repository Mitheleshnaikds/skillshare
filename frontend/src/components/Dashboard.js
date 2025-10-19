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
  const [requestingExchange, setRequestingExchange] = useState(null);
  const [existingExchanges, setExistingExchanges] = useState([]);
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

  const fetchExchanges = async () => {
    try {
      const res = await API.get("/exchanges");
      setExistingExchanges(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await fetchUser();
      await fetchMatches();
      await fetchExchanges();
      setLoading(false);
    };
    fetchData();
  }, []);

  if (loading) return <p className="container spaced">Loading...</p>;

  const requestExchange = async (teacherId, skill) => {
    try {
      setRequestingExchange(teacherId);
      await API.post("/exchanges", {
        teacherId,
        skill,
        scheduledAt: new Date(),
        notes: `Requesting to learn ${skill}`
      });
      alert(`Exchange request sent for ${skill}!`);
      navigate("/exchanges");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.msg || "Failed to request exchange");
    } finally {
      setRequestingExchange(null);
    }
  };

  // Check if an active exchange request already exists with this teacher
  const hasExistingExchange = (teacherId) => {
    return existingExchanges.some(
      (exchange) =>
        exchange.teacherId._id === teacherId &&
        (exchange.status === "pending" || exchange.status === "accepted")
    );
  };

  // Filter out users who already have accepted exchanges or pending requests
  const getFilteredMatches = () => {
    return matches.filter((match) => {
      // Check if there's an existing exchange (pending, accepted, or completed)
      const hasExchange = existingExchanges.some(
        (exchange) =>
          (exchange.teacherId._id === match._id || exchange.studentId._id === match._id) &&
          (exchange.status === "pending" || exchange.status === "accepted" || exchange.status === "completed")
      );
      return !hasExchange; // Only show if no active exchange exists
    });
  };

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
        {getFilteredMatches().length === 0 ? (
          <p className="muted">No new matches found. Check the Exchanges page to manage your existing connections.</p>
        ) : (
          <div className="matches-grid">
            {getFilteredMatches().map((match) => (
              <div key={match._id} className="card card-interactive pop">
                <h3 style={{ margin: '0 0 0.5rem 0' }}>{match.name}</h3>
                <div className="mb-2">
                  <p className="muted text-sm" style={{ margin: '0.25rem 0' }}>
                    <strong>Offers:</strong> {match.skillsOffered.join(", ")}
                  </p>
                  <p className="muted text-sm" style={{ margin: '0.25rem 0' }}>
                    <strong>Wants:</strong> {match.skillsWanted.join(", ")}
                  </p>
                </div>
                <div className="flex gap-2 flex-wrap mt-2">
                  <button 
                    className="btn btn-primary btn-sm" 
                    onClick={() => navigate(`/chat/${match._id}`)}
                  >
                    💬 Message
                  </button>
                  {match.skillsOffered.length > 0 && (
                    hasExistingExchange(match._id) ? (
                      <button 
                        className="btn btn-sm" 
                        style={{ background: '#f59e0b', color: '#fff', cursor: 'not-allowed', opacity: 0.7 }}
                        disabled
                      >
                        ⏳ Request Pending
                      </button>
                    ) : (
                      <button 
                        className="btn btn-secondary btn-sm" 
                        onClick={() => requestExchange(match._id, match.skillsOffered[0])}
                        disabled={requestingExchange === match._id}
                      >
                        {requestingExchange === match._id ? 'Requesting...' : '📚 Request Exchange'}
                      </button>
                    )
                  )}
                </div>
              </div>
            ))}
          </div>
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
