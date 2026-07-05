import { useEffect, useState } from "react";
import api from "../../api/axios";
import { Mail, Phone, Calendar } from "lucide-react";
import { formatDate } from "../../utils/time";
import toast from "react-hot-toast";

export default function LearnersPage() {
  const [learners, setLearners] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLearners = async () => {
      try {
        const { data } = await api.get("/coordinator/learners");
        if (data.success) setLearners(data.data);
      } catch (err) {
        toast.error("Failed to load students list");
      } finally {
        setLoading(false);
      }
    };
    fetchLearners();
  }, []);

  return (
    <div className="animate-in">
      <div className="page-header">
        <h2 className="page-title">Student Management</h2>
        <p className="page-subtitle">View and supervise registered learners on the platform</p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center" style={{ minHeight: "300px" }}>
          <div className="spinner" />
        </div>
      ) : learners.length === 0 ? (
        <div className="card empty-state">
          <div className="empty-state-icon">🎒</div>
          <div className="empty-state-title">No Students Registered</div>
          <p className="empty-state-text">No student accounts are registered on the platform yet.</p>
        </div>
      ) : (
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>Student</th>
                <th>Email</th>
                <th>Mobile</th>
                <th>Enrolled On</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {learners.map((learner) => (
                <tr key={learner._id}>
                  <td>
                    <div className="flex items-center gap-sm">
                      <div className="avatar-sm">
                        {learner.profilePic ? (
                          <img src={learner.profilePic} alt={learner.name} />
                        ) : (
                          learner.name.charAt(0).toUpperCase()
                        )}
                      </div>
                      <div>
                        <div style={{ fontWeight: 600, color: "var(--text-primary)" }}>{learner.name}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="flex items-center gap-xs text-sm">
                      <Mail size={14} className="text-muted" /> {learner.email}
                    </span>
                  </td>
                  <td>
                    {learner.mobile ? (
                      <span className="flex items-center gap-xs text-sm">
                        <Phone size={14} className="text-muted" /> {learner.mobile}
                      </span>
                    ) : (
                      <span className="text-muted">—</span>
                    )}
                  </td>
                  <td>
                    <span className="flex items-center gap-xs text-sm">
                      <Calendar size={14} className="text-muted" /> {formatDate(learner.createdAt)}
                    </span>
                  </td>
                  <td>
                    <span className={`badge ${learner.isActive ? "badge-success" : "badge-danger"}`}>
                      {learner.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
