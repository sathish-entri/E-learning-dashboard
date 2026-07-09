import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/axios";
import { Clock, CheckCircle2, XCircle, ArrowRight, Trophy, Zap } from "lucide-react";
import toast from "react-hot-toast";

const LETTER = ["A", "B", "C", "D"];

export default function QuizPage() {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [phase, setPhase] = useState("intro"); // intro | taking | result
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [timeLeft, setTimeLeft] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const [result, setResult] = useState(null);
  const [gradedAnswers, setGradedAnswers] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchQuiz();
  }, [quizId]);

  // Countdown timer
  useEffect(() => {
    if (phase !== "taking" || timeLeft <= 0) return;
    const t = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) { clearInterval(t); handleSubmit(true); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [phase, timeLeft]);

  const fetchQuiz = async () => {
    try {
      const { data } = await api.get(`/quiz/${quizId}`);
      if (data.alreadySubmitted) {
        setResult(data.mySubmission);
        setPhase("result");
      } else {
        setQuiz(data.data);
        setAnswers(new Array(data.data.questions.length).fill(-1));
        setTimeLeft((data.data.timeLimitMinutes || 10) * 60);
      }
    } catch (err) {
      toast.error("Failed to load quiz");
      navigate(-1);
    } finally { setLoading(false); }
  };

  const startQuiz = () => {
    setPhase("taking");
    setStartTime(Date.now());
  };

  const selectOption = (optionIndex) => {
    const updated = [...answers];
    updated[currentQ] = optionIndex;
    setAnswers(updated);
  };

  const handleSubmit = async (autoSubmit = false) => {
    if (submitting) return;
    setSubmitting(true);
    const timeTakenSeconds = startTime ? Math.floor((Date.now() - startTime) / 1000) : 0;
    try {
      const { data } = await api.post(`/quiz/${quizId}/submit`, { answers, timeTakenSeconds });
      setResult(data.data.submission);
      setGradedAnswers(data.data.gradedAnswers);
      setPhase("result");
      if (data.data.newBadges?.length) {
        data.data.newBadges.forEach(b => toast.success(`🏆 Badge Unlocked: ${b.replace(/_/g, " ")}!`));
      }
      if (data.data.isPassed) {
        toast.success(`✅ Passed! +${data.data.xpEarned} XP earned!`);
      } else {
        toast(`Score: ${data.data.percentage}% — Keep practicing!`, { icon: "📚" });
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Submit failed");
    } finally { setSubmitting(false); }
  };

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60).toString().padStart(2, "0");
    const s = (secs % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  if (loading) return (
    <div className="page-container">
      <div className="skeleton skeleton-stat mb-lg" />
      <div className="skeleton skeleton-card" />
    </div>
  );

  // ── INTRO ──────────────────────────────────────────────────────
  if (phase === "intro" && quiz) return (
    <div className="page-container">
      <div style={{ maxWidth: 640, margin: "0 auto" }}>
        <div className="glass-card" style={{ textAlign: "center", padding: "3rem 2rem" }}>
          <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>🧠</div>
          <h1 className="gradient-text" style={{ fontSize: "var(--font-size-3xl)", marginBottom: "0.5rem" }}>
            {quiz.title}
          </h1>
          <p className="text-muted" style={{ marginBottom: "2rem" }}>Topic: {quiz.topic}</p>
          {quiz.description && <p style={{ color: "var(--text-secondary)", marginBottom: "2rem" }}>{quiz.description}</p>}
          <div className="stats-grid" style={{ gridTemplateColumns: "repeat(3,1fr)", marginBottom: "2rem" }}>
            <div className="stat-card" style={{ padding: "1rem" }}>
              <div className="stat-value">{quiz.questions.length}</div>
              <div className="stat-label">Questions</div>
            </div>
            <div className="stat-card" style={{ padding: "1rem" }}>
              <div className="stat-value">{quiz.timeLimitMinutes}m</div>
              <div className="stat-label">Time Limit</div>
            </div>
            <div className="stat-card" style={{ padding: "1rem" }}>
              <div className="stat-value">{quiz.totalMarks}</div>
              <div className="stat-label">Total Marks</div>
            </div>
          </div>
          <p style={{ fontSize: "var(--font-size-sm)", color: "var(--text-muted)", marginBottom: "2rem" }}>
            ⚡ Passing score: 50% &nbsp;|&nbsp; 🏆 XP rewards for passing and perfect scores
          </p>
          <button className="btn btn-primary" style={{ width: "100%", padding: "1rem", fontSize: "1.1rem" }}
            onClick={startQuiz}>
            Start Quiz <ArrowRight size={20} style={{ marginLeft: 8 }} />
          </button>
        </div>
      </div>
    </div>
  );

  // ── TAKING ─────────────────────────────────────────────────────
  if (phase === "taking" && quiz) {
    const q = quiz.questions[currentQ];
    const progress = ((currentQ + 1) / quiz.questions.length) * 100;
    const isWarning = timeLeft <= 60;
    return (
      <div className="page-container">
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          {/* Header */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
            <span style={{ color: "var(--text-muted)", fontSize: "var(--font-size-sm)" }}>
              Question {currentQ + 1} of {quiz.questions.length}
            </span>
            <div className={`quiz-timer ${isWarning ? "warning" : ""}`}>
              <Clock size={18} /> {formatTime(timeLeft)}
            </div>
          </div>
          {/* Progress */}
          <div className="quiz-progress-bar">
            <div className="quiz-progress-fill" style={{ width: `${progress}%` }} />
          </div>
          {/* Question */}
          <div className="quiz-question-card">
            <div className="quiz-question-number">Question {currentQ + 1}</div>
            <p className="quiz-question-text">{q.question}</p>
            <div className="quiz-options-grid">
              {q.options.map((opt, i) => (
                <button key={i}
                  className={`quiz-option ${answers[currentQ] === i ? "selected" : ""}`}
                  onClick={() => selectOption(i)}>
                  <span className="quiz-option-letter">{LETTER[i]}</span>
                  {opt}
                </button>
              ))}
            </div>
          </div>
          {/* Navigation */}
          <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem" }}>
            <button className="btn btn-secondary" disabled={currentQ === 0}
              onClick={() => setCurrentQ(c => c - 1)}>← Previous</button>
            <span style={{ color: "var(--text-muted)", fontSize: "var(--font-size-sm)", alignSelf: "center" }}>
              {answers.filter(a => a !== -1).length}/{quiz.questions.length} answered
            </span>
            {currentQ < quiz.questions.length - 1 ? (
              <button className="btn btn-primary" onClick={() => setCurrentQ(c => c + 1)}>Next →</button>
            ) : (
              <button className="btn btn-primary" disabled={submitting} onClick={() => handleSubmit(false)}>
                {submitting ? "Submitting..." : "Submit Quiz"}
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ── RESULT ─────────────────────────────────────────────────────
  if (phase === "result" && result) return (
    <div className="page-container">
      <div style={{ maxWidth: 680, margin: "0 auto" }}>
        <div className="glass-card">
          <div className="quiz-result-score">
            <div className={`quiz-result-circle ${result.isPassed ? "pass" : "fail"}`}>
              <span>{result.percentage}%</span>
              <span style={{ fontSize: "1rem" }}>{result.isPassed ? "PASS" : "FAIL"}</span>
            </div>
            <h2 style={{ marginBottom: "0.5rem" }}>{result.isPassed ? "🎉 Great job!" : "📚 Keep practicing!"}</h2>
            <p className="text-muted" style={{ marginBottom: "2rem" }}>
              {result.score} / {result.totalMarks} correct answers
            </p>
          </div>

          {/* Graded breakdown */}
          {gradedAnswers.length > 0 && quiz && (
            <div>
              <h3 style={{ marginBottom: "1rem" }}>📝 Answer Review</h3>
              {quiz.questions.map((q, i) => (
                <div key={i} style={{ marginBottom: "1rem", padding: "1rem", borderRadius: "var(--radius-lg)",
                  background: gradedAnswers[i]?.isCorrect ? "rgba(16,185,129,0.1)" : "rgba(239,68,68,0.1)",
                  border: `1px solid ${gradedAnswers[i]?.isCorrect ? "rgba(16,185,129,0.3)" : "rgba(239,68,68,0.3)"}` }}>
                  <div style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start" }}>
                    {gradedAnswers[i]?.isCorrect
                      ? <CheckCircle2 size={20} color="var(--success)" style={{ flexShrink: 0, marginTop: 2 }} />
                      : <XCircle size={20} color="var(--danger)" style={{ flexShrink: 0, marginTop: 2 }} />
                    }
                    <div>
                      <p style={{ fontWeight: 600, marginBottom: 6 }}>{q.question}</p>
                      <p style={{ fontSize: "var(--font-size-sm)", color: "var(--text-muted)" }}>
                        Your answer: <strong style={{ color: gradedAnswers[i]?.isCorrect ? "var(--success)" : "var(--danger)" }}>
                          {q.options[gradedAnswers[i]?.selected] || "Not answered"}
                        </strong>
                      </p>
                      {!gradedAnswers[i]?.isCorrect && (
                        <p style={{ fontSize: "var(--font-size-sm)", color: "var(--success)" }}>
                          Correct: <strong>{q.options[gradedAnswers[i]?.correct]}</strong>
                        </p>
                      )}
                      {gradedAnswers[i]?.explanation && (
                        <p style={{ fontSize: "var(--font-size-sm)", color: "var(--text-muted)", marginTop: 4, fontStyle: "italic" }}>
                          💡 {gradedAnswers[i].explanation}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <button className="btn btn-primary w-full" style={{ marginTop: "1.5rem" }} onClick={() => navigate(-1)}>
            Back to Classroom
          </button>
        </div>
      </div>
    </div>
  );

  return null;
}
