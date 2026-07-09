import { useEffect, useState } from "react";
import api from "../../api/axios";
import { BookOpen, Users, ClipboardList, Video, ArrowRight, Activity } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import DashboardThreeWidget from "../../components/learner/DashboardThreeWidget";

export default function LearnerDashboard() {
  const [stats, setStats] = useState({ enrolledClassrooms: 0, totalAssignments: 0, submittedAssignments: 0, avgProgress: 0 });
  const [classrooms, setClassrooms] = useState([]);
  const [activeSessions, setActiveSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchLearnerData = async () => {
    try {
      const [statsRes, classRes, activeRes] = await Promise.all([
        api.get("/learner/stats"),
        api.get("/learner/classrooms"),
        api.get("/live/active"),
      ]);
      if (statsRes.data.success) setStats(statsRes.data.data);
      if (classRes.data.success) setClassrooms(classRes.data.data);
      if (activeRes.data.success) setActiveSessions(activeRes.data.data);
    } catch {
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLearnerData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center" style={{ minHeight: "400px" }}>
        <div className="spinner" />
      </div>
    );
  }

  return (
    <div className="animate-in">
      <div className="page-header" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem", alignItems: "center", marginBottom: "var(--space-xl)", background: "linear-gradient(135deg, rgba(99,102,241,0.06), rgba(6,182,212,0.03))", border: "1px solid var(--border)", borderRadius: "var(--radius-xl)", padding: "var(--space-lg) var(--space-xl)" }}>
        <div>
          <h2 className="page-title" style={{ fontSize: "var(--font-size-2xl)", fontWeight: 800 }}>Welcome Back Student!</h2>
          <p className="page-subtitle" style={{ marginTop: "4px" }}>Pick up where you left off or join your active lectures</p>
        </div>
        <div style={{ height: "130px", width: "100%", maxWidth: "340px", marginLeft: "auto", position: "relative", borderRadius: "var(--radius-lg)", overflow: "hidden", background: "var(--bg-glass)", border: "1px solid var(--border)" }}>
          <DashboardThreeWidget />
        </div>
      </div>

      {/* Active Live Class Notifications banner */}
      {activeSessions.length > 0 && (
        <div className="card-glass flex justify-between items-center mb-xl" style={{ borderLeft: "4px solid var(--danger)", background: "rgba(239, 68, 68, 0.08)", borderColor: "var(--danger)" }}>
          <div className="flex items-center gap-md">
            <div className="live-badge" style={{ animation: "pulse-dot 1.5s infinite" }}>LIVE</div>
            <div>
              <h3 style={{ fontSize: "var(--font-size-base)", fontWeight: 700 }}>Active Online Session</h3>
              <p className="text-secondary text-sm">
                "{activeSessions[0].title}" by <strong>{activeSessions[0].hostId?.name}</strong> is live.
              </p>
            </div>
          </div>
          <button className="btn btn-live btn-sm" onClick={() => navigate(`/learner/live/${activeSessions[0]._id}`)}>
            <Video size={14} /> Join Now
          </button>
        </div>
      )}

      {/* Stats Grid */}
      <div className="stats-grid">
        <div className="stat-card" style={{ "--stat-color": "var(--primary)" }}>
          <div className="stat-icon"><BookOpen size={24} /></div>
          <div className="stat-value">{stats.enrolledClassrooms}</div>
          <div className="stat-label">Enrolled Classes</div>
        </div>

        <div className="stat-card" style={{ "--stat-color": "var(--secondary)" }}>
          <div className="stat-icon"><ClipboardList size={24} /></div>
          <div className="stat-value">{stats.submittedAssignments} / {stats.totalAssignments}</div>
          <div className="stat-label">Assignments Completed</div>
        </div>

        <div className="stat-card" style={{ "--stat-color": "var(--accent)" }}>
          <div className="stat-icon"><Activity size={24} /></div>
          <div className="stat-value">{stats.avgProgress}%</div>
          <div className="stat-label">Average Progress</div>
        </div>
      </div>

      <h3 style={{ fontSize: "var(--font-size-lg)", fontWeight: 700, margin: "var(--space-xl) 0 var(--space-md) 0" }}>My Classrooms</h3>

      {classrooms.length === 0 ? (
        <div className="card empty-state">
          <div className="empty-state-icon">🎒</div>
          <div className="empty-state-title">Not Enrolled in Any Classrooms</div>
          <p className="empty-state-text">Ask your educator or coordinator to enroll you in a classroom to access learning material.</p>
        </div>
      ) : (
        <div className="classrooms-grid">
          {classrooms.map((cls) => (
            <div
              key={cls._id}
              className={`classroom-card ${cls.isLive ? "live" : ""}`}
              onClick={() => navigate(`/learner/classroom/${cls._id}`)}
            >
              <div className="flex justify-between items-start">
                <span className="classroom-subject">{cls.subject}</span>
                {cls.isLive && <span className="live-badge">Streaming Live</span>}
              </div>
              <h3 className="classroom-name">{cls.classname}</h3>
              <div className="classroom-educator">
                <div className="avatar-sm">
                  {cls.educatorId?.profilePic ? (
                    <img src={cls.educatorId.profilePic} alt={cls.educatorId.name} />
                  ) : (
                    cls.educatorId?.name.charAt(0).toUpperCase()
                  )}
                </div>
                <span className="text-xs text-secondary">Instructor: {cls.educatorId?.name}</span>
              </div>

              {/* Progress bar */}
              <div style={{ marginTop: "var(--space-md)" }}>
                <div className="flex justify-between text-xs text-muted mb-xs">
                  <span>Class Progress</span>
                  <span>{cls.progress?.percentage || 0}%</span>
                </div>
                <div className="progress-bar-wrap">
                  <div className="progress-bar-fill" style={{ width: `${cls.progress?.percentage || 0}%` }} />
                </div>
              </div>

              <div className="classroom-footer" style={{ marginTop: "var(--space-md)", borderTop: "1px solid var(--border)", paddingTop: "var(--space-md)" }}>
                <span className="text-xs text-muted">Weekly schedule: {cls.schedule || "Not set"}</span>
                <span className="text-xs text-muted font-bold flex items-center gap-xs">
                  Enter Class <ArrowRight size={12} />
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
