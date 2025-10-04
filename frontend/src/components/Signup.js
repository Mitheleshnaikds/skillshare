import { useState, useContext } from "react";
import API, { setAuthToken } from "../axiosConfig";
import { AuthContext } from "../context/AuthContext";

export default function Signup() {
  const { login } = useContext(AuthContext);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const res = await API.post("/auth/signup", { name, email, password });
      setAuthToken(res.data.token);
      login(res.data.token, res.data.user);
      alert("Signup successful!");
    } catch (err) {
      alert(err.response?.data?.msg || "Signup failed");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input placeholder="Name" value={name} onChange={e=>setName(e.target.value)} />
      <input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
      <input type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} />
      <button type="submit">Signup</button>
    </form>
  );
}
