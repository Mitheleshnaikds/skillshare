import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import API from "../axiosConfig";

export default function ChatPage() {
  const { userId } = useParams();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [chatUser, setChatUser] = useState(null);
  const scrollRef = useRef();

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

  // Scroll to bottom on new message
  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  const sendMessage = async () => {
    if (!newMessage.trim()) return;
    try {
      const res = await API.post("/messages", { to: userId, text: newMessage });
      setMessages((prev) => [...prev, res.data]);
      setNewMessage("");
    } catch (err) {
      console.error(err);
    }
  };

  if (!chatUser) return <p className="container spaced">Loading chat...</p>;

  return (
    <div className="container spaced">
      <h2>Chat with {chatUser.name}</h2>
      <div className="card chat-wrap">
        <div className="messages" ref={scrollRef}>
          {messages.map((msg, idx) => {
            const me = msg.from !== chatUser._id;
            return (
              <div key={idx} style={{display:'flex'}}>
                <div className={`bubble ${me ? 'me' : 'other'} pop`}>
                  {msg.text}
                </div>
              </div>
            );
          })}
        </div>

        <div style={{display:'flex',gap:8,paddingTop:10}}>
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message"
            style={{flex:1,padding:'10px 12px',borderRadius:10,border:'1px solid rgba(255,255,255,0.06)',background:'transparent',color:'inherit'}}
          />
          <button className="btn btn-primary" onClick={sendMessage}>Send</button>
        </div>
      </div>
    </div>
  );
}
