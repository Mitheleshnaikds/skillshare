import { Link } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const [open, setOpen] = useState(false);

  return (
    <header className="site-nav">
      <div className="navbar-inner container" style={{gap:400}}>
        <div className="navbar-left">
          <div className="site-brand"><Link to="/" >Skill Share</Link></div>
        </div>

        <nav className="nav-links">
          
        </nav>

        <div className="nav-cta">
          {!user ? (
            <>
              <Link to="/login">Login</Link>
              <Link to="/signup" className="btn btn-primary">Signup</Link>
            </>
          ) : (
            <>
              <Link to="/profile" className="muted">Profile</Link>
              <button onClick={logout} className="btn btn-danger">Logout</button>
            </>
          )}

          <button className="hamburger" onClick={() => setOpen(!open)} aria-label="Toggle menu">☰</button>
        </div>
      </div>

      <div className={`mobile-menu ${open ? 'open' : ''}`} role="menu">
        <div style={{display:'flex',flexDirection:'column',gap:30}}>
          <Link to="/" onClick={() => setOpen(false)}>Home</Link>
          {!user ? (
            <>
              <Link to="/login" onClick={() => setOpen(false)}>Login</Link>
              <Link to="/signup" onClick={() => setOpen(false)} className="btn btn-primary">Signup</Link>
            </>
          ) : (
            <>

              <button onClick={() => { logout(); setOpen(false); }} className="btn btn-danger">Logout</button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
