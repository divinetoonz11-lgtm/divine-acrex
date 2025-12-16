// pages/admin/profile.jsx
import { useEffect, useState, useRef } from "react";
import AdminGuard from "../../components/AdminGuard";

/**
 * Admin profile page (frontend-only)
 * - View / edit name, email, phone
 * - Change password UI (frontend; actual change needs backend)
 * - Photo preview + local upload (no server upload included)
 * - Saves profile to localStorage as demo; optionally POST to /api/admin/profile/save if available
 */

function ProfilePage() {
  const [profile, setProfile] = useState({ name: "", email: "", phone: "" });
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  // password change fields (local)
  const [oldPwd, setOldPwd] = useState("");
  const [newPwd, setNewPwd] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");
  const [pwdSaving, setPwdSaving] = useState(false);

  // photo
  const [photoDataUrl, setPhotoDataUrl] = useState("");
  const fileRef = useRef(null);

  useEffect(() => {
    // load profile from localStorage (demo)
    try {
      const saved = localStorage.getItem("admin_profile");
      if (saved) {
        setProfile(JSON.parse(saved));
      } else {
        // try reading from session (if server provided)
        const name = sessionStorage.getItem("admin_name") || "";
        const email = sessionStorage.getItem("admin_email") || "";
        if (name || email) setProfile({ name, email, phone: "" });
      }

      const photo = localStorage.getItem("admin_profile_photo");
      if (photo) setPhotoDataUrl(photo);
    } catch (e) {
      console.warn("Failed to load admin profile", e);
    }
  }, []);

  const startEdit = () => setEditing(true);
  const cancelEdit = () => {
    // reload from storage
    try {
      const saved = localStorage.getItem("admin_profile");
      if (saved) setProfile(JSON.parse(saved));
    } catch (e) {}
    setEditing(false);
  };

  const saveProfile = async () => {
    setSaving(true);
    try {
      // try server save if endpoint exists
      const payload = { ...profile };
      let savedOnServer = false;
      try {
        const res = await fetch("/api/admin/profile/save", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-admin-key": sessionStorage.getItem("admin_key") || process.env.NEXT_PUBLIC_ADMIN_KEY,
          },
          body: JSON.stringify(payload),
        });
        if (res.ok) savedOnServer = true;
      } catch (e) {
        // ignore network error
      }

      // always keep local copy for demo
      localStorage.setItem("admin_profile", JSON.stringify(profile));
      alert(savedOnServer ? "Profile saved on server" : "Profile saved locally");
      setEditing(false);
    } catch (err) {
      alert("Save failed: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  const changePassword = async () => {
    if (!oldPwd || !newPwd) return alert("Old and new password required");
    if (newPwd !== confirmPwd) return alert("New password and confirm password do not match");
    setPwdSaving(true);
    try {
      // attempt server call if exists
      try {
        const res = await fetch("/api/admin/profile/change-password", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-admin-key": sessionStorage.getItem("admin_key") || process.env.NEXT_PUBLIC_ADMIN_KEY,
          },
          body: JSON.stringify({ oldPassword: oldPwd, newPassword: newPwd }),
        });
        if (res.ok) {
          alert("Password changed (server)");
          setOldPwd(""); setNewPwd(""); setConfirmPwd("");
          return;
        }
      } catch (e) {
        // fallback
      }

      // fallback (demo only)
      alert("Password change simulated locally (no server)");
      setOldPwd(""); setNewPwd(""); setConfirmPwd("");
    } catch (err) {
      alert("Password change failed: " + err.message);
    } finally {
      setPwdSaving(false);
    }
  };

  const onPickPhoto = (e) => {
    const f = e.target.files && e.target.files[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = function (ev) {
      setPhotoDataUrl(ev.target.result);
      try {
        localStorage.setItem("admin_profile_photo", ev.target.result);
      } catch (e) {
        console.warn("Cannot save photo to localStorage", e);
      }
      // optional: upload to server if API available
    };
    reader.readAsDataURL(f);
  };

  const removePhoto = () => {
    setPhotoDataUrl("");
    try { localStorage.removeItem("admin_profile_photo"); } catch (e) {}
    if (fileRef.current) fileRef.current.value = "";
  };

  return (
    <div style={{ padding: 20, maxWidth: 900, margin: "0 auto" }}>
      <h2 style={{ marginTop: 0 }}>Admin Profile</h2>

      <div style={{ display: "flex", gap: 20, alignItems: "flex-start", marginTop: 12 }}>
        <div style={{ width: 180 }}>
          <div style={{ width: 160, height: 160, borderRadius: 8, overflow: "hidden", background: "#f3f4f6", display: "flex", alignItems: "center", justifyContent: "center" }}>
            {photoDataUrl ? (
              <img src={photoDataUrl} alt="Profile" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            ) : (
              <div style={{ textAlign: "center", color: "#64748b" }}>
                <div style={{ fontSize: 28, fontWeight: 700 }}>{(profile.name || "A").charAt(0).toUpperCase()}</div>
                <div style={{ fontSize: 12 }}>No photo</div>
              </div>
            )}
          </div>

          <div style={{ marginTop: 10, display: "flex", gap: 8, flexWrap: "wrap" }}>
            <label style={btnUpload}>
              Upload
              <input ref={fileRef} onChange={onPickPhoto} type="file" accept="image/*" style={{ display: "none" }} />
            </label>
            <button onClick={removePhoto} style={btnCancel}>Remove</button>
          </div>
        </div>

        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h3 style={{ margin: 0 }}>Account</h3>
            {!editing ? (
              <div style={{ display: "flex", gap: 8 }}>
                <button onClick={startEdit} style={btnPrimary}>Edit</button>
              </div>
            ) : (
              <div style={{ display: "flex", gap: 8 }}>
                <button onClick={cancelEdit} style={btnCancel}>Cancel</button>
                <button onClick={saveProfile} style={btnPrimary} disabled={saving}>{saving ? "Saving..." : "Save"}</button>
              </div>
            )}
          </div>

          <div style={{ marginTop: 12 }}>
            <label style={label}>Name</label>
            <input value={profile.name} onChange={(e) => setProfile(p => ({ ...p, name: e.target.value }))} disabled={!editing} style={input} />

            <label style={{ ...label, marginTop: 8 }}>Email</label>
            <input value={profile.email} onChange={(e) => setProfile(p => ({ ...p, email: e.target.value }))} disabled={!editing} style={input} />

            <label style={{ ...label, marginTop: 8 }}>Phone</label>
            <input value={profile.phone} onChange={(e) => setProfile(p => ({ ...p, phone: e.target.value }))} disabled={!editing} style={input} />
          </div>

          <div style={{ marginTop: 18, borderTop: "1px solid #f3f4f6", paddingTop: 14 }}>
            <h4 style={{ margin: "0 0 8px 0" }}>Change Password</h4>
            <div style={{ maxWidth: 480 }}>
              <label style={label}>Old password</label>
              <input type="password" value={oldPwd} onChange={e => setOldPwd(e.target.value)} style={input} />

              <label style={{ ...label, marginTop: 8 }}>New password</label>
              <input type="password" value={newPwd} onChange={e => setNewPwd(e.target.value)} style={input} />

              <label style={{ ...label, marginTop: 8 }}>Confirm new password</label>
              <input type="password" value={confirmPwd} onChange={e => setConfirmPwd(e.target.value)} style={input} />

              <div style={{ marginTop: 10, display: "flex", gap: 8 }}>
                <button onClick={changePassword} disabled={pwdSaving} style={btnPrimary}>{pwdSaving ? "Saving..." : "Change Password"}</button>
                <button onClick={() => { setOldPwd(""); setNewPwd(""); setConfirmPwd(""); }} style={btnCancel}>Clear</button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

/* wrap with AdminGuard */
export default function ProfileWithGuard(props) {
  return (
    <AdminGuard>
      <ProfilePage {...props} />
    </AdminGuard>
  );
}

/* styles */
const input = { width: "100%", padding: "8px 10px", borderRadius: 6, border: "1px solid #d1d5db", boxSizing: "border-box", marginTop: 6 };
const label = { fontSize: 13, color: "#374151", display: "block", marginTop: 8 };

const btnPrimary = { padding: "8px 12px", background: "#27457a", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer" };
const btnCancel = { padding: "8px 12px", background: "#e5e7eb", color: "#111827", border: "none", borderRadius: 6, cursor: "pointer" };
const btnUpload = { padding: "8px 12px", background: "#f3f4f6", color: "#111827", borderRadius: 6, cursor: "pointer", display: "inline-block", position: "relative", overflow: "hidden" };
