// pages/admin/settings.jsx
import { useEffect, useState } from "react";
import AdminGuard from "../../components/AdminGuard";

function SettingsPage() {
  const [adminKey, setAdminKey] = useState("");
  const [showKey, setShowKey] = useState(false);
  const [saving, setSaving] = useState(false);

  // notification toggles
  const [notifyNewUser, setNotifyNewUser] = useState(false);
  const [notifyNewLead, setNotifyNewLead] = useState(false);
  const [notifyErrors, setNotifyErrors] = useState(false);

  useEffect(() => {
    // read key from sessionStorage or env fallback
    const key = (typeof window !== "undefined" && (sessionStorage.getItem("admin_key") || process.env.NEXT_PUBLIC_ADMIN_KEY)) || "";
    setAdminKey(key);

    // load toggles from localStorage (if any)
    try {
      const s = localStorage.getItem("admin_settings");
      if (s) {
        const parsed = JSON.parse(s);
        setNotifyNewUser(!!parsed.notifyNewUser);
        setNotifyNewLead(!!parsed.notifyNewLead);
        setNotifyErrors(!!parsed.notifyErrors);
      }
    } catch (e) {
      console.warn("Failed to read admin settings", e);
    }
  }, []);

  const masked = (k) => {
    if (!k) return "Not set";
    if (showKey) return k;
    // mask middle part
    if (k.length <= 8) return k[0] + "••••" + k.slice(-1);
    const head = k.slice(0, 4);
    const tail = k.slice(-4);
    return `${head}••••••${tail}`;
  };

  const copyKey = async () => {
    try {
      await navigator.clipboard.writeText(adminKey || "");
      alert("Admin key copied to clipboard");
    } catch (e) {
      alert("Copy failed — please select and copy manually");
    }
  };

  const toggleAndSave = (which, value) => {
    if (which === "user") setNotifyNewUser(value);
    if (which === "lead") setNotifyNewLead(value);
    if (which === "errors") setNotifyErrors(value);
    // save to localStorage
    const payload = {
      notifyNewUser: which === "user" ? value : notifyNewUser,
      notifyNewLead: which === "lead" ? value : notifyNewLead,
      notifyErrors: which === "errors" ? value : notifyErrors,
    };
    try {
      localStorage.setItem("admin_settings", JSON.stringify(payload));
    } catch (e) {
      console.warn("Failed to save admin settings", e);
    }
  };

  const saveToServerIfAvailable = async () => {
    // optional: if API exists, try saving server-side
    setSaving(true);
    const payload = {
      notifyNewUser,
      notifyNewLead,
      notifyErrors,
    };
    try {
      const res = await fetch("/api/admin/settings/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-key": sessionStorage.getItem("admin_key") || process.env.NEXT_PUBLIC_ADMIN_KEY,
        },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        alert("Settings saved");
      } else {
        // fallback: local saved already
        console.warn("Server settings save failed");
        alert("Saved locally (server not available)");
      }
    } catch (err) {
      console.warn("Server save error", err);
      alert("Saved locally (server not available)");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ padding: 20, maxWidth: 900, margin: "0 auto" }}>
      <h2 style={{ marginTop: 0 }}>Admin Settings</h2>

      <section style={card}>
        <h3 style={{ marginTop: 0 }}>Admin API Key</h3>
        <p style={{ marginTop: 4, marginBottom: 8, color: "#555" }}>
          The admin key is used to call protected admin APIs. Never expose your real backend keys publicly.
        </p>

        <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
          <div style={{ fontFamily: "monospace", background: "#f3f4f6", padding: "8px 12px", borderRadius: 6 }}>
            {masked(adminKey)}
          </div>

          <button onClick={() => setShowKey(s => !s)} style={btnSecondary}>
            {showKey ? "Hide" : "Show"}
          </button>

          <button onClick={copyKey} style={btnPrimary}>Copy</button>

          <button
            onClick={() => {
              // regeneration must be done server-side / .env — show instruction
              const ok = confirm("To change the admin key you must update .env.local or rotate the key on the server. Open instructions?");
              if (ok) {
                // open a small modal-like instruction (simple alert)
                alert(
`Rotate Admin Key — steps (manual):
1) Edit .env.local on server/project and change ADMIN_API_KEY and NEXT_PUBLIC_ADMIN_KEY (if needed).
2) Restart Next.js server (npm run dev or redeploy).
3) If using Vercel, update project environment variables and redeploy.
Do not paste secrets in public channels.`
                );
              }
            }}
            style={btnWarning}
          >
            Rotate / Change
          </button>
        </div>

        <div style={{ marginTop: 12, color: "#666", fontSize: 13 }}>
          Tip: For local dev you can keep admin key in <code>NEXT_PUBLIC_ADMIN_KEY</code> for convenience.
        </div>
      </section>

      <section style={{ ...card, marginTop: 16 }}>
        <h3 style={{ marginTop: 0 }}>Notifications</h3>
        <p style={{ marginTop: 4, marginBottom: 8, color: "#555" }}>Toggle what admin should be notified about.</p>

        <div style={{ display: "grid", gap: 8 }}>
          <label style={toggleRow}>
            <div>
              <div style={{ fontWeight: 600 }}>New User Registrations</div>
              <div style={{ fontSize: 13, color: "#666" }}>Notify when a new user registers.</div>
            </div>
            <input
              type="checkbox"
              checked={notifyNewUser}
              onChange={(e) => toggleAndSave("user", e.target.checked)}
            />
          </label>

          <label style={toggleRow}>
            <div>
              <div style={{ fontWeight: 600 }}>New Leads / Enquiries</div>
              <div style={{ fontSize: 13, color: "#666" }}>Notify on incoming leads.</div>
            </div>
            <input
              type="checkbox"
              checked={notifyNewLead}
              onChange={(e) => toggleAndSave("lead", e.target.checked)}
            />
          </label>

          <label style={toggleRow}>
            <div>
              <div style={{ fontWeight: 600 }}>Critical Errors</div>
              <div style={{ fontSize: 13, color: "#666" }}>Notify when server errors are reported.</div>
            </div>
            <input
              type="checkbox"
              checked={notifyErrors}
              onChange={(e) => toggleAndSave("errors", e.target.checked)}
            />
          </label>
        </div>

        <div style={{ marginTop: 12, display: "flex", gap: 8, justifyContent: "flex-end" }}>
          <button onClick={() => {
            // reset to saved
            const s = localStorage.getItem("admin_settings");
            if (s) {
              const p = JSON.parse(s);
              setNotifyNewUser(!!p.notifyNewUser);
              setNotifyNewLead(!!p.notifyNewLead);
              setNotifyErrors(!!p.notifyErrors);
              alert("Restored saved settings");
            } else {
              setNotifyNewUser(false); setNotifyNewLead(false); setNotifyErrors(false);
              alert("Cleared to defaults");
            }
          }} style={btnCancel}>Reset</button>

          <button onClick={saveToServerIfAvailable} style={btnPrimary} disabled={saving}>
            {saving ? "Saving..." : "Save Settings"}
          </button>
        </div>
      </section>

      <section style={{ ...card, marginTop: 16 }}>
        <h3 style={{ marginTop: 0 }}>Advanced</h3>
        <p style={{ color: "#666", marginTop: 6 }}>
          Actions like rotating the admin key or changing environment variables must be done on the server or hosting provider.
        </p>
        <div style={{ marginTop: 8 }}>
          <button onClick={() => {
            alert("Recommended: Use MongoDB Atlas for production, and store ADMIN_API_KEY in hosting env variables (Vercel/Netlify).");
          }} style={btnSecondary}>Deployment Tips</button>
        </div>
      </section>
    </div>
  );
}

/* wrap the page */
export default function SettingsWithGuard(props) {
  return (
    <AdminGuard>
      <SettingsPage {...props} />
    </AdminGuard>
  );
}

/* styles */
const card = { background: "#fff", padding: 16, borderRadius: 8, boxShadow: "0 1px 6px rgba(0,0,0,0.04)" };
const btnPrimary = { padding: "8px 12px", background: "#27457a", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer" };
const btnSecondary = { padding: "8px 12px", background: "#f3f4f6", color: "#111827", border: "1px solid #e5e7eb", borderRadius: 6, cursor: "pointer" };
const btnWarning = { padding: "8px 12px", background: "#f59e0b", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer" };
const btnCancel = { padding: "8px 12px", background: "#e5e7eb", color: "#111827", border: "none", borderRadius: 6, cursor: "pointer" };

const toggleRow = { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid #f3f4f6" };
