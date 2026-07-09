import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Eye, EyeOff, UserPlus } from "lucide-react";
import toast from "react-hot-toast";
import ThreeBackground from "../components/common/ThreeBackground";

const roles = [
  { value: "coordinator", label: "Coordinator", icon: "🏛️", desc: "Manage courses & users" },
  { value: "educator", label: "Educator", icon: "👨‍🏫", desc: "Teach & create classes" },
  { value: "learner", label: "Learner", icon: "🎒", desc: "Learn & grow" },
];

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", mobile: "", role: "learner" });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    setLoading(true);
    try {
      const user = await register(form);
      toast.success(`Account created! Welcome, ${user.name}! 🎉`);
      if (user.role === "coordinator") navigate("/coordinator");
      else if (user.role === "educator") navigate("/educator");
      else navigate("/learner");
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <ThreeBackground />
      <div className="auth-bg" />
      <div className="auth-grid-bg" />
      <div className="auth-left">
        <div className="auth-left-content animate-in">
          <div className="auth-left-badge"><span>🚀</span> Join EduLearn</div>
          <h1 className="auth-left-title">
            Start your <span className="gradient-text">learning journey</span> today
          </h1>
          <p className="auth-left-desc">
            Whether you're a student looking to grow, a teacher ready to inspire,
            or a coordinator building a curriculum — EduLearn has a role for you.
          </p>
          <div className="auth-features">
            {roles.map((r, i) => (
              <div key={i} className="auth-feature animate-in" style={{ animationDelay: `${(i + 1) * 0.12}s` }}>
                <div className="auth-feature-icon" style={{ background: "rgba(99,102,241,0.15)", fontSize: "1.5rem" }}>
                  {r.icon}
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: "var(--font-size-sm)" }}>{r.label}</div>
                  <div style={{ fontSize: "var(--font-size-xs)", color: "var(--text-muted)" }}>{r.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="auth-right">
        <div className="auth-card animate-in">
          <div className="auth-logo">
            <div className="auth-logo-icon">🎓</div>
            <span className="auth-logo-name">EduLearn</span>
          </div>
          <h2 className="auth-title">Create account</h2>
          <p className="auth-subtitle">Join thousands of learners and educators</p>

          <form onSubmit={handleSubmit}>
            {/* Role Selector */}
            <div className="form-group">
              <label className="form-label">I am a…</label>
              <div className="role-selector">
                {roles.map((r) => (
                  <div key={r.value}>
                    <input
                      type="radio"
                      className="role-option"
                      id={`role-${r.value}`}
                      name="role"
                      value={r.value}
                      checked={form.role === r.value}
                      onChange={(e) => setForm({ ...form, role: e.target.value })}
                    />
                    <label className="role-label" htmlFor={`role-${r.value}`}>
                      <span className="role-icon">{r.icon}</span>
                      <span className="role-name">{r.label}</span>
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                id="reg-name"
                type="text"
                className="form-control"
                placeholder="John Doe"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                id="reg-email"
                type="email"
                className="form-control"
                placeholder="you@example.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Mobile Number</label>
              <input
                id="reg-mobile"
                type="tel"
                className="form-control"
                placeholder="+91 9876543210"
                value={form.mobile}
                onChange={(e) => setForm({ ...form, mobile: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <div style={{ position: "relative" }}>
                <input
                  id="reg-password"
                  type={showPass ? "text" : "password"}
                  className="form-control"
                  placeholder="Min. 6 characters"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  required
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
              id="register-submit"
              type="submit"
              className="btn btn-primary btn-lg w-full"
              disabled={loading}
              style={{ marginTop: "8px" }}
            >
              {loading ? (
                <><div className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }} /> Creating account…</>
              ) : (
                <><UserPlus size={18} /> Create Account</>
              )}
            </button>
          </form>

          <p className="auth-switch" style={{ marginTop: "var(--space-lg)" }}>
            Already have an account? <Link to="/login">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
