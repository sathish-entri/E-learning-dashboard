import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/axios";
import { useAuth } from "../../context/AuthContext";
import {
  BookOpen, Users, ClipboardList, Plus, X, Video,
  Calendar, Check, UserCheck, Sparkles, Send, Award, Download
} from "lucide-react";
import toast from "react-hot-toast";

export default function ClassroomDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, socket } = useAuth();

  const [classroom, setClassroom] = useState(null);
  const [activeTab, setActiveTab] = useState("studyplan");
  const [loading, setLoading] = useState(true);

  // Lists
  const [studyPlan, setStudyPlan] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [allStudents, setAllStudents] = useState([]);

  // Modals
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showGradeModal, setShowGradeModal] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);

  // Selected for grading
  const [selectedSub, setSelectedSub] = useState(null);

  // Forms
  const [planForm, setPlanForm] = useState({ topic: "", description: "", resources: "" });
  const [assignForm, setAssignForm] = useState({ title: "", description: "", dueDate: "", maxMarks: 100 });
  const [gradeForm, setGradeForm] = useState({ marks: "", feedback: "" });

  const fetchClassroomDetails = async () => {
    try {
      const { data } = await api.get(`/educator/classrooms/${id}`);
      if (data.success) setClassroom(data.data);
    } catch {
      toast.error("Failed to load classroom details");
    }
  };

  const fetchStudyPlan = async () => {
    try {
      const { data } = await api.get(`/educator/classrooms/${id}/studyplan`);
      if (data.success) setStudyPlan(data.data);
    } catch { /* silent */ }
  };

  const fetchAssignments = async () => {
    try {
      const { data } = await api.get(`/educator/classrooms/${id}/assignments`);
      if (data.success) setAssignments(data.data);
    } catch { /* silent */ }
  };

  const fetchAllStudents = async () => {
    try {
      const { data } = await api.get("/coordinator/learners");
      if (data.success) setAllStudents(data.data);
    } catch { /* silent */ }
  };

  const loadAll = async () => {
    setLoading(true);
    await Promise.all([
      fetchClassroomDetails(),
      fetchStudyPlan(),
      fetchAssignments(),
      fetchAllStudents(),
    ]);
    setLoading(false);
  };

  useEffect(() => {
    loadAll();
  }, [id]);

  const handleStartLive = async () => {
    try {
      const { data } = await api.post(`/live/start/${id}`, { title: `${classroom.classname} - Live Class` });
      if (data.success) {
        toast.success("Live session initialized! Redirecting...");
        
        // Emit Socket.io notification
        socket?.emit("live:start", {
          classroomId: id,
          sessionId: data.data.session._id,
          roomUrl: data.data.roomUrl,
          hostName: user.name,
          classroomName: classroom.classname,
          studentIds: data.studentIds,
        });

        navigate(`/educator/live/${data.data.session._id}`);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to start live session");
    }
  };

  const handleAddPlan = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post(`/educator/classrooms/${id}/studyplan`, planForm);
      if (data.success) {
        toast.success("Study plan item added!");
        setShowPlanModal(false);
        setPlanForm({ topic: "", description: "", resources: "" });
        fetchStudyPlan();
      }
    } catch {
      toast.error("Failed to add study plan");
    }
  };

  const handleCreateAssignment = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post(`/educator/classrooms/${id}/assignments`, assignForm);
      if (data.success) {
        toast.success("Assignment published!");
        setShowAssignModal(false);
        setAssignForm({ title: "", description: "", dueDate: "", maxMarks: 100 });
        fetchAssignments();
      }
    } catch {
      toast.error("Failed to create assignment");
    }
  };

  const handleAddStudent = async (studentId) => {
    try {
      const { data } = await api.post(`/educator/classrooms/${id}/students`, { studentId });
      if (data.success) {
        toast.success("Student added successfully!");
        fetchClassroomDetails();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add student");
    }
  };

  const openGradeModal = async (sub) => {
    setSelectedSub(sub);
    setGradeForm({ marks: sub.marks || "", feedback: sub.feedback || "" });
    setShowGradeModal(true);
  };

  const handleGradeSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post(`/educator/submissions/${selectedSub._id}/marks`, gradeForm);
      if (data.success) {
        toast.success("Submission graded successfully!");
        setShowGradeModal(false);
        
        // Refetch submissions for active assignment
        const activeAssignId = selectedSub.assignmentId;
        const subRes = await api.get(`/educator/assignments/${activeAssignId}/submissions`);
        if (subRes.data.success) setSubmissions(subRes.data.data);
      }
    } catch {
      toast.error("Failed to grade submission");
    }
  };

  const handleViewSubmissions = async (assignId) => {
    setActiveTab("submissions");
    try {
      const { data } = await api.get(`/educator/assignments/${assignId}/submissions`);
      if (data.success) setSubmissions(data.data);
    } catch {
      toast.error("Failed to load submissions");
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
      {/* Detail Header */}
      <div className="card-glass flex justify-between items-center mb-xl" style={{ gap: "var(--space-md)", flexWrap: "wrap" }}>
        <div>
          <span className="classroom-subject">{classroom.subject}</span>
          <h2 className="page-title">{classroom.classname}</h2>
          <div className="flex gap-md mt-sm text-sm text-secondary">
            {classroom.schedule && (
              <span className="flex items-center gap-xs">
                <Calendar size={14} /> {classroom.schedule}
              </span>
            )}
            <span className="flex items-center gap-xs">
              <Users size={14} /> {classroom.studentlist?.length || 0} enrolled students
            </span>
          </div>
        </div>

        <button className="btn btn-live btn-lg" onClick={handleStartLive}>
          <Video size={18} /> Start Live Class
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-sm mb-lg" style={{ borderBottom: "1px solid var(--border)", paddingBottom: "var(--space-sm)" }}>
        {[
          { id: "studyplan", label: "Study Plan", icon: <BookOpen size={16} /> },
          { id: "assignments", label: "Assignments", icon: <ClipboardList size={16} /> },
          { id: "students", label: "Students", icon: <Users size={16} /> },
          activeTab === "submissions" && { id: "submissions", label: "Grading Panel", icon: <Award size={16} /> }
        ].filter(Boolean).map((t) => (
          <button
            key={t.id}
            className={`btn btn-sm ${activeTab === t.id ? "btn-primary" : "btn-secondary"}`}
            onClick={() => setActiveTab(t.id)}
          >
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {/* Tab Panels */}
      {activeTab === "studyplan" && (
        <div className="flex flex-col gap-md">
          <div className="flex justify-between items-center">
            <h3 style={{ fontSize: "var(--font-size-lg)", fontWeight: 700 }}>Curriculum & Topics</h3>
            <button className="btn btn-secondary btn-sm" onClick={() => setShowPlanModal(true)}>
              <Plus size={14} /> Add Topic
            </button>
          </div>

          {studyPlan.length === 0 ? (
            <div className="card empty-state">
              <div className="empty-state-title">No Topics Created</div>
              <p className="empty-state-text">Populate the study plan with step-by-step topics and references.</p>
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
          <div className="flex justify-between items-center">
            <h3 style={{ fontSize: "var(--font-size-lg)", fontWeight: 700 }}>Published Assignments</h3>
            <button className="btn btn-secondary btn-sm" onClick={() => setShowAssignModal(true)}>
              <Plus size={14} /> Publish Assignment
            </button>
          </div>

          {assignments.length === 0 ? (
            <div className="card empty-state">
              <div className="empty-state-title">No Assignments</div>
              <p className="empty-state-text">Create assignments to assess student performance.</p>
            </div>
          ) : (
            assignments.map((assign) => (
              <div key={assign._id} className="card flex justify-between items-start gap-md">
                <div>
                  <h4 style={{ fontWeight: 700 }}>{assign.title}</h4>
                  <p className="text-secondary text-sm mt-xs">{assign.description}</p>
                  <div className="flex gap-md mt-md text-xs text-muted">
                    <span>Max Marks: {assign.maxMarks}</span>
                    {assign.dueDate && <span>Due Date: {new Date(assign.dueDate).toLocaleDateString()}</span>}
                  </div>
                </div>
                <button className="btn btn-secondary btn-sm" onClick={() => handleViewSubmissions(assign._id)}>
                  View Submissions
                </button>
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === "students" && (
        <div className="flex flex-col gap-md">
          <div className="flex justify-between items-center">
            <h3 style={{ fontSize: "var(--font-size-lg)", fontWeight: 700 }}>Enrolled Learners</h3>
            <button className="btn btn-secondary btn-sm" onClick={() => setShowInviteModal(true)}>
              <Plus size={14} /> Add Students
            </button>
          </div>

          {classroom.studentlist?.length === 0 ? (
            <div className="card empty-state">
              <div className="empty-state-title">No Students Enrolled</div>
              <p className="empty-state-text">Click below to invite learners to your classroom.</p>
              <button className="btn btn-primary btn-sm mt-md" onClick={() => setShowInviteModal(true)}>Add Student</button>
            </div>
          ) : (
            <div className="table-wrap">
              <table className="table">
                <thead>
                  <tr>
                    <th>Student Name</th>
                    <th>Email</th>
                    <th>Mobile</th>
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
                          <span style={{ fontWeight: 600 }}>{student.name}</span>
                        </div>
                      </td>
                      <td>{student.email}</td>
                      <td>{student.mobile || "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {activeTab === "submissions" && (
        <div className="flex flex-col gap-md animate-in">
          <h3 style={{ fontSize: "var(--font-size-lg)", fontWeight: 700 }}>Submitted Projects / Homework</h3>
          
          {submissions.length === 0 ? (
            <div className="card empty-state">
              <div className="empty-state-title">No Submissions Found</div>
              <p className="empty-state-text">No students have uploaded work for this assignment yet.</p>
            </div>
          ) : (
            <div className="table-wrap">
              <table className="table">
                <thead>
                  <tr>
                    <th>Student</th>
                    <th>File</th>
                    <th>Grade Status</th>
                    <th>Score</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {submissions.map((sub) => (
                    <tr key={sub._id}>
                      <td>{sub.studentId?.name}</td>
                      <td>
                        {sub.fileUrl ? (
                          <a href={sub.fileUrl} target="_blank" rel="noreferrer" className="btn btn-secondary btn-xs">
                            <Download size={12} /> View File
                          </a>
                        ) : (
                          <span className="text-muted">No attachment</span>
                        )}
                      </td>
                      <td>
                        <span className={`badge ${sub.status === "graded" ? "badge-success" : "badge-warning"}`}>
                          {sub.status === "graded" ? "Graded" : "Pending review"}
                        </span>
                      </td>
                      <td>
                        {sub.status === "graded" ? (
                          <span className="font-bold">{sub.marks} marks</span>
                        ) : (
                          <span className="text-muted">—</span>
                        )}
                      </td>
                      <td>
                        <button className="btn btn-secondary btn-xs" onClick={() => openGradeModal(sub)}>
                          {sub.status === "graded" ? "Change Grade" : "Evaluate"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Invite/Add Student Modal */}
      {showInviteModal && (
        <div className="modal-overlay">
          <div className="modal" style={{ maxWidth: "500px" }}>
            <div className="modal-header">
              <h3 className="modal-title">Enroll Student</h3>
              <button className="modal-close" onClick={() => setShowInviteModal(false)}><X size={16} /></button>
            </div>
            <div className="flex flex-col gap-md" style={{ maxHeight: "350px", overflowY: "auto" }}>
              {allStudents
                .filter(s => !classroom.studentlist?.some(enrolled => enrolled._id === s._id))
                .map((student) => (
                  <div key={student._id} className="flex justify-between items-center p-sm bg-glass" style={{ background: "var(--bg-glass)", padding: "var(--space-sm)", borderRadius: "var(--radius-sm)" }}>
                    <div>
                      <div style={{ fontWeight: 600 }}>{student.name}</div>
                      <div className="text-xs text-muted">{student.email}</div>
                    </div>
                    <button className="btn btn-secondary btn-sm" onClick={() => handleAddStudent(student._id)}>Add</button>
                  </div>
                ))}
              {allStudents.filter(s => !classroom.studentlist?.some(enrolled => enrolled._id === s._id)).length === 0 && (
                <p className="text-center text-muted">All registered learners are already enrolled.</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Study Plan Modal */}
      {showPlanModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3 className="modal-title">Add Study Topic</h3>
              <button className="modal-close" onClick={() => setShowPlanModal(false)}><X size={16} /></button>
            </div>
            <form onSubmit={handleAddPlan} className="flex flex-col gap-md">
              <div className="form-group">
                <label className="form-label">Topic Title</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Introduction to Electromagnetism"
                  value={planForm.topic}
                  onChange={(e) => setPlanForm({ ...planForm, topic: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  className="form-control"
                  placeholder="Explain learning goals, concepts discussed..."
                  value={planForm.description}
                  onChange={(e) => setPlanForm({ ...planForm, description: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Resource URL (optional)</label>
                <input
                  type="url"
                  className="form-control"
                  placeholder="https://example.com/slides"
                  value={planForm.resources}
                  onChange={(e) => setPlanForm({ ...planForm, resources: e.target.value })}
                />
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowPlanModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Add Topic</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Assignment Modal */}
      {showAssignModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3 className="modal-title">Publish Assignment</h3>
              <button className="modal-close" onClick={() => setShowAssignModal(false)}><X size={16} /></button>
            </div>
            <form onSubmit={handleCreateAssignment} className="flex flex-col gap-md">
              <div className="form-group">
                <label className="form-label">Title</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Lab Report 1: Velocity & Torque"
                  value={assignForm.title}
                  onChange={(e) => setAssignForm({ ...assignForm, title: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Description / Instructions</label>
                <textarea
                  className="form-control"
                  placeholder="Write clear instructions for submitting work..."
                  value={assignForm.description}
                  onChange={(e) => setAssignForm({ ...assignForm, description: e.target.value })}
                  required
                />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-md)" }}>
                <div className="form-group">
                  <label className="form-label">Max Marks</label>
                  <input
                    type="number"
                    className="form-control"
                    value={assignForm.maxMarks}
                    onChange={(e) => setAssignForm({ ...assignForm, maxMarks: Number(e.target.value) })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Due Date</label>
                  <input
                    type="date"
                    className="form-control"
                    value={assignForm.dueDate}
                    onChange={(e) => setAssignForm({ ...assignForm, dueDate: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowAssignModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Publish</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Grade submission Modal */}
      {showGradeModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3 className="modal-title">Evaluate Submission</h3>
              <button className="modal-close" onClick={() => setShowGradeModal(false)}><X size={16} /></button>
            </div>
            <form onSubmit={handleGradeSubmit} className="flex flex-col gap-md">
              <div className="form-group">
                <label className="form-label">Award Score</label>
                <input
                  type="number"
                  className="form-control"
                  placeholder={`Max: ${selectedSub?.assignmentId?.maxMarks || 100}`}
                  value={gradeForm.marks}
                  onChange={(e) => setGradeForm({ ...gradeForm, marks: Number(e.target.value) })}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Teacher Feedback</label>
                <textarea
                  className="form-control"
                  placeholder="Provide constructive feedback for student improvement..."
                  value={gradeForm.feedback}
                  onChange={(e) => setGradeForm({ ...gradeForm, feedback: e.target.value })}
                />
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowGradeModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Save Assessment</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
