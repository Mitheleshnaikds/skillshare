import { useState, useContext } from "react";
import API from "../axiosConfig";
import { AuthContext } from "../context/AuthContext";

function TagInput({ label, tags, setTags, placeholder }) {
  const [value, setValue] = useState("");

  const addTag = () => {
    const v = value.trim();
    if (!v) return;
    if (!tags.includes(v)) setTags([...tags, v]);
    setValue("");
  };

  const removeTag = (t) => setTags(tags.filter((x) => x !== t));

  const onKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag();
    }
    if (e.key === "Backspace" && value === "" && tags.length) {
      setTags(tags.slice(0, -1));
    }
  };

  return (
    <div className="spaced">
      <label>{label}</label>
      <div
        style={{
          display: "flex",
          gap: 8,
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {tags.map((t) => (
            <div
              key={t}
              className="card pop"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "6px 10px",
                borderRadius: 999,
              }}
            >
              <span className="muted">{t}</span>
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => removeTag(t)}
              >
                x
              </button>
            </div>
          ))}
        </div>

        <input
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={onKeyDown}
          style={{
            padding: "8px 10px",
            borderRadius: 8,
            border: "1px solid rgba(255,255,255,0.04)",
            background: "transparent",
            color: "inherit",
          }}
        />

        <button
          type="button"
          className="btn btn-primary"
          onClick={addTag}
        >
          Add
        </button>
      </div>
    </div>
  );
}

export default function Skills() {
  const { user } = useContext(AuthContext);
  const [skillsOffered, setSkillsOffered] = useState(user?.skillsOffered || []);
  const [skillsWanted, setSkillsWanted] = useState(user?.skillsWanted || []);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await API.put("/users/skills", { skillsOffered, skillsWanted });
      alert("Skills updated successfully!");
    } catch (err) {
      alert(err.response?.data?.error || "Failed to update skills");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="container spaced">
      <div className="card pop" style={{ padding: 20 }}>
        <h3>Manage Your Skills</h3>

        <TagInput
          label="Skills Offered"
          tags={skillsOffered}
          setTags={setSkillsOffered}
          placeholder="e.g. JavaScript"
        />
        <TagInput
          label="Skills Wanted"
          tags={skillsWanted}
          setTags={setSkillsWanted}
          placeholder="e.g. Guitar"
        />

        <div style={{ marginTop: 12 }}>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? "Saving..." : "Update Skills"}
          </button>
        </div>
      </div>
    </form>
  );
}
