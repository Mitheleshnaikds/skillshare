import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import API from "../axiosConfig";

export default function Profile() {
  const { user } = useContext(AuthContext);
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

  if (!profile) return <p className="container spaced">Loading profile...</p>;

  return (
    <main className="container spaced">
      <div className="card pop" style={{ maxWidth: 700, margin: "auto" }}>
        <h2>{profile.name}</h2>

        <div className="spaced">
          <div>
            <strong>Email:</strong>{" "}
            <span className="muted">{profile.email}</span>
          </div>
          <div className="spaced">
            <strong>Skills Offered:</strong>{" "}
            <span className="muted">
              {profile.skillsOffered?.join(", ") || "None"}
            </span>
          </div>
          <div className="spaced">
            <strong>Skills Wanted:</strong>{" "}
            <span className="muted">
              {profile.skillsWanted?.join(", ") || "None"}
            </span>
          </div>
        </div>
      </div>
    </main>
  );
}
