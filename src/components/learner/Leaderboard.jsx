import { useEffect, useState } from "react";
import api from "../../api/axios";
import { useAuth } from "../../context/AuthContext";
import { Trophy, Zap, Flame, Star } from "lucide-react";

export default function Leaderboard({ classroomId }) {
  const { user } = useAuth();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (classroomId) fetchLeaderboard();
  }, [classroomId]);

  const fetchLeaderboard = async () => {
    try {
      const { data: res } = await api.get(`/gamification/leaderboard/${classroomId}`);
      setData(res.data);
    } catch {}
    finally { setLoading(false); }
  };

  const rankClass = (rank) => {
    if (rank === 1) return "top-1";
    if (rank === 2) return "top-2";
    if (rank === 3) return "top-3";
    return "";
  };

  const rankBadgeClass = (rank) => {
    if (rank === 1) return "rank-1";
    if (rank === 2) return "rank-2";
    if (rank === 3) return "rank-3";
    return "rank-other";
  };

  const rankEmoji = (rank) => {
    if (rank === 1) return "🥇";
    if (rank === 2) return "🥈";
    if (rank === 3) return "🥉";
    return rank;
  };

  if (loading) return (
    <div>
      {[1,2,3,4,5].map(i => (
        <div key={i} className="skeleton" style={{ height: 68, borderRadius: "var(--radius-lg)", marginBottom: 8 }} />
      ))}
    </div>
  );

  if (!data.length) return (
    <div style={{ textAlign: "center", padding: "3rem", color: "var(--text-muted)" }}>
      <Trophy size={48} style={{ opacity: 0.3, marginBottom: "1rem" }} />
      <p>No students enrolled yet</p>
    </div>
  );

  return (
    <div>
      <div className="leaderboard-table">
        {data.map((student) => (
          <div
            key={student._id}
            className={`leaderboard-row ${rankClass(student.rank)} ${student._id === user?._id ? "my-rank-highlight" : ""}`}
          >
            <div className={`rank-badge ${rankBadgeClass(student.rank)}`}>
              {rankEmoji(student.rank)}
            </div>
            <div style={{
              width: 40, height: 40, borderRadius: "50%",
              background: "linear-gradient(135deg, var(--primary), var(--secondary))",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "1.1rem", fontWeight: 700, color: "#fff", flexShrink: 0,
              overflow: "hidden"
            }}>
              {student.profilePic
                ? <img src={student.profilePic} alt={student.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                : student.name.charAt(0).toUpperCase()
              }
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 600, fontSize: "var(--font-size-sm)" }} className="truncate">
                {student.name}
                {student._id === user?._id && <span style={{ color: "var(--primary-light)", marginLeft: 6, fontSize: "0.7rem" }}>(You)</span>}
              </div>
              <div style={{ display: "flex", gap: "0.75rem", marginTop: 2 }}>
                <span style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>
                  Lvl {student.level}
                </span>
                {student.currentStreak > 0 && (
                  <span style={{ fontSize: "0.7rem", color: "var(--accent)", display: "flex", alignItems: "center", gap: 3 }}>
                    🔥 {student.currentStreak}d
                  </span>
                )}
                <span style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>
                  {student.totalQuizzesTaken} quizzes
                </span>
              </div>
            </div>
            <div className="leaderboard-xp">
              <Zap size={14} style={{ verticalAlign: "middle", marginRight: 2 }} />
              {student.xpPoints.toLocaleString()} XP
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
