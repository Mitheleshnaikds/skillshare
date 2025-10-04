import { Link } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const [open, setOpen] = useState(false);
  const [theme, setTheme] = useState(() => {
    try { return localStorage.getItem('theme') || 'dark' } catch { return 'dark' }
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'light') root.setAttribute('data-theme', 'light');
    else root.removeAttribute('data-theme');
    try { localStorage.setItem('theme', theme) } catch {}
  }, [theme]);

  const toggleTheme = () => setTheme((t) => (t === 'light' ? 'dark' : 'light'));

  return (
    <header className="site-nav">
      <div className="navbar-inner container" style={{gap:700,paddingLeft:20,paddingRight:20}}>
        <div className="navbar-left">
          <div className="site-brand"><Link to="/">Skill Share</Link></div>
        </div>
        <div className="nav-cta">
          <button onClick={toggleTheme} className="btn btn-ghost" aria-pressed={theme === 'light'} title="Toggle theme">
            {theme === 'light' ? 'Light' : 'Dark'}
          </button>

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
        <div className="mobile-menu-list">
          <Link to="/" onClick={() => setOpen(false)}>Home</Link>
          <Link to="/matches" onClick={() => setOpen(false)}>Matches</Link>
          <Link to="/exchanges" onClick={() => setOpen(false)}>Exchanges</Link>
          <button onClick={toggleTheme} className="btn btn-ghost">{theme === 'light' ? 'Light' : 'Dark'}</button>

          {!user ? (
            <>
              <Link to="/login" onClick={() => setOpen(false)}>Login</Link>
              <Link to="/signup" onClick={() => setOpen(false)} className="btn btn-primary">Signup</Link>
            </>
          ) : (
            <>
              <Link to="/profile" onClick={() => setOpen(false)}>Profile</Link>
              <button onClick={() => { logout(); setOpen(false); }} className="btn btn-danger">Logout</button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
