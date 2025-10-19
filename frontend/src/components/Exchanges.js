import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../axiosConfig";

export default function Exchanges() {
  const [exchanges, setExchanges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all"); // all, pending, accepted, completed
  const navigate = useNavigate();

  useEffect(() => {
    fetchExchanges();
  }, []);

  const fetchExchanges = async () => {
    try {
      setLoading(true);
      const res = await API.get("/exchanges");
      setExchanges(res.data);
      setError("");
    } catch (err) {
      setError(err.response?.data?.msg || "Failed to fetch exchanges");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      await API.patch(`/exchanges/${id}/status`, { status });
      fetchExchanges();
    } catch (err) {
      setError(err.response?.data?.msg || "Failed to update exchange");
      console.error(err);
    }
  };

  const handleAccept = async (id) => {
    await handleStatusUpdate(id, 'accepted');
  };

  const handleReject = async (id) => {
    if (window.confirm("Are you sure you want to reject this exchange?")) {
      await handleStatusUpdate(id, 'rejected');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this exchange?")) {
      return;
    }

    try {
      await API.delete(`/exchanges/${id}`);
      fetchExchanges();
    } catch (err) {
      setError(err.response?.data?.msg || "Failed to delete exchange");
      console.error(err);
    }
  };

  const currentUser = JSON.parse(localStorage.getItem("user"));

  const filteredExchanges = exchanges.filter((ex) => {
    if (filter === "all") return true;
    return ex.status === filter;
  });

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "pending":
        return "badge" + " " + "status-pending";
      case "accepted":
        return "badge" + " " + "status-accepted";
      case "completed":
        return "badge" + " " + "status-completed";
      case "rejected":
        return "badge" + " " + "status-rejected";
      default:
        return "badge";
    }
  };

  const getRole = (exchange) => {
    return exchange.teacherId._id === currentUser?._id ? "teacher" : "student";
  };

  if (loading) {
    return (
      <div className="container section">
        <div className="empty-state">
          <div className="spinner"></div>
          <p>Loading exchanges...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container section">
      <div className="card" style={{ marginBottom: '2rem', padding: '1.5rem' }}>
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <h1 style={{ margin: '0 0 0.5rem 0' }}>Skill Exchanges</h1>
            <p className="muted">Manage your teaching and learning sessions</p>
          </div>
          <button
            className="btn btn-primary"
            onClick={() => navigate("/dashboard")}
          >
            + Find Matches
          </button>
        </div>
      </div>

      {error && (
        <div className="card" style={{
          background: 'rgba(239, 68, 68, 0.1)',
          border: '1px solid var(--error)',
          padding: '1rem',
          marginBottom: '1rem',
          color: 'var(--error)'
        }}>
          ⚠️ {error}
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-3" style={{ overflowX: 'auto', paddingBottom: '0.5rem' }}>
        <button
          className={`btn ${filter === "all" ? "btn-primary" : "btn-ghost"} btn-sm`}
          onClick={() => setFilter("all")}
        >
          All ({exchanges.length})
        </button>
        <button
          className={`btn ${filter === "pending" ? "btn-primary" : "btn-ghost"} btn-sm`}
          onClick={() => setFilter("pending")}
        >
          Pending ({exchanges.filter((e) => e.status === "pending").length})
        </button>
        <button
          className={`btn ${filter === "accepted" ? "btn-primary" : "btn-ghost"} btn-sm`}
          onClick={() => setFilter("accepted")}
        >
          Accepted ({exchanges.filter((e) => e.status === "accepted").length})
        </button>
        <button
          className={`btn ${filter === "completed" ? "btn-primary" : "btn-ghost"} btn-sm`}
          onClick={() => setFilter("completed")}
        >
          Completed ({exchanges.filter((e) => e.status === "completed").length})
        </button>
      </div>

      {/* Exchanges List */}
      {filteredExchanges.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">📚</div>
          <h3>No exchanges found</h3>
          <p className="muted">
            {filter === "all"
              ? "Start by finding people who match your skills!"
              : `You don't have any ${filter} exchanges yet.`}
          </p>
          <button
            className="btn btn-primary mt-3"
            onClick={() => navigate("/dashboard")}
          >
            Browse Matches
          </button>
        </div>
      ) : (
        <div className="matches-grid">
          {filteredExchanges.map((exchange) => {
            const role = getRole(exchange);
            const isTeacher = role === "teacher";
            const otherUser = isTeacher
              ? exchange.studentId
              : exchange.teacherId;

            return (
              <div key={exchange._id} className="card card-interactive pop">
                <div className="flex justify-between items-center mb-3">
                  <div className="flex items-center gap-2">
                    <div style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, var(--accent), var(--secondary))',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontWeight: 'bold',
                      fontSize: '1.25rem'
                    }}>
                      {otherUser.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 style={{ margin: 0, fontSize: '1.125rem' }}>{otherUser.name}</h3>
                      <p className="muted text-sm" style={{ margin: 0 }}>
                        {isTeacher ? "Learning from you" : "Teaching you"}
                      </p>
                    </div>
                  </div>
                  <div className={getStatusBadgeClass(exchange.status)}>
                    {exchange.status}
                  </div>
                </div>

                <div className="mb-3">
                  <div className="flex items-center gap-2 mb-2">
                    <span style={{ fontSize: '1.25rem' }}>🎓</span>
                    <span className="font-semibold">{exchange.skill}</span>
                  </div>

                  <div className="flex items-center gap-2 text-sm muted">
                    <span>📅</span>
                    <span>
                      {new Date(exchange.scheduledAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                </div>

                <div className="flex gap-2 flex-wrap">
                  {/* Teacher can accept/reject pending exchanges they received */}
                  {isTeacher && exchange.status === "pending" && (
                    <>
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => handleAccept(exchange._id)}
                      >
                        ✓ Accept
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleReject(exchange._id)}
                      >
                        ✕ Reject
                      </button>
                    </>
                  )}

                  {/* Student (requester) can delete their pending request */}
                  {!isTeacher && exchange.status === "pending" && (
                    <button
                      className="btn btn-ghost btn-sm"
                      onClick={() => handleDelete(exchange._id)}
                    >
                      🗑️ Cancel Request
                    </button>
                  )}

                  {/* Both can mark accepted as completed */}
                  {exchange.status === "accepted" && (
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => handleStatusUpdate(exchange._id, "completed")}
                    >
                      ✓ Mark Complete
                    </button>
                  )}

                  {/* Both can message each other */}
                  <button
                    className="btn btn-ghost btn-sm"
                    onClick={() => navigate(`/chat/${otherUser._id}`)}
                  >
                    💬 Message
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
