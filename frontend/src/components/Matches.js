import API from "../axiosConfig";

export default function Matches({ matches = [] }) {
  const handleRequest = async (teacherId, skill) => {
    try {
      await API.post("/exchanges", { teacherId, skill });
      alert("Request sent!");
    } catch (err) {
      alert(err.response?.data?.error || "Failed to send request");
    }
  };

  return (
    <section className="container spaced">
      <h3>Matches</h3>
      <div className="matches-grid spaced">
        {matches.map((m) => (
          <div key={m._id} className="card match-card pop">
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
              <div>
                <strong>{m.name}</strong>
                <div className="muted" style={{fontSize:'.9rem'}}>{m.bio || ''}</div>
              </div>
              <div className="badge">Offers: {m.skillsOffered?.length || 0}</div>
            </div>
            <p className="muted" style={{marginTop:10}}>{m.skillsOffered?.slice(0,3).join(', ')}</p>
            <div style={{display:'flex',gap:8,marginTop:12}}>
              <button className="btn btn-primary" onClick={() => handleRequest(m._id, m.skillsOffered?.[0])}>Request Skill</button>
              <button className="btn btn-ghost">View Profile</button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
