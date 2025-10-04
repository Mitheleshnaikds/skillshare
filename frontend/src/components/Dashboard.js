import { useEffect, useState } from "react";
import API from "../axiosConfig";
import { useNavigate } from "react-router-dom";

export default function MatchesDashboard() {
  const [user, setUser] = useState(null);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null); // user to message
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
    const navigate = useNavigate();

  // Fetch current user
  const fetchUser = async () => {
    try {
      const res = await API.get("/users/me");
      setUser(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // Fetch matching users
  const fetchMatches = async () => {
    try {
      const res = await API.get("/exchanges/matches"); // adjust route
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

  if (loading) return <p>Loading...</p>;

  // Handle sending a message
  const sendMessage = async () => {
    if (!newMessage.trim()) return;
    try {
      const res = await API.post("/messages", {
        to: selectedUser._id,
        text: newMessage,
      });
      setMessages([...messages, res.data]); // append new message
      setNewMessage("");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Your Skills</h2>
      <p><strong>Offered:</strong> {user?.skillsOffered?.join(", ") || "None"}</p>
      <p><strong>Wanted:</strong> {user?.skillsWanted?.join(", ") || "None"}</p>
      <h1>Welcome to Skill Share Dashboard</h1>

      {/* Action Buttons */}
      <div style={{ margin: "20px 0", display: "flex", gap: "10px" }}>
        <button onClick={() => navigate("/profile")}>My Profile</button>
        <button onClick={() => navigate("/skills")}>Update Skills</button>

        {/* All Chats Button */}
        <button onClick={() => navigate("/chats")}>All Chats</button>
      </div>

      <h2>Matching Users</h2>
      {matches.length === 0 ? <p>No matches found.</p> : (
        matches.map((match) => (
          <div
            key={match._id}
            style={{
              border: "1px solid #ccc",
              margin: "10px 0",
              padding: "10px",
              borderRadius: "5px",
            }}
          >
            <p><strong>Name:</strong> {match.name}</p>
            <p><strong>Skills Offered:</strong> {match.skillsOffered.join(", ")}</p>
            <p><strong>Skills Wanted:</strong> {match.skillsWanted.join(", ")}</p>
             <button onClick={() => navigate(`/chat/${match._id}`)}>Message</button>
          </div>
        ))
      )}

      {selectedUser && (
        <div style={{ marginTop: "20px", borderTop: "1px solid #000", paddingTop: "10px" }}>
          <h3>Chat with {selectedUser.name}</h3>
          <div style={{ maxHeight: "200px", overflowY: "scroll", border: "1px solid #ddd", padding: "10px" }}>
            {messages.length === 0 ? <p>No messages yet</p> : (
              messages.map((msg, idx) => (
                <div key={idx} style={{ margin: "5px 0", textAlign: msg.from === user._id ? "right" : "left" }}>
                  <p style={{ background: msg.from === user._id ? "#d1ffd1" : "#f1f1f1", padding: "5px 10px", borderRadius: "10px" }}>
                    {msg.text}
                  </p>
                </div>
              ))
            )}
          </div>
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message"
            style={{ width: "80%", marginRight: "10px" }}
          />
          <button onClick={sendMessage}>Send</button>
        </div>
      )}
    </div>
  );
}
