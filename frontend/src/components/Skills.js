import { useState, useContext } from "react";
import API from "../axiosConfig";
import { AuthContext } from "../context/AuthContext";

export default function Skills() {
  const { user } = useContext(AuthContext);
  const [skillsOffered, setSkillsOffered] = useState(user?.skillsOffered || []);
  const [skillsWanted, setSkillsWanted] = useState(user?.skillsWanted || []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.put("/users/skills", {
        skillsOffered,
        skillsWanted,
      });
      alert("Skills updated successfully!");
    } catch (err) {
      alert(err.response?.data?.error || "Failed to update skills");
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ margin: "20px 0" }}>
      <div>
        <label>Skills Offered (comma separated)</label>
        <input
          type="text"
          value={skillsOffered.join(", ")}
          onChange={(e) =>
            setSkillsOffered(e.target.value.split(",").map((s) => s.trim()))
          }
          placeholder="Python, JavaScript"
        />
      </div>
      <div>
        <label>Skills Wanted (comma separated)</label>
        <input
          type="text"
          value={skillsWanted.join(", ")}
          onChange={(e) =>
            setSkillsWanted(e.target.value.split(",").map((s) => s.trim()))
          }
          placeholder="Guitar, French"
        />
      </div>
      <button type="submit">Update Skills</button>
    </form>
  );
}
