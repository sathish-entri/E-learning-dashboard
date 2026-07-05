import { useEffect, useState } from "react";
import api from "../../api/axios";
import { BookOpen, Users, GraduationCap, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

export default function CoordinatorDashboard() {
  const [stats, setStats] = useState({ totalCourses: 0, totalEducators: 0, totalLearners: 0 });
  const [recentCourses, setRecentCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [statsRes, coursesRes] = await Promise.all([
          api.get("/coordinator/stats"),
          api.get("/coordinator/courses?limit=3"),
        ]);
        if (statsRes.data.success) setStats(statsRes.data.data);
        if (coursesRes.data.success) setRecentCourses(coursesRes.data.data);
      } catch (err) {
        toast.error("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center" style={{ minHeight: "400px" }}>
        <div className="spinner" />
      </div>
    );
  }

  return (
    <div className="animate-in">
      <div className="page-header">
        <h2 className="page-title">Overview Dashboard</h2>
        <p className="page-subtitle">Track educational performance and course statistics</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card" style={{ "--stat-color": "var(--primary)" }}>
          <div className="stat-icon"><BookOpen size={24} /></div>
          <div className="stat-value">{stats.totalCourses}</div>
          <div className="stat-label">Total Courses</div>
        </div>

        <div className="stat-card" style={{ "--stat-color": "var(--secondary)" }}>
          <div className="stat-icon"><GraduationCap size={24} /></div>
          <div className="stat-value">{stats.totalEducators}</div>
          <div className="stat-label">Active Educators</div>
        </div>

        <div className="stat-card" style={{ "--stat-color": "var(--accent)" }}>
          <div className="stat-icon"><Users size={24} /></div>
          <div className="stat-value">{stats.totalLearners}</div>
          <div className="stat-label">Registered Students</div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "var(--space-xl)", marginTop: "var(--space-xl)" }}>
        {/* Left Column: Recent Courses */}
        <div className="card">
          <div className="flex justify-between items-center mb-lg">
            <h3 style={{ fontSize: "var(--font-size-lg)", fontWeight: 700 }}>Recently Added Courses</h3>
            <Link to="/coordinator/courses" className="btn btn-secondary btn-sm">
              View All <ArrowRight size={14} />
            </Link>
          </div>

          {recentCourses.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">📚</div>
              <div className="empty-state-title">No courses created yet</div>
              <Link to="/coordinator/courses" className="btn btn-primary btn-sm mt-md">Create First Course</Link>
            </div>
          ) : (
            <div className="courses-grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}>
              {recentCourses.map((course) => (
                <div key={course._id} className="course-card">
                  {course.thumbnail ? (
                    <img className="course-thumbnail" src={course.thumbnail} alt={course.title} />
                  ) : (
                    <div className="course-thumbnail-placeholder">📚 {course.title.slice(0, 2).toUpperCase()}</div>
                  )}
                  <div className="course-body">
                    <div className="course-category">{course.category}</div>
                    <div className="course-title" style={{ fontSize: "var(--font-size-sm)" }}>{course.title}</div>
                    <div className="course-meta">
                      <span className={`level-badge level-${course.level}`}>{course.level}</span>
                      <span className="text-xs text-muted">{course.language}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Quick Links */}
        <div className="card flex flex-col gap-md">
          <h3 style={{ fontSize: "var(--font-size-lg)", fontWeight: 700, marginBottom: "var(--space-sm)" }}>Portal Control Center</h3>
          
          <div className="flex flex-col gap-sm">
            <Link to="/coordinator/courses" className="btn btn-secondary w-full justify-between">
              Manage Courses
              <ChevronRightIcon />
            </Link>
            <Link to="/coordinator/educators" className="btn btn-secondary w-full justify-between">
              Manage Educators
              <ChevronRightIcon />
            </Link>
            <Link to="/coordinator/learners" className="btn btn-secondary w-full justify-between">
              Manage Students
              <ChevronRightIcon />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function ChevronRightIcon() {
  return <ArrowRight size={16} style={{ marginLeft: "auto" }} />;
}
