import { useEffect, useState } from "react";
import api from "../../api/axios";
import { BookOpen, Users, ClipboardList, Plus, X, Video, ArrowRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function EducatorDashboard() {
  const [stats, setStats] = useState({ totalClassrooms: 0, totalStudents: 0, totalAssignments: 0 });
  const [classrooms, setClassrooms] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    classname: "",
    subject: "",
    description: "",
    schedule: "",
  });

  const fetchData = async () => {
    try {
      const [statsRes, classRes, coursesRes] = await Promise.all([
        api.get("/educator/stats"),
        api.get("/educator/classrooms"),
        api.get("/learner/courses"), // reusable endpoint to fetch courses list
      ]);
      if (statsRes.data.success) setStats(statsRes.data.data);
      if (classRes.data.success) setClassrooms(classRes.data.data);
      if (coursesRes.data.success) setCourses(coursesRes.data.data);
    } catch (err) {
      toast.error("Failed to load educator dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateClass = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post("/educator/classrooms", form);
      if (data.success) {
        toast.success("Classroom created successfully!");
        setShowCreateModal(false);
        setForm({ classname: "", subject: "", description: "", schedule: "" });
        fetchData();
      }
    } catch (err) {
      toast.error("Failed to create classroom");
    }
  };

  return (
    <div className="animate-in">
      <div className="flex justify-between items-center mb-xl">
        <div className="page-header" style={{ marginBottom: 0 }}>
          <h2 className="page-title">Educator Console</h2>
          <p className="page-subtitle">Manage your classrooms, assignments, and live lectures</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowCreateModal(true)}>
          <Plus size={16} /> Create Classroom
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center" style={{ minHeight: "300px" }}>
          <div className="spinner" />
        </div>
      ) : (
        <>
          {/* Stats Grid */}
          <div className="stats-grid">
            <div className="stat-card" style={{ "--stat-color": "var(--primary)" }}>
              <div className="stat-icon"><BookOpen size={24} /></div>
              <div className="stat-value">{stats.totalClassrooms}</div>
              <div className="stat-label">Classrooms Managed</div>
            </div>

            <div className="stat-card" style={{ "--stat-color": "var(--secondary)" }}>
              <div className="stat-icon"><Users size={24} /></div>
              <div className="stat-value">{stats.totalStudents}</div>
              <div className="stat-label">Total Enrolled Students</div>
            </div>

            <div className="stat-card" style={{ "--stat-color": "var(--accent)" }}>
              <div className="stat-icon"><ClipboardList size={24} /></div>
              <div className="stat-value">{stats.totalAssignments}</div>
              <div className="stat-label">Active Assignments</div>
            </div>
          </div>

          <h3 style={{ fontSize: "var(--font-size-lg)", fontWeight: 700, margin: "var(--space-xl) 0 var(--space-md) 0" }}>My Classrooms</h3>

          {classrooms.length === 0 ? (
            <div className="card empty-state">
              <div className="empty-state-icon">🏫</div>
              <div className="empty-state-title">No Classrooms Yet</div>
              <p className="empty-state-text">Create an active learning classroom environment to invite learners and post material.</p>
              <button className="btn btn-primary mt-md" onClick={() => setShowCreateModal(true)}>
                Create Classroom
              </button>
            </div>
          ) : (
            <div className="classrooms-grid">
              {classrooms.map((cls) => (
                <div
                  key={cls._id}
                  className={`classroom-card ${cls.isLive ? "live" : ""}`}
                  onClick={() => navigate(`/educator/classroom/${cls._id}`)}
                >
                  <div className="flex justify-between items-start">
                    <span className="classroom-subject">{cls.subject}</span>
                    {cls.isLive && <span className="live-badge">Live Class</span>}
                  </div>
                  <h3 className="classroom-name">{cls.classname}</h3>
                  <p className="text-muted text-xs mb-md" style={{ display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                    {cls.description}
                  </p>
                  
                  <div className="classroom-footer">
                    <div className="student-count">
                      <Users size={14} /> {cls.studentlist?.length || 0} Students
                    </div>
                    <span className="text-xs text-muted font-bold flex items-center gap-xs">
                      View Classroom <ArrowRight size={12} />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Create Classroom Modal */}
      {showCreateModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3 className="modal-title">Create Classroom</h3>
              <button className="modal-close" onClick={() => setShowCreateModal(false)}><X size={16} /></button>
            </div>
            
            <form onSubmit={handleCreateClass} className="flex flex-col gap-md">
              <div className="form-group">
                <label className="form-label">Classroom Name</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Physics 101 - Room A"
                  value={form.classname}
                  onChange={(e) => setForm({ ...form, classname: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Subject</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Science"
                  value={form.subject}
                  onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  className="form-control"
                  placeholder="Provide learning objectives or syllabus summaries..."
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Weekly Schedule (optional)</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Mon, Wed, Fri (10:00 AM - 11:30 AM)"
                  value={form.schedule}
                  onChange={(e) => setForm({ ...form, schedule: e.target.value })}
                />
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowCreateModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Create Class</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
