import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import { useAuth } from "../../context/AuthContext";

export default function AppLayout() {
  const { unreadCount } = useAuth();
  const location = useLocation();

  // Determine a title based on route
  const getTitle = () => {
    const path = location.pathname;
    if (path.startsWith("/coordinator")) return "Coordinator Portal";
    if (path.startsWith("/educator")) return "Educator Console";
    if (path.startsWith("/learner")) return "Student Dashboard";
    if (path.startsWith("/profile")) return "User Profile";
    if (path.startsWith("/notifications")) return "Notification Center";
    return "EduLearn Platform";
  };

  return (
    <div className="app-layout">
      <Sidebar unreadNotifs={unreadCount} />
      <div className="main-content">
        <Topbar title={getTitle()} />
        <div className="animate-in">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
