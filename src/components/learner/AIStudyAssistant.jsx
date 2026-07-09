import { useState, useEffect, useRef } from "react";
import { Bot, X, Send, Sparkles } from "lucide-react";
import api from "../../api/axios";
import ReactMarkdown from "react-markdown";

export default function AIStudyAssistant({ context = "" }) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: "assistant", content: "👋 Hi! I'm your **EduLearn AI Study Assistant** powered by Google Gemini. Ask me anything about your studies — concepts, explanations, formulas, or homework help! 🚀" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    if (open) bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  const sendMessage = async (e) => {
    e.preventDefault();
    const question = input.trim();
    if (!question || loading) return;
    setInput("");
    setMessages(prev => [...prev, { role: "user", content: question }]);
    setLoading(true);

    try {
      const { data } = await api.post("/gamification/ai/ask", { question, context });
      setMessages(prev => [...prev, { role: "assistant", content: data.answer }]);
    } catch (err) {
      setMessages(prev => [...prev, {
        role: "assistant",
        content: "⚠️ Sorry, I'm having trouble connecting right now. Please try again in a moment!"
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Action Button */}
      <button
        id="ai-chat-fab"
        className="ai-chat-fab"
        onClick={() => setOpen(o => !o)}
        title="AI Study Assistant"
        aria-label="Open AI Study Assistant"
      >
        {open ? <X size={24} /> : <Bot size={24} />}
      </button>

      {/* Chat Window */}
      {open && (
        <div className="ai-chat-window" role="dialog" aria-label="AI Study Assistant">
          {/* Header */}
          <div className="ai-chat-header">
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <div style={{
                width: 36, height: 36, borderRadius: "50%",
                background: "linear-gradient(135deg, var(--primary), var(--secondary))",
                display: "flex", alignItems: "center", justifyContent: "center"
              }}>
                <Sparkles size={18} color="#fff" />
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: "var(--font-size-sm)" }}>AI Study Assistant</div>
                <div style={{ fontSize: "0.7rem", color: "var(--success)" }}>● Powered by Gemini</div>
              </div>
            </div>
            <button onClick={() => setOpen(false)} style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", padding: 4 }}>
              <X size={18} />
            </button>
          </div>

          {/* Messages */}
          <div className="ai-chat-messages">
            {messages.map((msg, i) => (
              <div key={i} className={`ai-message ${msg.role}`}>
                {msg.role === "assistant"
                  ? <ReactMarkdown>{msg.content}</ReactMarkdown>
                  : msg.content
                }
              </div>
            ))}
            {loading && (
              <div className="ai-message assistant thinking">
                <div className="ai-thinking-dot" />
                <div className="ai-thinking-dot" />
                <div className="ai-thinking-dot" />
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <form className="ai-chat-input-row" onSubmit={sendMessage}>
            <input
              className="ai-chat-input"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Ask anything about your studies..."
              disabled={loading}
              maxLength={500}
            />
            <button type="submit" className="btn btn-primary" disabled={loading || !input.trim()}
              style={{ padding: "0.5rem 0.75rem", borderRadius: "var(--radius-md)" }}>
              <Send size={16} />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
