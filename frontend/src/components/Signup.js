import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import API, { setAuthToken } from "../axiosConfig";
import { AuthContext } from "../context/AuthContext";

export default function Signup() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async e => {
    e.preventDefault();
    setError("");
    if (!name || !email || !password) return setError('Please fill all fields');
    setLoading(true);
    try {
      const res = await API.post("/auth/signup", { name, email, password });
      setAuthToken(res.data.token);
      login(res.data.token, res.data.user);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.msg || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{maxWidth:520}}>
      <div className="card pop" style={{padding:22,marginTop:32}}>
        <h2 style={{marginTop:0}}>Create your account</h2>
        <p className="muted">Get started by creating a profile to teach or learn skills.</p>

        <form onSubmit={handleSubmit} style={{marginTop:12}}>
          {error && <div className="card" style={{background:'rgba(255,0,0,0.06)',color:'#ffdede',padding:10,marginBottom:10}}>{error}</div>}

          <div style={{marginBottom:10}}>
            <label className="muted">Full name</label>
            <input placeholder="Your name" value={name} onChange={e=>setName(e.target.value)} style={{width:'100%',padding:10,borderRadius:8,border:'1px solid rgba(255,255,255,0.04)',background:'transparent',color:'inherit'}} />
          </div>

          <div style={{marginBottom:10}}>
            <label className="muted">Email</label>
            <input placeholder="Email" type="email" value={email} onChange={e=>setEmail(e.target.value)} style={{width:'100%',padding:10,borderRadius:8,border:'1px solid rgba(255,255,255,0.04)',background:'transparent',color:'inherit'}} />
          </div>

          <div style={{marginBottom:10}}>
            <label className="muted">Password</label>
            <input placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} style={{width:'100%',padding:10,borderRadius:8,border:'1px solid rgba(255,255,255,0.04)',background:'transparent',color:'inherit'}} />
          </div>

          <div>
            <button type="submit" className="btn btn-primary" disabled={loading} style={{width:'100%'}}>{loading ? 'Creating...' : 'Create account'}</button>
          </div>
        </form>

        <p className="muted" style={{marginTop:12}}>Already have an account? <Link to="/login">Sign in</Link></p>
      </div>
    </div>
  );
}
