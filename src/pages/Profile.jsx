import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";
import { User, Phone, BookOpen, Upload } from "lucide-react";
import toast from "react-hot-toast";

export default function Profile() {
  const { user, login } = useAuth();
  
  const [form, setForm] = useState({
    name: user?.name || "",
    bio: user?.bio || "",
    mobile: user?.mobile || "",
  });
  const [profilePic, setProfilePic] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(user?.profilePic || "");
  const [saving, setSaving] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePic(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("bio", form.bio);
    formData.append("mobile", form.mobile);
    if (profilePic) formData.append("profilePic", profilePic);

    try {
      const { data } = await api.put("/auth/profile", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      if (data.success) {
        toast.success("Profile updated successfully!");
        // Reload page to re-fetch state from me endpoint
        window.location.reload();
      }
    } catch {
      toast.error("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  if (!user) return null;

  return (
    <div className="animate-in" style={{ maxWidth: "700px", margin: "0 auto" }}>
      <div className="page-header">
        <h2 className="page-title">My Profile</h2>
        <p className="page-subtitle">Update your personal account credentials and profile picture</p>
      </div>

      <div className="card">
        <form onSubmit={handleSubmit} className="flex flex-col gap-lg">
          
          {/* Avatar upload section */}
          <div className="flex items-center gap-lg flex-wrap">
            <div className="sidebar-user-avatar" style={{ width: "90px", height: "90px", fontSize: "2rem" }}>
              {previewUrl ? <img src={previewUrl} alt={user.name} /> : user.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <label className="btn btn-secondary btn-sm" style={{ cursor: "pointer" }}>
                <Upload size={14} /> Upload New Photo
                <input type="file" accept="image/*" style={{ display: "none" }} onChange={handleFileChange} />
              </label>
              <p className="text-xs text-muted mt-xs">Allowed formats: PNG, JPG, JPEG, WEBP. Max 5MB.</p>
            </div>
          </div>

          <hr style={{ border: "0", borderTop: "1px solid var(--border)" }} />

          {/* Form details */}
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <div style={{ position: "relative" }}>
              <input
                id="profile-name"
                type="text"
                className="form-control"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Mobile Number</label>
            <input
              id="profile-mobile"
              type="tel"
              className="form-control"
              value={form.mobile}
              onChange={(e) => setForm({ ...form, mobile: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">About Me (Bio)</label>
            <textarea
              className="form-control"
              placeholder="Tell us about yourself..."
              value={form.bio}
              onChange={(e) => setForm({ ...form, bio: e.target.value })}
              style={{ minHeight: "120px" }}
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-md)" }}>
            <div className="form-group">
              <label className="form-label">Email Address (Read-only)</label>
              <input type="email" className="form-control" value={user.email} disabled />
            </div>

            <div className="form-group">
              <label className="form-label">Role Badge (Read-only)</label>
              <input type="text" className="form-control" value={user.role.toUpperCase()} disabled />
            </div>
          </div>

          <div className="flex justify-end gap-sm" style={{ marginTop: "var(--space-md)" }}>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? "Saving changes..." : "Save Changes"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
