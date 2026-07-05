import { useEffect, useState } from "react";
import api from "../../api/axios";
import { Search } from "lucide-react";
import toast from "react-hot-toast";

export default function LearnerCoursesPage() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const { data } = await api.get("/learner/courses");
        if (data.success) setCourses(data.data);
      } catch {
        toast.error("Failed to fetch courses list");
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  const filteredCourses = courses.filter((c) =>
    c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="animate-in">
      <div className="flex justify-between items-center mb-xl flex-wrap gap-md">
        <div className="page-header" style={{ marginBottom: 0 }}>
          <h2 className="page-title">Browse Courses</h2>
          <p className="page-subtitle">Examine all curriculum programs uploaded by coordinators</p>
        </div>

        <div className="topbar-search" style={{ minWidth: "300px" }}>
          <Search size={16} style={{ color: "var(--text-muted)", flexShrink: 0 }} />
          <input
            type="text"
            placeholder="Search by title or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center" style={{ minHeight: "300px" }}>
          <div className="spinner" />
        </div>
      ) : filteredCourses.length === 0 ? (
        <div className="card empty-state">
          <div className="empty-state-title">No Courses Found</div>
          <p className="empty-state-text">No courses match your search criteria.</p>
        </div>
      ) : (
        <div className="courses-grid">
          {filteredCourses.map((course) => (
            <div key={course._id} className="course-card">
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
                  <span className="text-xs text-muted">Lang: {course.language}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
