import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function HomePage() {
  const { user } = useContext(AuthContext);

  const testimonials = [
    { name: 'Asha', quote: 'Found an amazing mentor in a week — highly recommend!' },
    { name: 'Carlos', quote: 'Great way to trade skills and meet people.' },
    { name: 'Maya', quote: 'I taught guitar and learned React — love this app.' },
  ];

  return (
    <div>
      <section className="hero pop" style={{background:'linear-gradient(90deg,#7c3aed,#3b82f6)'}}>
        <div className="hero-decor" />
        <div className="container" style={{textAlign:'center'}}>
          <h1 className="hero-title">Connect, Learn, and Share Skills</h1>
          <p className="hero-sub">Skill Share helps you find people who can teach what you want to learn and learn what you can teach — locally or online.</p>

          <div style={{display:'flex',gap:12,justifyContent:'center',flexWrap:'wrap'}}>
            {!user ? (
              <>
                <Link to="/signup" className="btn btn-primary">Sign Up</Link>
                <Link to="/login" className="btn btn-ghost">Login</Link>
              </>
            ) : (
              <Link to="/dashboard" className="btn btn-primary">Go to Dashboard</Link>
            )}
          </div>
        </div>
      </section>

      <section className="container spaced">
        <h2 style={{textAlign:'center'}}>What you can do</h2>
        <div className="features-grid" style={{marginTop:18}}>
          <div className="feature-card card fade-up">
            <h3>Offer a Skill</h3>
            <p className="muted">Share your expertise and help others grow.</p>
          </div>
          <div className="feature-card card fade-up">
            <h3>Find a Teacher</h3>
            <p className="muted">Search by skill and message directly.</p>
          </div>
          <div className="feature-card card fade-up">
            <h3>Chat & Schedule</h3>
            <p className="muted">Coordinate sessions and exchange feedback.</p>
          </div>
        </div>
      </section>

      <section className="container spaced">
        <h2 style={{textAlign:'center'}}>How it works</h2>
        <div style={{display:'flex',gap:16,marginTop:16,flexWrap:'wrap',justifyContent:'center'}}>
          <div className="card" style={{flex:'1 1 220px',textAlign:'center'}}>
            <div className="badge">1</div>
            <h4>Create a profile</h4>
            <p className="muted">List what you can teach and what you want to learn.</p>
          </div>
          <div className="card" style={{flex:'1 1 220px',textAlign:'center'}}>
            <div className="badge">2</div>
            <h4>Browse matches</h4>
            <p className="muted">Discover people who complement your skills.</p>
          </div>
          <div className="card" style={{flex:'1 1 220px',textAlign:'center'}}>
            <div className="badge">3</div>
            <h4>Connect & Exchange</h4>
            <p className="muted">Chat, schedule, and swap knowledge.</p>
          </div>
        </div>
      </section>

      <section className="container spaced">
        <h2 style={{textAlign:'center'}}>What people say</h2>
        <div className="testimonials spaced">
          {testimonials.map((t) => (
            <div key={t.name} className="testimonial card pop">
              <p style={{marginBottom:12}}>“{t.quote}”</p>
              <strong className="muted">— {t.name}</strong>
            </div>
          ))}
        </div>
      </section>

      <footer className="container spaced" style={{textAlign:'center',marginTop:36}}>
        <p>© {new Date().getFullYear()} Skill Share. All rights reserved.</p>
        <p className="muted">
          <a href="#" style={{color:'inherit'}}>Privacy Policy</a> | <a href="#" style={{color:'inherit'}}>Terms</a>
        </p>
      </footer>
    </div>
  );
}
