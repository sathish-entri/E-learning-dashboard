import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../../api/axios";
import { useAuth } from "../../context/AuthContext";
import { MessageSquare, ThumbsUp, Pin, Reply, Send, ChevronDown, ChevronUp, PlusCircle, X } from "lucide-react";
import { formatDistanceToNow } from "../../utils/time";
import toast from "react-hot-toast";

const TAG_OPTIONS = ["question", "discussion", "resource", "doubt"];

export default function DiscussionForum({ classroomId }) {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [newPost, setNewPost] = useState({ title: "", content: "", tag: "question" });
  const [expandedPost, setExpandedPost] = useState(null);
  const [replyText, setReplyText] = useState({});
  const [sortBy, setSortBy] = useState("recent");

  useEffect(() => { fetchPosts(); }, [classroomId, sortBy]);

  const fetchPosts = async () => {
    try {
      const { data } = await api.get(`/forum/classroom/${classroomId}?sort=${sortBy}`);
      setPosts(data.data);
    } catch { toast.error("Failed to load discussions"); }
    finally { setLoading(false); }
  };

  const createPost = async (e) => {
    e.preventDefault();
    if (!newPost.title.trim() || !newPost.content.trim()) return;
    try {
      const { data } = await api.post(`/forum/classroom/${classroomId}`, newPost);
      setPosts(prev => [data.data, ...prev]);
      setNewPost({ title: "", content: "", tag: "question" });
      setShowCreate(false);
      toast.success("Post created!");
    } catch { toast.error("Failed to create post"); }
  };

  const toggleUpvote = async (postId) => {
    try {
      const { data } = await api.put(`/forum/post/${postId}/upvote`);
      setPosts(prev => prev.map(p => p._id === postId
        ? { ...p, upvotes: data.hasUpvoted ? [...p.upvotes, user._id] : p.upvotes.filter(id => id !== user._id) }
        : p
      ));
    } catch {}
  };

  const addReply = async (postId) => {
    const content = replyText[postId]?.trim();
    if (!content) return;
    try {
      const { data } = await api.post(`/forum/post/${postId}/reply`, { content });
      setPosts(prev => prev.map(p => p._id === postId ? data.data : p));
      setReplyText(prev => ({ ...prev, [postId]: "" }));
      toast.success("Reply added!");
    } catch { toast.error("Failed to add reply"); }
  };

  const togglePin = async (postId) => {
    try {
      await api.put(`/forum/post/${postId}/pin`);
      setPosts(prev => prev.map(p => p._id === postId ? { ...p, isPinned: !p.isPinned } : p));
    } catch {}
  };

  if (loading) return (
    <div>{[1,2,3].map(i => <div key={i} className="skeleton" style={{ height: 100, borderRadius: "var(--radius-lg)", marginBottom: 12 }} />)}</div>
  );

  return (
    <div>
      {/* Toolbar */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem", flexWrap: "wrap", gap: "1rem" }}>
        <div style={{ display: "flex", gap: "0.5rem" }}>
          {["recent", "popular"].map(s => (
            <button key={s} onClick={() => setSortBy(s)}
              className={`btn ${sortBy === s ? "btn-primary" : "btn-secondary"}`}
              style={{ padding: "0.4rem 1rem", fontSize: "var(--font-size-sm)" }}>
              {s === "recent" ? "🕐 Recent" : "🔥 Popular"}
            </button>
          ))}
        </div>
        <button className="btn btn-primary" onClick={() => setShowCreate(!showCreate)} style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <PlusCircle size={16} /> New Post
        </button>
      </div>

      {/* Create Post Form */}
      {showCreate && (
        <div className="glass-card" style={{ marginBottom: "1.5rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1rem" }}>
            <h3 style={{ margin: 0 }}>Create New Post</h3>
            <button onClick={() => setShowCreate(false)} style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer" }}>
              <X size={18} />
            </button>
          </div>
          <form onSubmit={createPost}>
            <div className="form-group">
              <label className="form-label">Tag</label>
              <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                {TAG_OPTIONS.map(t => (
                  <button key={t} type="button"
                    onClick={() => setNewPost(p => ({ ...p, tag: t }))}
                    className={`forum-tag ${t}`}
                    style={{ cursor: "pointer", border: newPost.tag === t ? "2px solid var(--primary)" : "2px solid transparent", padding: "4px 14px" }}>
                    {t}
                  </button>
                ))}
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Title</label>
              <input className="form-input" placeholder="What's your question or topic?" value={newPost.title}
                onChange={e => setNewPost(p => ({ ...p, title: e.target.value }))} required />
            </div>
            <div className="form-group">
              <label className="form-label">Content</label>
              <textarea className="form-input form-textarea" rows={4} placeholder="Describe your question in detail..."
                value={newPost.content} onChange={e => setNewPost(p => ({ ...p, content: e.target.value }))} required />
            </div>
            <button type="submit" className="btn btn-primary w-full">Post to Discussion</button>
          </form>
        </div>
      )}

      {/* Posts List */}
      {posts.length === 0 ? (
        <div style={{ textAlign: "center", padding: "3rem", color: "var(--text-muted)" }}>
          <MessageSquare size={48} style={{ opacity: 0.3, marginBottom: "1rem" }} />
          <p>No discussions yet. Start the first one!</p>
        </div>
      ) : (
        posts.map(post => {
          const isExpanded = expandedPost === post._id;
          const hasUpvoted = post.upvotes.includes(user?._id);
          return (
            <div key={post._id} className={`forum-post-card ${post.isPinned ? "pinned" : ""}`}>
              <div style={{ display: "flex", gap: "1rem", alignItems: "flex-start" }}>
                <div style={{
                  width: 38, height: 38, borderRadius: "50%",
                  background: "linear-gradient(135deg, var(--primary), var(--secondary))",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "1rem", fontWeight: 700, color: "#fff", flexShrink: 0, overflow: "hidden"
                }}>
                  {post.authorId?.profilePic
                    ? <img src={post.authorId.profilePic} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    : post.authorId?.name?.charAt(0)
                  }
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", gap: "0.5rem", alignItems: "center", flexWrap: "wrap", marginBottom: "0.5rem" }}>
                    {post.isPinned && <span style={{ fontSize: "0.65rem", background: "rgba(245,158,11,0.2)", color: "#fbbf24", padding: "2px 8px", borderRadius: "999px", fontWeight: 700 }}>📌 PINNED</span>}
                    <span className={`forum-tag ${post.tag}`}>{post.tag}</span>
                    {post.isResolved && <span style={{ fontSize: "0.65rem", background: "rgba(16,185,129,0.2)", color: "#34d399", padding: "2px 8px", borderRadius: "999px", fontWeight: 700 }}>✅ RESOLVED</span>}
                  </div>
                  <h4 style={{ margin: "0 0 0.25rem", fontSize: "var(--font-size-base)", cursor: "pointer" }}
                    onClick={() => setExpandedPost(isExpanded ? null : post._id)}>
                    {post.title}
                  </h4>
                  <p style={{ fontSize: "var(--font-size-sm)", color: "var(--text-muted)", margin: 0 }}>
                    by {post.authorId?.name} · {formatDistanceToNow(post.createdAt)} · {post.replies.length} replies
                  </p>
                  {isExpanded && (
                    <div style={{ marginTop: "1rem" }}>
                      <p style={{ color: "var(--text-secondary)", lineHeight: 1.7 }}>{post.content}</p>
                      {/* Replies */}
                      {post.replies.length > 0 && (
                        <div style={{ marginTop: "1rem" }}>
                          <p style={{ fontSize: "var(--font-size-sm)", fontWeight: 600, marginBottom: "0.5rem" }}>
                            {post.replies.length} Replies
                          </p>
                          {post.replies.map((reply, ri) => (
                            <div key={ri} className={`forum-reply ${reply.isAnswer ? "is-answer" : ""}`}>
                              {reply.isAnswer && <p style={{ fontSize: "0.7rem", color: "var(--success)", fontWeight: 700, marginBottom: 4 }}>✅ ACCEPTED ANSWER</p>}
                              <div style={{ display: "flex", gap: "0.75rem" }}>
                                <div style={{ width: 28, height: 28, borderRadius: "50%", background: "var(--primary)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.75rem", fontWeight: 700, color: "#fff", flexShrink: 0 }}>
                                  {reply.authorId?.name?.charAt(0)}
                                </div>
                                <div>
                                  <p style={{ fontSize: "var(--font-size-xs)", color: "var(--primary-light)", fontWeight: 600, marginBottom: 4 }}>
                                    {reply.authorId?.name}
                                    {reply.authorId?.role === "educator" && <span style={{ color: "var(--accent)", marginLeft: 4 }}>• Educator</span>}
                                  </p>
                                  <p style={{ fontSize: "var(--font-size-sm)", color: "var(--text-secondary)", lineHeight: 1.6 }}>{reply.content}</p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                      {/* Reply input */}
                      <div style={{ display: "flex", gap: "0.5rem", marginTop: "1rem" }}>
                        <input className="form-input" placeholder="Write a reply..."
                          value={replyText[post._id] || ""}
                          onChange={e => setReplyText(prev => ({ ...prev, [post._id]: e.target.value }))}
                          onKeyDown={e => { if (e.key === "Enter") addReply(post._id); }}
                          style={{ flex: 1 }} />
                        <button className="btn btn-primary" style={{ padding: "0.5rem 0.75rem" }}
                          onClick={() => addReply(post._id)}>
                          <Send size={16} />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              {/* Action row */}
              <div style={{ display: "flex", gap: "0.75rem", marginTop: "1rem", paddingTop: "1rem", borderTop: "1px solid var(--border)" }}>
                <button className={`upvote-btn ${hasUpvoted ? "upvoted" : ""}`} onClick={() => toggleUpvote(post._id)}>
                  <ThumbsUp size={14} /> {post.upvotes.length}
                </button>
                <button className="upvote-btn" onClick={() => setExpandedPost(isExpanded ? null : post._id)}>
                  <Reply size={14} /> Reply
                  {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                </button>
                {user?.role === "educator" && (
                  <button className="upvote-btn" onClick={() => togglePin(post._id)}>
                    <Pin size={14} /> {post.isPinned ? "Unpin" : "Pin"}
                  </button>
                )}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}
