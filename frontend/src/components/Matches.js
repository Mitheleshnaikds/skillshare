import API from "../axiosConfig";

export default function Matches({ matches }) {
  const handleRequest = async (teacherId, skill) => {
    try {
      await API.post("/exchanges", { teacherId, skill });
      alert("Request sent!");
    } catch (err) {
      alert(err.response?.data?.error || "Failed to send request");
    }
  };

  return (
    <div>
      <h3>Matches</h3>
      {matches.map(m => (
        <div key={m._id}>
          <span>{m.name} (Offers: {m.skillsOffered.join(", ")})</span>
          <button onClick={() => handleRequest(m._id, m.skillsOffered[0])}>Request Skill</button>
        </div>
      ))}
    </div>
  );
}
