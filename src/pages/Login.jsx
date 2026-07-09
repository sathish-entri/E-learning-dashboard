import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Eye, EyeOff, LogIn, BookOpen, Users, Video, Award } from "lucide-react";
import toast from "react-hot-toast";
import ThreeBackground from "../components/common/ThreeBackground";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await login(form);
      toast.success(`Welcome back, ${user.name}! 👋`);
      if (user.role === "coordinator") navigate("/coordinator");
      else if (user.role === "educator") navigate("/educator");
      else navigate("/learner");
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-bg" />
      <div className="auth-grid-bg" />

      {/* Left Panel */}
      <div className="auth-left" style={{ overflow: "hidden" }}>
        <ThreeBackground />
        <div className="auth-left-content animate-in" style={{ position: "relative", zIndex: 1, pointerEvents: "none" }}>
          <div className="auth-left-badge" style={{ pointerEvents: "auto" }}>
            <span>🎓</span> E-Learning Platform
          </div>
          <h1 className="auth-left-title" style={{ pointerEvents: "auto" }}>
            Transform the way you <span className="gradient-text">learn & teach</span>
          </h1>

          <p className="auth-left-desc" style={{ pointerEvents: "auto" }}>
            Join thousands of students and educators on our modern platform.
            Create classrooms, host live classes, and track progress — all in one place.
          </p>
          <div className="auth-features" style={{ pointerEvents: "auto" }}>
            {[
              { icon: <Video size={20} />, title: "Live Classes", desc: "Stream HD video classes in real-time", color: "rgba(239,68,68,0.15)", iconColor: "#ef4444" },
              { icon: <BookOpen size={20} />, title: "Rich Course Library", desc: "Access structured study plans & materials", color: "rgba(99,102,241,0.15)", iconColor: "#818cf8" },
              { icon: <Users size={20} />, title: "Classroom Management", desc: "Educators manage assignments & grades", color: "rgba(6,182,212,0.15)", iconColor: "#06b6d4" },
              { icon: <Award size={20} />, title: "Track Progress", desc: "Analytics dashboards for all roles", color: "rgba(245,158,11,0.15)", iconColor: "#f59e0b" },
            ].map((f, i) => (
              <div key={i} className="auth-feature animate-in" style={{ animationDelay: `${(i + 1) * 0.1}s` }}>
                <div className="auth-feature-icon" style={{ background: f.color, color: f.iconColor }}>
                  {f.icon}
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: "var(--font-size-sm)", marginBottom: "2px" }}>{f.title}</div>
                  <div style={{ fontSize: "var(--font-size-xs)", color: "var(--text-muted)" }}>{f.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="auth-right">
        <div className="auth-card animate-in">
          <div className="auth-logo">
            <div className="auth-logo-icon">🎓</div>
            <span className="auth-logo-name">EduLearn</span>
          </div>
          <h2 className="auth-title">Welcome back</h2>
          <p className="auth-subtitle">Sign in to continue your learning journey</p>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                id="login-email"
                type="email"
                className="form-control form-control-lg"
                placeholder="you@example.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
                autoComplete="email"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <div style={{ position: "relative" }}>
                <input
                  id="login-password"
                  type={showPass ? "text" : "password"}
                  className="form-control form-control-lg"
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  required
                  autoComplete="current-password"
                  style={{ paddingRight: "48px" }}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  style={{
                    position: "absolute", right: "14px", top: "50%", transform: "translateY(-50%)",
                    background: "none", border: "none", color: "var(--text-muted)", display: "flex", cursor: "pointer",
                  }}
                >
                  {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              id="login-submit"
              type="submit"
              className="btn btn-primary btn-lg w-full"
              disabled={loading}
              style={{ marginTop: "8px" }}
            >
              {loading ? (
                <>
                  <div className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }} />
                  Signing in…
                </>
              ) : (
                <>
                  <LogIn size={18} /> Sign In
                </>
              )}
            </button>
          </form>

          <p className="auth-switch" style={{ marginTop: "var(--space-lg)" }}>
            Don't have an account? <Link to="/register">Create one free</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
