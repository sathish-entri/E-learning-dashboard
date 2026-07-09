import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useAuth } from "./context/AuthContext";

// Layouts & Guards
import AppLayout from "./components/layout/AppLayout";
import ProtectedRoute from "./components/common/ProtectedRoute";

// General Pages
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import NotificationCenter from "./pages/NotificationCenter";

// Coordinator Pages
import CoordinatorDashboard from "./pages/coordinator/CoordinatorDashboard";
import CoursesPage from "./pages/coordinator/CoursesPage";
import EducatorsPage from "./pages/coordinator/EducatorsPage";
import LearnersPage from "./pages/coordinator/LearnersPage";

// Educator Pages
import EducatorDashboard from "./pages/educator/EducatorDashboard";
import ClassroomDetailPage from "./pages/educator/ClassroomDetailPage";

// Learner Pages
import LearnerDashboard from "./pages/learner/LearnerDashboard";
import LearnerClassroomDetailPage from "./pages/learner/LearnerClassroomDetailPage";
import LearnerCoursesPage from "./pages/learner/LearnerCoursesPage";
import ActiveLiveSessionsPage from "./pages/learner/ActiveLiveSessionsPage";
import QuizPage from "./pages/learner/QuizPage";
import AnalyticsDashboard from "./pages/learner/AnalyticsDashboard";

// Live Room
import LiveRoom from "./pages/live/LiveRoom";

// Redirect component based on logged-in role
function DashboardRedirect() {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (user.role === "coordinator") return <Navigate to="/coordinator" replace />;
  if (user.role === "educator") return <Navigate to="/educator" replace />;
  return <Navigate to="/learner" replace />;
}

export default function App() {
  return (
    <>
      <Toaster position="top-right" toastOptions={{ style: { background: "#1e293b", color: "#f1f5f9", border: "1px solid rgba(255,255,255,0.08)" } }} />
      
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Role-based Dashboard Entry Point */}
        <Route path="/" element={<DashboardRedirect />} />
        <Route path="/dashboard" element={<DashboardRedirect />} />

        {/* Live Classes (Full Screen / Call Mode) */}
        <Route path="/educator/live/:sessionId" element={
          <ProtectedRoute allowedRoles={["educator"]}>
            <LiveRoom />
          </ProtectedRoute>
        } />
        <Route path="/learner/live/:sessionId" element={
          <ProtectedRoute allowedRoles={["learner"]}>
            <LiveRoom />
          </ProtectedRoute>
        } />

        {/* Protected Dashboard Routes */}
        <Route element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }>
          {/* Coordinator Portal */}
          <Route path="/coordinator" element={<CoordinatorDashboard />} />
          <Route path="/coordinator/courses" element={<CoursesPage />} />
          <Route path="/coordinator/educators" element={<EducatorsPage />} />
          <Route path="/coordinator/learners" element={<LearnersPage />} />

          {/* Educator Portal */}
          <Route path="/educator" element={<EducatorDashboard />} />
          <Route path="/educator/classrooms" element={<EducatorDashboard />} />
          <Route path="/educator/classroom/:id" element={<ClassroomDetailPage />} />

          {/* Learner Portal */}
          <Route path="/learner" element={<LearnerDashboard />} />
          <Route path="/learner/classrooms" element={<LearnerDashboard />} />
          <Route path="/learner/classroom/:id" element={<LearnerClassroomDetailPage />} />
          <Route path="/learner/courses" element={<LearnerCoursesPage />} />
          <Route path="/learner/live" element={<ActiveLiveSessionsPage />} />
          <Route path="/learner/quiz/:quizId" element={<QuizPage />} />
          <Route path="/learner/analytics" element={<AnalyticsDashboard />} />

          {/* Profile & Notifications */}
          <Route path="/profile" element={<Profile />} />
          <Route path="/notifications" element={<NotificationCenter />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}
