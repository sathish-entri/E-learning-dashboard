import { useState, useEffect } from "react";
import api from "../../api/axios";
import { useAuth } from "../../context/AuthContext";
import { Megaphone, X, PlusCircle, Trash2 } from "lucide-react";
import { formatDistanceToNow } from "../../utils/time";
import toast from "react-hot-toast";

const PRIORITY_CONFIG = {
  info: { label: "Info", color: "#60a5fa", bg: "rgba(59,130,246,0.15)", icon: "ℹ️" },
  reminder: { label: "Reminder", color: "#fbbf24", bg: "rgba(245,158,11,0.15)", icon: "⏰" },
  urgent: { label: "Urgent", color: "#f87171", bg: "rgba(239,68,68,0.15)", icon: "🚨" },
};

export default function AnnouncementsPanel({ classroomId }) {
  const { user } = useAuth();
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", content: "", priority: "info" });
  const isEducator = user?.role === "educator" || user?.role === "coordinator";

  useEffect(() => { fetchAnnouncements(); }, [classroomId]);

  const fetchAnnouncements = async () => {
    try {
      const { data } = await api.get(`/announcements/classroom/${classroomId}`);
      setAnnouncements(data.data);
    } catch {} finally { setLoading(false); }
  };

  const create = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post("/announcements", { ...form, classroomId });
      setAnnouncements(prev => [data.data, ...prev]);
      setForm({ title: "", content: "", priority: "info" });
      setShowForm(false);
      toast.success("Announcement posted!");
    } catch { toast.error("Failed to post announcement"); }
  };

  const remove = async (id) => {
    try {
      await api.delete(`/announcements/${id}`);
      setAnnouncements(prev => prev.filter(a => a._id !== id));
      toast.success("Deleted");
    } catch { toast.error("Failed to delete"); }
  };

  if (loading) return <div className="skeleton" style={{ height: 200, borderRadius: "var(--radius-lg)" }} />;

  return (
    <div>
      {isEducator && (
        <div style={{ marginBottom: "1.5rem" }}>
          {showForm ? (
            <div className="glass-card">
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1rem" }}>
                <h3 style={{ margin: 0 }}>📢 New Announcement</h3>
                <button onClick={() => setShowForm(false)} style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer" }}>
                  <X size={18} />
                </button>
              </div>
              <form onSubmit={create}>
                <div className="form-group">
                  <label className="form-label">Priority</label>
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    {Object.entries(PRIORITY_CONFIG).map(([key, cfg]) => (
                      <button key={key} type="button"
                        onClick={() => setForm(f => ({ ...f, priority: key }))}
                        className={`announcement-priority-badge ${key}`}
                        style={{ cursor: "pointer", border: form.priority === key ? "2px solid currentColor" : "2px solid transparent", padding: "6px 16px" }}>
                        {cfg.icon} {cfg.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Title</label>
                  <input className="form-input" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} required placeholder="Announcement title" />
                </div>
                <div className="form-group">
                  <label className="form-label">Message</label>
                  <textarea className="form-input form-textarea" rows={3} value={form.content}
                    onChange={e => setForm(f => ({ ...f, content: e.target.value }))} required placeholder="Write your message..." />
                </div>
                <div style={{ display: "flex", gap: "0.75rem" }}>
                  <button type="submit" className="btn btn-primary">Post Announcement</button>
                  <button type="button" className="btn btn-secondary" onClick={() => setShowForm(false)}>Cancel</button>
                </div>
              </form>
            </div>
          ) : (
            <button className="btn btn-primary" onClick={() => setShowForm(true)} style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <PlusCircle size={16} /> New Announcement
            </button>
          )}
        </div>
      )}

      {announcements.length === 0 ? (
        <div style={{ textAlign: "center", padding: "3rem", color: "var(--text-muted)" }}>
          <Megaphone size={48} style={{ opacity: 0.3, marginBottom: "1rem" }} />
          <p>No announcements yet</p>
        </div>
      ) : (
        announcements.map(ann => {
          const cfg = PRIORITY_CONFIG[ann.priority] || PRIORITY_CONFIG.info;
          return (
            <div key={ann._id} className={`announcement-card ${ann.priority}`}>
              <div style={{ fontSize: "1.75rem", flexShrink: 0 }}>{cfg.icon}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "0.5rem", flexWrap: "wrap" }}>
                  <div>
                    <span className={`announcement-priority-badge ${ann.priority}`} style={{ marginRight: 8 }}>{cfg.label}</span>
                    <strong style={{ fontSize: "var(--font-size-base)" }}>{ann.title}</strong>
                  </div>
                  {ann.authorId?._id === user?._id && (
                    <button onClick={() => remove(ann._id)} style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", padding: 4 }}>
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
                <p style={{ marginTop: "0.5rem", fontSize: "var(--font-size-sm)", color: "var(--text-secondary)", lineHeight: 1.6 }}>{ann.content}</p>
                <p style={{ fontSize: "var(--font-size-xs)", color: "var(--text-muted)", marginTop: "0.5rem" }}>
                  by {ann.authorId?.name} · {formatDistanceToNow(ann.createdAt)}
                </p>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}
