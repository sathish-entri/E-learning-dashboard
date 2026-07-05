import { useEffect, useState } from "react";
import api from "../../api/axios";
import { Mail, Phone, Calendar, User } from "lucide-react";
import { formatDate } from "../../utils/time";
import toast from "react-hot-toast";

export default function EducatorsPage() {
  const [educators, setEducators] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEducators = async () => {
      try {
        const { data } = await api.get("/coordinator/educators");
        if (data.success) setEducators(data.data);
      } catch (err) {
        toast.error("Failed to load educators list");
      } finally {
        setLoading(false);
      }
    };
    fetchEducators();
  }, []);

  return (
    <div className="animate-in">
      <div className="page-header">
        <h2 className="page-title">Educator Management</h2>
        <p className="page-subtitle">View and supervise registered teaching professionals</p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center" style={{ minHeight: "300px" }}>
          <div className="spinner" />
        </div>
      ) : educators.length === 0 ? (
        <div className="card empty-state">
          <div className="empty-state-icon">👨‍🏫</div>
          <div className="empty-state-title">No Educators Registered</div>
          <p className="empty-state-text">No educator accounts are registered on the platform yet.</p>
        </div>
      ) : (
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>Educator</th>
                <th>Email</th>
                <th>Mobile</th>
                <th>Registered On</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {educators.map((edu) => (
                <tr key={edu._id}>
                  <td>
                    <div className="flex items-center gap-sm">
                      <div className="avatar-sm">
                        {edu.profilePic ? (
                          <img src={edu.profilePic} alt={edu.name} />
                        ) : (
                          edu.name.charAt(0).toUpperCase()
                        )}
                      </div>
                      <div>
                        <div style={{ fontWeight: 600, color: "var(--text-primary)" }}>{edu.name}</div>
                        {edu.bio && <div className="text-xs text-muted truncate" style={{ maxWidth: "200px" }}>{edu.bio}</div>}
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="flex items-center gap-xs text-sm">
                      <Mail size={14} className="text-muted" /> {edu.email}
                    </span>
                  </td>
                  <td>
                    {edu.mobile ? (
                      <span className="flex items-center gap-xs text-sm">
                        <Phone size={14} className="text-muted" /> {edu.mobile}
                      </span>
                    ) : (
                      <span className="text-muted">—</span>
                    )}
                  </td>
                  <td>
                    <span className="flex items-center gap-xs text-sm">
                      <Calendar size={14} className="text-muted" /> {formatDate(edu.createdAt)}
                    </span>
                  </td>
                  <td>
                    <span className={`badge ${edu.isActive ? "badge-success" : "badge-danger"}`}>
                      {edu.isActive ? "Active" : "Inactive"}
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
