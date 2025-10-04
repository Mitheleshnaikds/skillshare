import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../axiosConfig";

export default function ChatPage() {
  const { userId } = useParams(); // id of user we are chatting with
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [chatUser, setChatUser] = useState(null);

  // Fetch chat user info
  useEffect(() => {
    const fetchUser = async () => {
      const res = await API.get(`/users/${userId}`);
      setChatUser(res.data);
    };
    fetchUser();
  }, [userId]);

  // Fetch conversation
  useEffect(() => {
    const fetchMessages = async () => {
      const res = await API.get(`/messages/${userId}`);
      setMessages(res.data);
    };
    fetchMessages();
  }, [userId]);

  const sendMessage = async () => {
    if (!newMessage.trim()) return;
    try {
      const res = await API.post("/messages", { to: userId, text: newMessage });
      setMessages([...messages, res.data]);
      setNewMessage("");
    } catch (err) {
      console.error(err);
    }
  };

  if (!chatUser) return <p>Loading chat...</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>Chat with {chatUser.name}</h2>
      <div style={{ maxHeight: "400px", overflowY: "scroll", border: "1px solid #ddd", padding: "10px" }}>
        {messages.map((msg, idx) => (
          <div key={idx} style={{ textAlign: msg.from === chatUser._id ? "left" : "right", margin: "5px 0" }}>
            <p style={{ background: msg.from === chatUser._id ? "#f1f1f1" : "#d1ffd1", padding: "5px 10px", borderRadius: "10px" }}>
              {msg.text}
            </p>
          </div>
        ))}
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
  );
}
