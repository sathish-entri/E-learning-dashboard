import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  LayoutDashboard, BookOpen, Users, GraduationCap, Video,
  LogOut, Bell, ChevronRight, BookMarked, ClipboardList,
} from "lucide-react";
import toast from "react-hot-toast";

const navItems = {
  coordinator: [
    { to: "/coordinator", label: "Dashboard", icon: <LayoutDashboard size={18} />, end: true },
    { to: "/coordinator/courses", label: "Courses", icon: <BookOpen size={18} /> },
    { to: "/coordinator/educators", label: "Educators", icon: <GraduationCap size={18} /> },
    { to: "/coordinator/learners", label: "Learners", icon: <Users size={18} /> },
  ],
  educator: [
    { to: "/educator", label: "Dashboard", icon: <LayoutDashboard size={18} />, end: true },
    { to: "/educator/classrooms", label: "My Classrooms", icon: <BookMarked size={18} /> },
    { to: "/educator/assignments", label: "Assignments", icon: <ClipboardList size={18} /> },
  ],
  learner: [
    { to: "/learner", label: "Dashboard", icon: <LayoutDashboard size={18} />, end: true },
    { to: "/learner/classrooms", label: "My Classes", icon: <BookMarked size={18} /> },
    { to: "/learner/courses", label: "Courses", icon: <BookOpen size={18} /> },
    { to: "/learner/live", label: "Live Sessions", icon: <Video size={18} /> },
  ],
};

export default function Sidebar({ unreadNotifs = 0 }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    toast.success("Logged out successfully");
    navigate("/login");
  };

  if (!user) return null;
  const links = navItems[user.role] || [];
  const initials = user.name ? user.name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0,2) : "U";

  return (
    <aside className="sidebar" id="app-sidebar">
      {/* Logo */}
      <div className="sidebar-logo">
        <div className="sidebar-logo-icon">🎓</div>
        <span className="sidebar-logo-text">EduLearn</span>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        <div className="sidebar-section-label">Main Menu</div>
        {links.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}
          >
            <span className="link-icon">{item.icon}</span>
            {item.label}
            {item.label === "Notifications" && unreadNotifs > 0 && (
              <span className="link-badge">{unreadNotifs}</span>
            )}
          </NavLink>
        ))}

        <div className="sidebar-section-label" style={{ marginTop: "var(--space-md)" }}>Account</div>
        <NavLink
          to="/notifications"
          className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}
        >
          <Bell size={18} className="link-icon" />
          Notifications
          {unreadNotifs > 0 && <span className="link-badge">{unreadNotifs}</span>}
        </NavLink>
        <NavLink
          to="/profile"
          className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}
        >
          <Users size={18} className="link-icon" />
          Profile
        </NavLink>
      </nav>

      {/* User section */}
      <div className="sidebar-user">
        <div className="sidebar-user-avatar">
          {user.profilePic ? <img src={user.profilePic} alt={user.name} /> : initials}
        </div>
        <div className="sidebar-user-info">
          <div className="sidebar-user-name">{user.name}</div>
          <div className="sidebar-user-role">{user.role}</div>
        </div>
        <button
          className="sidebar-logout-btn"
          onClick={handleLogout}
          title="Logout"
          id="sidebar-logout"
        >
          <LogOut size={16} />
        </button>
      </div>
    </aside>
  );
}
