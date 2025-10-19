import { Link, useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [theme, setTheme] = useState(() => {
    try { return localStorage.getItem('theme') || 'dark' } catch { return 'dark' }
  });

  // Debug: Log user state
  useEffect(() => {
    console.log('Navbar - Current user:', user);
    console.log('Navbar - localStorage user:', localStorage.getItem('user'));
    console.log('Navbar - localStorage token:', localStorage.getItem('token'));
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate('/');
    closeMenu();
  };

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'light') root.setAttribute('data-theme', 'light');
    else root.removeAttribute('data-theme');
    try { localStorage.setItem('theme', theme) } catch {}
  }, [theme]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleTheme = () => setTheme((t) => (t === 'light' ? 'dark' : 'light'));

  const closeMenu = () => setOpen(false);

  return (
    <header className={`site-nav ${scrolled ? 'scrolled' : ''}`}>
      <div className="navbar-inner container">
        <div className="navbar-left">
          <Link to="/" className="site-brand" onClick={closeMenu}>
            ⚡ Skill Share
          </Link>
          
          {user && (
            <nav className="nav-links">
              <Link to="/dashboard">Dashboard</Link>
              <Link to="/chats">Inbox</Link>
              <Link to="/exchanges">Exchanges</Link>
            </nav>
          )}
        </div>

        <div className="nav-cta">
          <button 
            onClick={toggleTheme} 
            className="btn btn-ghost btn-sm btn-icon" 
            aria-pressed={theme === 'light'} 
            title="Toggle theme"
          >
            {theme === 'light' ? '☀️' : '🌙'}
          </button>

          {!user ? (
            <>
              <Link to="/login" className="btn btn-ghost btn-sm">Login</Link>
              <Link to="/signup" className="btn btn-primary btn-sm">Sign Up</Link>
            </>
          ) : (
            <>
              <Link to="/profile" className="btn btn-ghost btn-sm">Profile</Link>
              <button onClick={handleLogout} className="btn btn-danger btn-sm">Logout</button>
            </>
          )}

          <button 
            className="hamburger" 
            onClick={() => setOpen(!open)} 
            aria-label="Toggle menu"
            aria-expanded={open}
          >
            {open ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`mobile-menu ${open ? 'open' : ''}`} role="menu">
        <div className="mobile-menu-list">
          {user && (
            <>
              <Link to="/dashboard" onClick={closeMenu} className="btn btn-ghost">
                Dashboard
              </Link>
              <Link to="/matches" onClick={closeMenu} className="btn btn-ghost">
                Matches
              </Link>
              <Link to="/inbox" onClick={closeMenu} className="btn btn-ghost">
                Inbox
              </Link>
              <Link to="/exchanges" onClick={closeMenu} className="btn btn-ghost">
                Exchanges
              </Link>
              <Link to="/profile" onClick={closeMenu} className="btn btn-ghost">
                Profile
              </Link>
            </>
          )}

          {!user ? (
            <>
              <Link to="/login" onClick={closeMenu} className="btn btn-ghost">
                Login
              </Link>
              <Link to="/signup" onClick={closeMenu} className="btn btn-primary">
                Sign Up
              </Link>
            </>
          ) : (
            <button 
              onClick={handleLogout} 
              className="btn btn-danger"
            >
              Logout
            </button>
          )}

          <button onClick={toggleTheme} className="btn btn-ghost">
            {theme === 'light' ? '☀️ Light Mode' : '🌙 Dark Mode'}
          </button>
        </div>
      </div>
    </header>
  );
}
