import { useAuth } from "../context/AuthContext";
import { Bell, CheckCheck, Trash2, Calendar } from "lucide-react";
import { formatDistanceToNow } from "../utils/time";
import toast from "react-hot-toast";

const TYPE_ICONS = {
  live_class: "🔴",
  assignment: "📋",
  grade: "⭐",
  announcement: "📢",
  general: "🔔",
};

export default function NotificationCenter() {
  const { notifications, unreadCount, markNotifRead, markAllNotifRead } = useAuth();

  const handleRead = async (id) => {
    try {
      await markNotifRead(id);
    } catch {
      toast.error("Failed to update status");
    }
  };

  const handleMarkAll = async () => {
    try {
      await markAllNotifRead();
      toast.success("All notifications read");
    } catch {
      toast.error("Action failed");
    }
  };

  return (
    <div className="animate-in">
      <div className="flex justify-between items-center mb-xl flex-wrap gap-md">
        <div className="page-header" style={{ marginBottom: 0 }}>
          <h2 className="page-title">Notification Center</h2>
          <p className="page-subtitle">Catch up on all assignments, live events, and grade updates</p>
        </div>

        {unreadCount > 0 && (
          <button className="btn btn-secondary btn-sm" onClick={handleMarkAll}>
            <CheckCheck size={16} /> Mark all read
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="card empty-state">
          <div className="empty-state-icon">🔔</div>
          <div className="empty-state-title">No notifications</div>
          <p className="empty-state-text">You're all caught up! Clear updates will show here.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-sm">
          {notifications.map((n) => (
            <div
              key={n._id}
              className={`card flex justify-between items-center gap-md ${!n.isRead ? "unread" : ""}`}
              style={{
                borderLeft: !n.isRead ? "3px solid var(--primary)" : "1px solid var(--border-card)",
                background: !n.isRead ? "rgba(99,102,241,0.04)" : "var(--bg-card)",
              }}
            >
              <div className="flex items-center gap-md">
                <div style={{ fontSize: "1.5rem" }}>{TYPE_ICONS[n.type] || "🔔"}</div>
                <div>
                  <h4 style={{ fontWeight: 700, color: "var(--text-primary)" }}>{n.title}</h4>
                  <p className="text-secondary text-sm">{n.message}</p>
                  <div className="flex items-center gap-xs text-xs text-muted mt-xs">
                    <Calendar size={12} /> {formatDistanceToNow(n.createdAt)}
                  </div>
                </div>
              </div>

              {!n.isRead && (
                <button className="btn btn-secondary btn-xs" onClick={() => handleRead(n._id)}>
                  Mark read
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
