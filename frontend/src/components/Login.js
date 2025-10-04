import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import API, { setAuthToken } from "../axiosConfig";
import { AuthContext } from "../context/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!email || !password) return setError("Please fill all fields");
    setLoading(true);

    try {
      const res = await API.post("/auth/login", { email, password });
      setAuthToken(res.data.token);
      login(res.data.token, res.data.user);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.msg || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ maxWidth: 420 }}>
      <div className="card pop" style={{ padding: 22, marginTop: 40 }}>
        <h2 style={{ marginTop: 0 }}>Welcome back</h2>
        <p className="muted">Sign in to continue to Skill Share</p>

        <form onSubmit={handleSubmit} style={{ marginTop: 12 }}>
          {error && (
            <div
              className="card"
              style={{
                background: "rgba(255,0,0,0.06)",
                color: "#ffdede",
                padding: 10,
                marginBottom: 10,
              }}
            >
              {error}
            </div>
          )}

          <div style={{ marginBottom: 10 }}>
            <label className="muted">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                width: "100%",
                padding: 10,
                borderRadius: 8,
                border: "1px solid rgba(255,255,255,0.04)",
                background: "transparent",
                color: "inherit",
              }}
            />
          </div>

          <div style={{ marginBottom: 10 }}>
            <label className="muted">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                width: "100%",
                padding: 10,
                borderRadius: 8,
                border: "1px solid rgba(255,255,255,0.04)",
                background: "transparent",
                color: "inherit",
              }}
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
            style={{ width: "100%" }}
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <p className="muted" style={{ marginTop: 12 }}>
          Don't have an account?{" "}
          <Link to="/signup" style={{ textDecoration: "none" }}>
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}
