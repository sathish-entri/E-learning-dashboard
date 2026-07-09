import { useState, useEffect } from "react";
import api from "../../api/axios";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  RadialBarChart, RadialBar, PolarAngleAxis
} from "recharts";
import { Zap, Flame, Brain, Target } from "lucide-react";
import toast from "react-hot-toast";
import AIStudyAssistant from "../../components/learner/AIStudyAssistant";

export default function AnalyticsDashboard() {
  const [analytics, setAnalytics] = useState(null);
  const [badges, setBadges] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get("/gamification/my-analytics"),
      api.get("/gamification/my-badges"),
      api.post("/gamification/update-streak"),
    ]).then(([a, b]) => {
      setAnalytics(a.data.data);
      setBadges(b.data.data);
    }).catch(() => toast.error("Failed to load analytics"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="page-container">
      <div className="stats-grid" style={{ marginBottom: "2rem" }}>
        {[1,2,3,4].map(i => <div key={i} className="skeleton skeleton-stat" />)}
      </div>
      <div className="skeleton skeleton-card" style={{ height: 300 }} />
    </div>
  );

  if (!analytics) return null;

  const levelProgress = (analytics.progressToNextLevel / 500) * 100;

  const radarData = [
    { name: "XP", value: Math.min(100, (analytics.xpPoints / 2000) * 100) },
    { name: "Quizzes", value: Math.min(100, analytics.totalQuizzesTaken * 10) },
    { name: "Avg Score", value: analytics.averageQuizScore },
    { name: "Streak", value: Math.min(100, analytics.currentStreak * 3.3) },
  ];

  return (
    <div className="page-container">
      <div className="page-header" style={{ marginBottom: "2rem" }}>
        <div>
          <h1 className="gradient-text">My Analytics</h1>
          <p className="text-muted">Track your learning progress and achievements</p>
        </div>
      </div>

      {/* XP + Streak Row */}
      <div className="gamification-row">
        {/* XP Widget */}
        <div className="xp-widget">
          <div className="level-badge">Level {analytics.level}</div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginTop: "0.5rem" }}>
            <Zap size={18} color="var(--primary-light)" />
            <span style={{ fontWeight: 800, fontSize: "var(--font-size-2xl)", color: "var(--primary-light)" }}>
              {analytics.xpPoints.toLocaleString()} XP
            </span>
          </div>
          <p style={{ fontSize: "var(--font-size-xs)", color: "var(--text-muted)", marginTop: 4 }}>
            {500 - analytics.progressToNextLevel} XP to Level {analytics.level + 1}
          </p>
          <div className="xp-bar-track">
            <div className="xp-bar-fill" style={{ width: `${levelProgress}%` }} />
          </div>
        </div>

        {/* Streak Widget */}
        <div className="streak-widget">
          <div className="streak-flame">🔥</div>
          <div>
            <div className="streak-days">{analytics.currentStreak}</div>
            <div className="streak-label">Day Streak</div>
            <div style={{ fontSize: "var(--font-size-xs)", color: "var(--text-muted)", marginTop: 4 }}>
              Best: {analytics.longestStreak} days
            </div>
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div className="stats-grid" style={{ marginBottom: "2rem" }}>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: "rgba(99,102,241,0.15)" }}>
            <Brain size={22} color="var(--primary-light)" />
          </div>
          <div>
            <div className="stat-value">{analytics.totalQuizzesTaken}</div>
            <div className="stat-label">Quizzes Taken</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: "rgba(16,185,129,0.15)" }}>
            <Target size={22} color="var(--success)" />
          </div>
          <div>
            <div className="stat-value">{analytics.averageQuizScore}%</div>
            <div className="stat-label">Avg Quiz Score</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: "rgba(245,158,11,0.15)" }}>
            <Flame size={22} color="var(--accent)" />
          </div>
          <div>
            <div className="stat-value">{analytics.longestStreak}</div>
            <div className="stat-label">Best Streak</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: "rgba(6,182,212,0.15)" }}>
            <Zap size={22} color="var(--secondary)" />
          </div>
          <div>
            <div className="stat-value">{analytics.level}</div>
            <div className="stat-label">Current Level</div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "1.5rem", marginBottom: "2rem" }}>
        {/* Quiz Score Trend */}
        <div className="chart-card">
          <h3>📈 Quiz Score Trend</h3>
          {analytics.scoreHistory.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={analytics.scoreHistory}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="label" stroke="var(--text-muted)" tick={{ fontSize: 11 }} />
                <YAxis stroke="var(--text-muted)" tick={{ fontSize: 11 }} domain={[0, 100]} unit="%" />
                <Tooltip
                  contentStyle={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 12 }}
                  formatter={(v) => [`${v}%`, "Score"]} />
                <Line type="monotone" dataKey="score" stroke="var(--primary-light)" strokeWidth={3}
                  dot={{ fill: "var(--primary)", r: 5 }} activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div style={{ height: 220, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-muted)" }}>
              Take your first quiz to see the score trend!
            </div>
          )}
        </div>

        {/* Radial progress */}
        <div className="chart-card" style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <h3 style={{ alignSelf: "flex-start" }}>🎯 Skill Radar</h3>
          <ResponsiveContainer width="100%" height={200}>
            <RadialBarChart innerRadius="30%" outerRadius="90%" data={radarData} startAngle={90} endAngle={-270}>
              <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
              <RadialBar background dataKey="value" cornerRadius={8} fill="#6366f1" />
              <Tooltip
                contentStyle={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 12 }}
                formatter={(v, name, props) => [`${Math.round(v)}%`, props.payload.name]} />
            </RadialBarChart>
          </ResponsiveContainer>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem", width: "100%", marginTop: "1rem" }}>
            {radarData.map(d => (
              <div key={d.name} style={{ textAlign: "center", fontSize: "var(--font-size-xs)", color: "var(--text-muted)" }}>
                <div style={{ fontWeight: 700, color: "var(--primary-light)" }}>{Math.round(d.value)}%</div>
                <div>{d.name}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Badges */}
      <div className="chart-card">
        <h3>🏆 My Badges</h3>
        <div className="badge-grid">
          {badges.map(badge => (
            <div key={badge.key} className={`badge-item ${badge.isEarned ? "earned" : "locked"}`}
              title={badge.isEarned ? `Earned: ${new Date(badge.earnedAt).toLocaleDateString()}` : badge.condition}>
              <span className={`badge-rarity ${badge.rarity}`}>{badge.rarity}</span>
              <div className="badge-icon">{badge.icon}</div>
              <div className="badge-name">{badge.name}</div>
              <div className="badge-desc">{badge.description}</div>
              {badge.isEarned && (
                <div style={{ marginTop: 6, fontSize: "0.6rem", color: "var(--success)", fontWeight: 600 }}>
                  +{badge.xpReward} XP ✓
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* AI Assistant */}
      <AIStudyAssistant context="analytics and study improvement" />
    </div>
  );
}
