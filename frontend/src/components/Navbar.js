import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);

  return (
    <nav style={{ 
      display: "flex", 
      justifyContent: "space-between", 
      alignItems: "center", 
      padding: "10px 20px", 
      background: "#333", 
      color: "white" 
    }}>
      <Link to="/" style={{ color: "white", textDecoration: "none", fontWeight: "bold" }}>
        Skill Share
      </Link>

      <div>
        {!user ? (
          <>
            <Link 
              to="/login" 
              style={{ marginRight: "10px", color: "white", textDecoration: "none" }}
            >
              Login
            </Link>
            <Link 
              to="/signup" 
              style={{ color: "white", textDecoration: "none" }}
            >
              Signup
            </Link>
          </>
        ) : (
          <>
            <Link 
              to="/profile" 
              style={{ marginRight: "10px", color: "white", textDecoration: "none" }}
            >
              Profile
            </Link>
            <button 
              onClick={logout} 
              style={{ 
                background: "red", 
                color: "white", 
                border: "none", 
                padding: "5px 10px", 
                borderRadius: "5px", 
                cursor: "pointer" 
              }}
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}
