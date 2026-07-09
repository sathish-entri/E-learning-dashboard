import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import { useAuth } from "../../context/AuthContext";

export default function AppLayout() {
  const { unreadCount } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="app-wrapper">
      <Sidebar
        unreadNotifs={unreadCount}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      <div className="main-content">
        <Topbar
          onHamburgerClick={() => setSidebarOpen(o => !o)}
        />
        <div className="page-container">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
