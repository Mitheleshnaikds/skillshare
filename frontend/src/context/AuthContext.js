import { createContext, useState, useEffect } from "react";
import API, { setAuthToken } from "../axiosConfig";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    // Load user and token from localStorage on mount
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");
    
    if (storedUser && storedToken) {
      try {
        setUser(JSON.parse(storedUser));
        setAuthToken(storedToken); // Restore token in axios headers
      } catch (err) {
        // If parsing fails, clear invalid data
        console.error("Invalid stored user data:", err);
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        setAuthToken(null);
      }
    }
    
    setLoading(false); // Finished checking localStorage
  }, []);

  const login = (token, userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", token);
    setAuthToken(token); // Set token in axios headers
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setAuthToken(null); // Remove token from axios headers
  };

  // Show nothing while checking localStorage
  if (loading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        background: 'var(--bg)'
      }}>
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
