import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/axios";
import { useAuth } from "../../context/AuthContext";
import { Send, LogOut, MessageSquare, Users, Video } from "lucide-react";
import DailyIframe from "@daily-co/daily-js";
import toast from "react-hot-toast";

export default function LiveRoom() {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const { user, socket } = useAuth();

  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [chatOpen, setChatOpen] = useState(true);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [participantsCount, setParticipantsCount] = useState(1);

  const containerRef = useRef(null);
  const callFrameRef = useRef(null);

  // 1. Fetch Session Info
  useEffect(() => {
    const fetchSession = async () => {
      try {
        const { data } = await api.get(`/live/${sessionId}`);
        if (data.success) {
          setSession(data.data);
          
          // Join socket room
          socket?.emit("live:join", {
            sessionId,
            userId: user._id,
            userName: user.name,
          });
        }
      } catch {
        toast.error("Live session not found");
        navigate("/dashboard");
      } finally {
        setLoading(false);
      }
    };
    if (user) fetchSession();
  }, [sessionId, user, socket]);

  // 2. Set Up Socket Event Listeners for Chat & Presence
  useEffect(() => {
    if (!socket) return;

    socket.on("live:chat_message", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    socket.on("live:participant_joined", ({ userName }) => {
      toast(`${userName} joined the class`, { icon: "👋" });
      setParticipantsCount((c) => c + 1);
    });

    socket.on("live:ended", () => {
      toast.error("This live class session has ended.");
      cleanupCall();
      navigate(user.role === "educator" ? "/educator" : "/learner");
    });

    return () => {
      socket.off("live:chat_message");
      socket.off("live:participant_joined");
      socket.off("live:ended");
    };
  }, [socket, user]);

  // 3. Mount Daily.co or Fallback Jitsi Call Frame
  useEffect(() => {
    if (!session || !containerRef.current) return;

    const isDaily = session.roomUrl.includes("daily.co");

    if (isDaily) {
      // Initialize Daily call frame
      const frame = DailyIframe.createFrame(containerRef.current, {
        iframeStyle: {
          width: "100%",
          height: "100%",
          border: "0",
          backgroundColor: "#000000",
        },
        showLeaveButton: true,
      });

      frame.join({ url: session.roomUrl });
      callFrameRef.current = frame;

      // Track participants count via Daily API
      frame.on("participant-joined", () => {
        setParticipantsCount(Object.keys(frame.participants()).length);
      });
      frame.on("participant-left", () => {
        setParticipantsCount(Object.keys(frame.participants()).length);
      });
    }

    return () => {
      cleanupCall();
    };
  }, [session]);

  const cleanupCall = () => {
    if (callFrameRef.current) {
      try {
        callFrameRef.current.destroy();
      } catch { /* suppress */ }
      callFrameRef.current = null;
    }
  };

  const handleSendChat = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    socket?.emit("live:chat", {
      sessionId,
      userId: user._id,
      userName: user.name,
      message: inputText.trim(),
    });
    setInputText("");
  };

  const handleEndClass = async () => {
    if (!window.confirm("Are you sure you want to end this live class for everyone?")) return;
    try {
      const { data } = await api.post(`/live/end/${sessionId}`);
      if (data.success) {
        toast.success("Live session closed!");
        
        // Notify all participants via socket to leave
        socket?.emit("live:end", {
          classroomId: session.classroomId._id,
          studentIds: session.classroomId.studentlist || [],
        });

        cleanupCall();
        navigate("/educator");
      }
    } catch {
      toast.error("Failed to end class");
    }
  };

  const handleLeaveClass = () => {
    cleanupCall();
    navigate(user.role === "educator" ? "/educator" : "/learner");
  };

  if (loading) {
    return (
      <div className="loading-page">
        <div className="spinner" />
        <p>Connecting to session stream...</p>
      </div>
    );
  }

  if (!session) return null;

  const isHost = user._id === session.hostId?._id;
  const isDaily = session.roomUrl.includes("daily.co");

  return (
    <div className="live-room animate-in">
      {/* Top Header Row */}
      <div className="live-topbar">
        <div className="flex items-center gap-md">
          <div className="live-badge">LIVE</div>
          <div>
            <h2 style={{ fontSize: "var(--font-size-base)", fontWeight: 700 }}>{session.title}</h2>
            <p className="text-xs text-muted">
              Classroom: {session.classroomId?.classname} | Host: {session.hostId?.name}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-md">
          <span className="flex items-center gap-xs text-sm text-secondary">
            <Users size={16} /> {participantsCount} online
          </span>

          <button className="btn btn-secondary btn-sm" onClick={() => setChatOpen(!chatOpen)}>
            <MessageSquare size={16} /> {chatOpen ? "Hide Chat" : "Show Chat"}
          </button>

          {isHost ? (
            <button className="btn btn-danger btn-sm" onClick={handleEndClass}>
              End Session for All
            </button>
          ) : (
            <button className="btn btn-secondary btn-sm" onClick={handleLeaveClass}>
              <LogOut size={14} /> Leave Call
            </button>
          )}
        </div>
      </div>

      {/* Main split display: Video Stream + Chat Panel */}
      <div className="live-main-area">
        {/* Left Side: Video frame */}
        <div className="live-video-wrap" ref={containerRef}>
          {!isDaily && (
            // Use Jitsi iframe fallback
            <iframe
              title="Jitsi Live Call"
              src={session.roomUrl}
              allow="camera; microphone; fullscreen; display-capture; autoplay"
            />
          )}
        </div>

        {/* Right Side: Socket.io real-time chat */}
        {chatOpen && (
          <div className="live-chat-panel">
            <div className="notif-header" style={{ padding: "var(--space-md)", background: "var(--bg-card)" }}>
              <span>Interactive Chat</span>
            </div>
            
            <div className="live-chat-messages">
              {messages.length === 0 ? (
                <div className="text-center text-muted text-xs mt-xl">
                  No chat messages yet. Introduce yourself!
                </div>
              ) : (
                messages.map((m, idx) => (
                  <div key={idx} className="chat-message">
                    <div className="chat-message-name">{m.userName}</div>
                    <div className="chat-message-text">{m.message}</div>
                  </div>
                ))
              )}
            </div>

            <form onSubmit={handleSendChat} className="live-chat-input">
              <input
                id="live-chat-msg"
                type="text"
                className="form-control"
                placeholder="Type a message..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
              />
              <button type="submit" className="btn btn-primary btn-icon">
                <Send size={16} />
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
