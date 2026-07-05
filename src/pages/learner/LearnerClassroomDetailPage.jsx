import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/axios";
import {
  BookOpen, Users, ClipboardList, Video, Calendar,
  Download, Upload, CheckCircle2, AlertCircle, X, Award
} from "lucide-react";
import toast from "react-hot-toast";

export default function LearnerClassroomDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [classroom, setClassroom] = useState(null);
  const [activeTab, setActiveTab] = useState("studyplan");
  const [loading, setLoading] = useState(true);

  // Lists
  const [studyPlan, setStudyPlan] = useState([]);
  const [assignments, setAssignments] = useState([]);
  
  // Submission map (assignmentId -> submission data)
  const [submissions, setSubmissions] = useState({});
  const [uploadingId, setUploadingId] = useState(null);
  const [fileMap, setFileMap] = useState({});

  const fetchClassroomDetails = async () => {
    try {
      const { data } = await api.get(`/learner/classrooms/${id}`);
      if (data.success) setClassroom(data.data);
    } catch {
      toast.error("Failed to load classroom details");
    }
  };

  const fetchClasswork = async () => {
    try {
      const { data } = await api.get(`/learner/classrooms/${id}/classwork`);
      if (data.success) {
        setStudyPlan(data.data.studyPlans);
        setAssignments(data.data.assignments);
        
        // Fetch submission for each assignment
        const subs = {};
        await Promise.all(
          data.data.assignments.map(async (a) => {
            try {
              const subRes = await api.get(`/learner/assignments/${a._id}/my-submission`);
              if (subRes.data.success && subRes.data.data) {
                subs[a._id] = subRes.data.data;
              }
            } catch { /* ignore */ }
          })
        );
        setSubmissions(subs);
      }
    } catch { /* silent */ }
  };

  const loadAll = async () => {
    setLoading(true);
    await Promise.all([
      fetchClassroomDetails(),
      fetchClasswork(),
    ]);
    setLoading(false);
  };

  useEffect(() => {
    loadAll();
  }, [id]);

  const handleFileChange = (assignId, file) => {
    setFileMap((prev) => ({ ...prev, [assignId]: file }));
  };

  const handleUploadSubmit = async (assignId) => {
    const file = fileMap[assignId];
    if (!file) {
      toast.error("Please choose a file first");
      return;
    }
    setUploadingId(assignId);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const { data } = await api.post(`/learner/assignments/${assignId}/submit`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (data.success) {
        toast.success("Assignment submitted successfully!");
        
        // Update local submissions map
        setSubmissions((prev) => ({ ...prev, [assignId]: data.data }));
        
        // Clear file input cache
        setFileMap((prev) => {
          const next = { ...prev };
          delete next[assignId];
          return next;
        });
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to submit assignment");
    } finally {
      setUploadingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center" style={{ minHeight: "400px" }}>
        <div className="spinner" />
      </div>
    );
  }

  if (!classroom) return <div>Classroom not found</div>;

  return (
    <div className="animate-in">
      {/* Header card */}
      <div className="card-glass flex justify-between items-center mb-xl" style={{ gap: "var(--space-md)", flexWrap: "wrap" }}>
        <div>
          <span className="classroom-subject">{classroom.subject}</span>
          <h2 className="page-title">{classroom.classname}</h2>
          <div className="flex gap-md mt-sm text-sm text-secondary">
            <span className="flex items-center gap-xs">
              Instructor: <strong>{classroom.educatorId?.name}</strong>
            </span>
            {classroom.schedule && (
              <span className="flex items-center gap-xs">
                <Calendar size={14} /> {classroom.schedule}
              </span>
            )}
          </div>
        </div>

        {classroom.isLive ? (
          <button
            className="btn btn-live btn-lg"
            onClick={() => navigate(`/learner/classroom/${id}`)} // Will join live room via live class flow
          >
            <Video size={18} /> Join Live Class
          </button>
        ) : (
          <div className="badge badge-muted" style={{ padding: "8px 16px" }}>Offline</div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-sm mb-lg" style={{ borderBottom: "1px solid var(--border)", paddingBottom: "var(--space-sm)" }}>
        {[
          { id: "studyplan", label: "Study Plan", icon: <BookOpen size={16} /> },
          { id: "assignments", label: "Assignments", icon: <ClipboardList size={16} /> },
          { id: "classmates", label: "Classmates", icon: <Users size={16} /> },
        ].map((t) => (
          <button
            key={t.id}
            className={`btn btn-sm ${activeTab === t.id ? "btn-primary" : "btn-secondary"}`}
            onClick={() => setActiveTab(t.id)}
          >
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {/* Panels */}
      {activeTab === "studyplan" && (
        <div className="flex flex-col gap-md">
          <h3 style={{ fontSize: "var(--font-size-lg)", fontWeight: 700 }}>Class Curriculum</h3>
          
          {studyPlan.length === 0 ? (
            <div className="card empty-state">
              <div className="empty-state-title">No Topics Uploaded</div>
              <p className="empty-state-text">Your instructor hasn't added any topics to the study plan yet.</p>
            </div>
          ) : (
            studyPlan.map((plan) => (
              <div key={plan._id} className="card">
                <h4 style={{ fontWeight: 700, fontSize: "var(--font-size-base)", color: "var(--primary-light)" }}>{plan.topic}</h4>
                <p className="text-secondary text-sm mt-xs">{plan.description}</p>
                {plan.resources && (
                  <div className="mt-md p-md bg-secondary" style={{ borderRadius: "var(--radius-sm)", padding: "var(--space-md)", background: "var(--bg-secondary)" }}>
                    <span className="text-xs text-muted font-bold block mb-xs">Reference Links / Resources</span>
                    <a href={plan.resources} target="_blank" rel="noreferrer" className="text-xs text-accent" style={{ textDecoration: "underline" }}>{plan.resources}</a>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === "assignments" && (
        <div className="flex flex-col gap-md">
          <h3 style={{ fontSize: "var(--font-size-lg)", fontWeight: 700 }}>Assignments</h3>

          {assignments.length === 0 ? (
            <div className="card empty-state">
              <div className="empty-state-title">No Assignments Due</div>
              <p className="empty-state-text">No active assignments are posted for this classroom.</p>
            </div>
          ) : (
            assignments.map((assign) => {
              const sub = submissions[assign._id];
              return (
                <div key={assign._id} className="card flex justify-between items-start gap-md flex-wrap">
                  <div style={{ flex: 1, minWidth: "250px" }}>
                    <h4 style={{ fontWeight: 700 }}>{assign.title}</h4>
                    <p className="text-secondary text-sm mt-xs">{assign.description}</p>
                    <div className="flex gap-md mt-md text-xs text-muted">
                      <span>Max Marks: {assign.maxMarks}</span>
                      {assign.dueDate && <span>Due Date: {new Date(assign.dueDate).toLocaleDateString()}</span>}
                    </div>
                  </div>

                  <div style={{ minWidth: "220px" }}>
                    {sub ? (
                      <div className="flex flex-col gap-xs p-sm bg-glass" style={{ background: "var(--bg-glass)", padding: "var(--space-sm)", borderRadius: "var(--radius-md)" }}>
                        <span className="flex items-center gap-xs text-xs font-bold" style={{ color: "var(--success)" }}>
                          <CheckCircle2 size={14} /> Submitted
                        </span>
                        {sub.status === "graded" ? (
                          <div style={{ marginTop: "4px" }}>
                            <div className="text-xs text-muted">Score:</div>
                            <div className="font-bold flex items-center gap-xs" style={{ fontSize: "var(--font-size-lg)", color: "var(--primary-light)" }}>
                              <Award size={18} /> {sub.marks} / {assign.maxMarks}
                            </div>
                            {sub.feedback && (
                              <p className="text-xs text-secondary mt-xs" style={{ fontStyle: "italic" }}>
                                " {sub.feedback} "
                              </p>
                            )}
                          </div>
                        ) : (
                          <span className="text-xs text-muted">Pending review from instructor</span>
                        )}
                      </div>
                    ) : (
                      <div className="flex flex-col gap-sm">
                        <div className="flex items-center gap-xs">
                          <label className="btn btn-secondary btn-sm" style={{ cursor: "pointer", flex: 1 }}>
                            <Upload size={14} /> Choose File
                            <input
                              type="file"
                              style={{ display: "none" }}
                              onChange={(e) => handleFileChange(assign._id, e.target.files[0])}
                            />
                          </label>
                        </div>
                        {fileMap[assign._id] && (
                          <div className="text-xs text-accent truncate" style={{ maxWidth: "200px" }}>
                            Selected: {fileMap[assign._id].name}
                          </div>
                        )}
                        <button
                          className="btn btn-primary btn-sm w-full"
                          onClick={() => handleUploadSubmit(assign._id)}
                          disabled={uploadingId === assign._id}
                        >
                          {uploadingId === assign._id ? "Uploading..." : "Submit Project"}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {activeTab === "classmates" && (
        <div className="flex flex-col gap-md">
          <h3 style={{ fontSize: "var(--font-size-lg)", fontWeight: 700 }}>Classmates</h3>
          
          {classroom.studentlist?.length === 0 ? (
            <div className="card empty-state">
              <div className="empty-state-title">No classmates yet</div>
            </div>
          ) : (
            <div className="table-wrap">
              <table className="table">
                <thead>
                  <tr>
                    <th>Student Name</th>
                  </tr>
                </thead>
                <tbody>
                  {classroom.studentlist.map((student) => (
                    <tr key={student._id}>
                      <td>
                        <div className="flex items-center gap-sm">
                          <div className="avatar-sm">
                            {student.profilePic ? <img src={student.profilePic} alt={student.name} /> : student.name.charAt(0).toUpperCase()}
                          </div>
                          <span>{student.name}</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
