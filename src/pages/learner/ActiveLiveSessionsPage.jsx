import { useEffect, useState } from "react";
import api from "../../api/axios";
import { Video, HelpCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function ActiveLiveSessionsPage() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchActive = async () => {
    try {
      const { data } = await api.get("/live/active");
      if (data.success) setSessions(data.data);
    } catch {
      toast.error("Failed to load active sessions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActive();
  }, []);

  return (
    <div className="animate-in">
      <div className="page-header">
        <h2 className="page-title">Active Live Classes</h2>
        <p className="page-subtitle">Join streams and lectures happening right now</p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center" style={{ minHeight: "300px" }}>
          <div className="spinner" />
        </div>
      ) : sessions.length === 0 ? (
        <div className="card empty-state">
          <div className="empty-state-icon">🎥</div>
          <div className="empty-state-title">No Active Streams</div>
          <p className="empty-state-text">There are no live classes streaming at the moment. Please check back when a session is scheduled.</p>
        </div>
      ) : (
        <div className="classrooms-grid">
          {sessions.map((session) => (
            <div key={session._id} className="classroom-card live">
              <div className="flex justify-between items-start">
                <span className="classroom-subject">{session.classroomId?.subject}</span>
                <span className="live-badge">Streaming Live</span>
              </div>
              <h3 className="classroom-name">{session.title}</h3>
              <p className="text-xs text-muted mb-md">Classroom: {session.classroomId?.classname}</p>
              
              <div className="classroom-educator">
                <div className="avatar-sm">
                  {session.hostId?.profilePic ? (
                    <img src={session.hostId.profilePic} alt={session.hostId.name} />
                  ) : (
                    session.hostId?.name.charAt(0).toUpperCase()
                  )}
                </div>
                <span className="text-xs text-secondary">Instructor: {session.hostId?.name}</span>
              </div>

              <button
                className="btn btn-live btn-sm w-full"
                style={{ marginTop: "var(--space-md)" }}
                onClick={() => navigate(`/learner/live/${session._id}`)}
              >
                <Video size={14} /> Join Session
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
