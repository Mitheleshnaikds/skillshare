import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import API from "../axiosConfig";

export default function Profile() {
  const { user } = useContext(AuthContext); // If you store user in context
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await API.get("/users/me");
        setProfile(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchProfile();
  }, []);

  if (!profile) return <p>Loading profile...</p>;

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "auto" }}>
      <h2>My Profile</h2>
      <div style={{ marginBottom: "10px" }}>
        <strong>Name:</strong> {profile.name}
      </div>
      <div style={{ marginBottom: "10px" }}>
        <strong>Email:</strong> {profile.email}
      </div>
      <div style={{ marginBottom: "10px" }}>
        <strong>Skills Offered:</strong> {profile.skillsOffered?.join(", ") || "None"}
      </div>
      <div style={{ marginBottom: "10px" }}>
        <strong>Skills Wanted:</strong> {profile.skillsWanted?.join(", ") || "None"}
      </div>
      {/* You can add more fields as needed */}
    </div>
  );
}
