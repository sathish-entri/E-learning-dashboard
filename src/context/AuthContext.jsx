import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { io } from "socket.io-client";
import toast from "react-hot-toast";
import api from "../api/axios";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [socket, setSocket] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // ─── Init socket when user logs in ──────────────────────────────────────────
  const initSocket = useCallback((userId) => {
    const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:4000";
    const newSocket = io(SOCKET_URL, { transports: ["websocket"] });
    newSocket.emit("user:join", userId);

    newSocket.on("live:notification", (data) => {
      toast.custom(
        (t) => (
          <div
            onClick={() => {
              window.location.href = data.link || `/learner/live/${data.sessionId}`;
              toast.dismiss(t.id);
            }}
            style={{
              background: "#1e293b",
              border: "1px solid rgba(239,68,68,0.5)",
              borderRadius: "12px",
              padding: "16px",
              cursor: "pointer",
              display: "flex",
              gap: "12px",
              alignItems: "center",
              boxShadow: "0 0 20px rgba(239,68,68,0.2)",
            }}
          >
            <span style={{ fontSize: "1.5rem" }}>🔴</span>
            <div>
              <div style={{ fontWeight: 700, fontSize: "0.875rem", color: "#f1f5f9" }}>{data.title}</div>
              <div style={{ fontSize: "0.75rem", color: "#94a3b8", marginTop: "4px" }}>{data.message}</div>
            </div>
          </div>
        ),
        { duration: 10000, position: "top-right" }
      );
      setUnreadCount((c) => c + 1);
    });

    newSocket.on("notification:new", (notif) => {
      setNotifications((prev) => [notif, ...prev]);
      setUnreadCount((c) => c + 1);
      toast(notif.title, { icon: "🔔" });
    });

    setSocket(newSocket);
    return newSocket;
  }, []);

  // ─── Bootstrap: load user from stored tokens ─────────────────────────────────
  useEffect(() => {
    const bootstrap = async () => {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) { setLoading(false); return; }
      try {
        const { data } = await api.get("/auth/me");
        if (data.success) {
          setUser(data.data);
          initSocket(data.data._id);
          fetchNotifications();
        }
      } catch {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
      } finally {
        setLoading(false);
      }
    };
    bootstrap();
  }, []);

  const fetchNotifications = async () => {
    try {
      const { data } = await api.get("/notifications");
      if (data.success) {
        setNotifications(data.data);
        setUnreadCount(data.unreadCount);
      }
    } catch { /* silent */ }
  };

  const login = async (credentials) => {
    const { data } = await api.post("/auth/login", credentials);
    localStorage.setItem("accessToken", data.accessToken);
    localStorage.setItem("refreshToken", data.refreshToken);
    setUser(data.data);
    initSocket(data.data._id);
    fetchNotifications();
    return data.data;
  };

  const register = async (formData) => {
    const { data } = await api.post("/auth/register", formData);
    localStorage.setItem("accessToken", data.accessToken);
    localStorage.setItem("refreshToken", data.refreshToken);
    setUser(data.data);
    initSocket(data.data._id);
    return data.data;
  };

  const logout = async () => {
    try { await api.post("/auth/logout"); } catch { /* silent */ }
    socket?.disconnect();
    setSocket(null);
    setUser(null);
    setNotifications([]);
    setUnreadCount(0);
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
  };

  const markNotifRead = async (id) => {
    await api.put(`/notifications/${id}/read`);
    setNotifications((prev) => prev.map((n) => n._id === id ? { ...n, isRead: true } : n));
    setUnreadCount((c) => Math.max(0, c - 1));
  };

  const markAllNotifRead = async () => {
    await api.put("/notifications/read-all");
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    setUnreadCount(0);
  };

  return (
    <AuthContext.Provider value={{
      user, loading, socket,
      notifications, unreadCount,
      login, register, logout,
      fetchNotifications, markNotifRead, markAllNotifRead,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};

export default AuthContext;
