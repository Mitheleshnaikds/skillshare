import { useEffect, useState } from "react";
import API from "../axiosConfig";

export default function ExchangeRequests() {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    const fetchRequests = async () => {
      const res = await API.get("/exchanges");
      setRequests(res.data);
    };
    fetchRequests();
  }, []);

  const updateStatus = async (id, status) => {
    await API.put(`/exchanges/${id}`, { status });
    setRequests(requests.map(r => r._id === id ? { ...r, status } : r));
  };

  return (
    <div className="container spaced">
      <h3>Exchange Requests</h3>
      {requests.length === 0 ? <p className="muted">No requests</p> : (
        requests.map(r => (
          <div key={r._id} className="card spaced">
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
              <div>
                <p><strong>{r.skill}</strong> with <span className="muted">{r.teacherId?.name}</span></p>
                <p className="muted">Status: {r.status}</p>
              </div>
              <div style={{display:'flex',gap:8}}>
                {r.status === 'pending' && <button className="btn btn-primary" onClick={() => updateStatus(r._id,'accepted')}>Accept</button>}
                {r.status !== 'completed' && <button className="btn btn-ghost" onClick={() => updateStatus(r._id,'completed')}>Complete</button>}
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
