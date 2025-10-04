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
    <div>
      <h3>Exchange Requests</h3>
      {requests.map(r => (
        <div key={r._id}>
          <span>{r.skill} with {r.teacherId.name}</span>
          <span>Status: {r.status}</span>
          {r.status === "pending" && <button onClick={() => updateStatus(r._id, "accepted")}>Accept</button>}
          {r.status !== "completed" && <button onClick={() => updateStatus(r._id, "completed")}>Complete</button>}
        </div>
      ))}
    </div>
  );
}
