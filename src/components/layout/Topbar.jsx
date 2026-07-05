import { useState, useRef, useEffect } from "react";
import { Search, Bell, X, CheckCheck } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { formatDistanceToNow } from "../../utils/time";

const NOTIF_ICONS = {
  live_class: "🔴",
  assignment: "📋",
  grade: "⭐",
  announcement: "📢",
  general: "🔔",
};

export default function Topbar({ title }) {
  const { user, notifications, unreadCount, markNotifRead, markAllNotifRead } = useAuth();
  const [showNotifs, setShowNotifs] = useState(false);
  const [search, setSearch] = useState("");
  const panelRef = useRef(null);
  const navigate = useNavigate();

  // Close panel on outside click
  useEffect(() => {
    const handler = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) setShowNotifs(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleNotifClick = async (notif) => {
    if (!notif.isRead) await markNotifRead(notif._id);
    if (notif.link) navigate(notif.link);
    setShowNotifs(false);
  };

  return (
    <div className="topbar">
      <div>
        <h1 style={{ fontSize: "var(--font-size-xl)", fontWeight: 700 }}>{title}</h1>
      </div>

      <div className="topbar-actions">
        <div className="topbar-search">
          <Search size={16} style={{ color: "var(--text-muted)", flexShrink: 0 }} />
          <input
            id="topbar-search"
            type="text"
            placeholder="Search…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Notification Bell */}
        <div style={{ position: "relative" }} ref={panelRef}>
          <button
            id="notif-btn"
            className="topbar-icon-btn"
            onClick={() => setShowNotifs((v) => !v)}
            title="Notifications"
          >
            <Bell size={18} />
            {unreadCount > 0 && <span className="notif-dot" />}
          </button>

          {showNotifs && (
            <div className="notif-panel">
              <div className="notif-header">
                <span>Notifications {unreadCount > 0 && <span className="badge badge-danger" style={{ marginLeft: "6px" }}>{unreadCount}</span>}</span>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllNotifRead}
                    style={{ background: "none", border: "none", color: "var(--primary-light)", fontSize: "var(--font-size-xs)", cursor: "pointer", display: "flex", alignItems: "center", gap: "4px" }}
                  >
                    <CheckCheck size={14} /> Mark all read
                  </button>
                )}
              </div>

              {notifications.length === 0 ? (
                <div className="notif-empty">
                  <div style={{ fontSize: "2rem", marginBottom: "8px" }}>🔔</div>
                  No notifications yet
                </div>
              ) : (
                notifications.slice(0, 8).map((notif) => (
                  <div
                    key={notif._id}
                    className={`notif-item ${!notif.isRead ? "unread" : ""}`}
                    onClick={() => handleNotifClick(notif)}
                  >
                    <div
                      className="notif-item-icon"
                      style={{ background: "var(--bg-glass)", fontSize: "1.1rem" }}
                    >
                      {NOTIF_ICONS[notif.type] || "🔔"}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div className="notif-item-title">{notif.title}</div>
                      <div className="notif-item-msg">{notif.message}</div>
                      <div className="notif-item-time" style={{ marginTop: "4px" }}>
                        {formatDistanceToNow(notif.createdAt)}
                      </div>
                    </div>
                    {!notif.isRead && (
                      <div style={{
                        width: 8, height: 8, borderRadius: "50%",
                        background: "var(--primary)", flexShrink: 0, marginTop: "4px"
                      }} />
                    )}
                  </div>
                ))
              )}
              {notifications.length > 0 && (
                <div className="notif-footer">
                  <a href="/notifications" onClick={() => setShowNotifs(false)}>View all notifications</a>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Avatar */}
        <div className="sidebar-user-avatar" style={{ width: 36, height: 36, cursor: "pointer" }} onClick={() => navigate("/profile")}>
          {user?.profilePic ? <img src={user.profilePic} alt={user.name} /> : user?.name?.charAt(0).toUpperCase()}
        </div>
      </div>
    </div>
  );
}
