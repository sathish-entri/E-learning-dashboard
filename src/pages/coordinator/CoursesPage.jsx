import { useEffect, useState } from "react";
import api from "../../api/axios";
import { Plus, Edit2, Trash2, X, Upload, BookOpen } from "lucide-react";
import toast from "react-hot-toast";

export default function CoursesPage() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  
  // Form states
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    level: "Beginner",
    duration: "",
    language: "English",
    tags: "",
  });
  const [thumbnail, setThumbnail] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/coordinator/courses");
      if (data.success) setCourses(data.data);
    } catch (err) {
      toast.error("Failed to load courses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const openCreateModal = () => {
    setEditingCourse(null);
    setForm({
      title: "",
      description: "",
      category: "",
      level: "Beginner",
      duration: "",
      language: "English",
      tags: "",
    });
    setThumbnail(null);
    setPreviewUrl("");
    setShowModal(true);
  };

  const openEditModal = (course) => {
    setEditingCourse(course);
    setForm({
      title: course.title,
      description: course.description,
      category: course.category,
      level: course.level,
      duration: course.duration || "",
      language: course.language || "English",
      tags: course.tags?.join(", ") || "",
    });
    setThumbnail(null);
    setPreviewUrl(course.thumbnail || "");
    setShowModal(true);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setThumbnail(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.keys(form).forEach(key => formData.append(key, form[key]));
    if (thumbnail) formData.append("thumbnail", thumbnail);

    try {
      if (editingCourse) {
        const { data } = await api.put(`/coordinator/courses/${editingCourse._id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" }
        });
        if (data.success) {
          toast.success("Course updated successfully");
          setShowModal(false);
          fetchCourses();
        }
      } else {
        const { data } = await api.post("/coordinator/courses", formData, {
          headers: { "Content-Type": "multipart/form-data" }
        });
        if (data.success) {
          toast.success("Course created successfully");
          setShowModal(false);
          fetchCourses();
        }
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save course");
    }
  };

  const handleDelete = async (courseId) => {
    if (!window.confirm("Are you sure you want to delete this course?")) return;
    try {
      const { data } = await api.delete(`/coordinator/courses/${courseId}`);
      if (data.success) {
        toast.success("Course deleted successfully");
        fetchCourses();
      }
    } catch (err) {
      toast.error("Failed to delete course");
    }
  };

  return (
    <div className="animate-in">
      <div className="flex justify-between items-center mb-xl">
        <div className="page-header" style={{ marginBottom: 0 }}>
          <h2 className="page-title">Course Management</h2>
          <p className="page-subtitle">Add, modify, and delete curriculum courses</p>
        </div>
        <button className="btn btn-primary" onClick={openCreateModal}>
          <Plus size={16} /> Add New Course
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center" style={{ minHeight: "300px" }}>
          <div className="spinner" />
        </div>
      ) : courses.length === 0 ? (
        <div className="empty-state card">
          <div className="empty-state-icon">📚</div>
          <div className="empty-state-title">No Courses Available</div>
          <p className="empty-state-text">Get started by creating your first educational course module.</p>
          <button className="btn btn-primary mt-md" onClick={openCreateModal}>
            Create Course
          </button>
        </div>
      ) : (
        <div className="courses-grid">
          {courses.map((course) => (
            <div key={course._id} className="course-card flex flex-col justify-between">
              <div>
                {course.thumbnail ? (
                  <img className="course-thumbnail" src={course.thumbnail} alt={course.title} />
                ) : (
                  <div className="course-thumbnail-placeholder">📚 {course.title.slice(0, 2).toUpperCase()}</div>
                )}
                <div className="course-body">
                  <div className="course-category">{course.category}</div>
                  <h3 className="course-title">{course.title}</h3>
                  <p className="text-muted text-xs mb-md" style={{ display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                    {course.description}
                  </p>
                  <div className="course-meta">
                    <span className={`level-badge level-${course.level}`}>{course.level}</span>
                    <span className="text-xs text-muted">{course.duration || "Self-paced"}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-sm padding-md" style={{ padding: "var(--space-md)", borderTop: "1px solid var(--border)" }}>
                <button className="btn btn-secondary btn-sm flex-1" onClick={() => openEditModal(course)}>
                  <Edit2 size={14} /> Edit
                </button>
                <button className="btn btn-danger btn-sm btn-icon" onClick={() => handleDelete(course._id)}>
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal for Create/Edit */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal" style={{ maxWidth: "600px" }}>
            <div className="modal-header">
              <h3 className="modal-title">{editingCourse ? "Edit Course" : "Create New Course"}</h3>
              <button className="modal-close" onClick={() => setShowModal(false)}><X size={16} /></button>
            </div>
            
            <form onSubmit={handleSubmit} className="flex flex-col gap-md">
              <div className="form-group">
                <label className="form-label">Course Title</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Modern Web Development with React"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  className="form-control"
                  placeholder="Provide a description of the course content..."
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  required
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-md)" }}>
                <div className="form-group">
                  <label className="form-label">Category</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. Computer Science"
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Difficulty Level</label>
                  <select
                    className="form-control"
                    value={form.level}
                    onChange={(e) => setForm({ ...form, level: e.target.value })}
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-md)" }}>
                <div className="form-group">
                  <label className="form-label">Duration</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. 8 weeks or 40 hours"
                    value={form.duration}
                    onChange={(e) => setForm({ ...form, duration: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Language</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. English"
                    value={form.language}
                    onChange={(e) => setForm({ ...form, language: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Tags (comma separated)</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. react, frontend, javascript"
                  value={form.tags}
                  onChange={(e) => setForm({ ...form, tags: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Course Thumbnail</label>
                <div style={{ display: "flex", gap: "var(--space-md)", alignItems: "center" }}>
                  <label className="btn btn-secondary" style={{ cursor: "pointer" }}>
                    <Upload size={16} /> Choose Image
                    <input type="file" accept="image/*" style={{ display: "none" }} onChange={handleFileChange} />
                  </label>
                  {previewUrl && (
                    <img src={previewUrl} alt="Preview" style={{ width: "80px", height: "45px", objectFit: "cover", borderRadius: "var(--radius-sm)", border: "1px solid var(--border)" }} />
                  )}
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Save Course</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
