// pages/dealer/profile.jsx
import React, { useEffect, useState } from "react";
import Router from "next/router";

export default function DealerProfilePage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  const [form, setForm] = useState({
    name: "",
    email: "",
    mobile: "",
    address: "",
    balance: "",
  });

  useEffect(() => {
    // load existing profile from API
    async function load() {
      try {
        const res = await fetch("/api/dealer/profile");
        const j = await res.json();
        if (j?.ok && j.data) {
          setForm((prev) => ({ ...prev, ...j.data }));
        }
      } catch (e) {
        console.error("Profile load error:", e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  }

  function validEmail(em) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em);
  }

  function validMobile(m) {
    // simple 10-digit indian mobile check (allowing country code optional)
    return /^(\+91)?\s?\d{10}$/.test(m.trim());
  }

  async function handleSave(e) {
    e?.preventDefault();
    setMsg("");

    // required fields: name, email, mobile
    if (!form.name?.trim() || !form.email?.trim() || !form.mobile?.trim()) {
      setMsg("Name, Email और Mobile अनिवार्य हैं — सभी भरें (star वाले)।");
      return;
    }
    if (!validEmail(form.email.trim())) {
      setMsg("सही email लिखें (example@domain.com).");
      return;
    }
    if (!validMobile(form.mobile.trim())) {
      setMsg("सही 10-digit मोबाइल नंबर लिखें (e.g. 9876543210).");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch("/api/dealer/profile", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(form),
      });
      const j = await res.json();
      if (j?.ok) {
        setMsg("Profile saved successfully.");
        // small delay, then redirect back to dashboard
        setTimeout(() => Router.push("/dealer/dashboard"), 700);
      } else {
        setMsg("Save failed. Try again.");
      }
    } catch (err) {
      console.error("Save error:", err);
      setMsg("Server error while saving profile.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div style={{ padding: 28, fontFamily: "Inter, sans-serif" }}>
        <div style={{ fontSize: 16, fontWeight: 700 }}>Loading profile…</div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#eef4ff", fontFamily: "Inter, sans-serif", padding: 24 }}>
      <style jsx>{`
        .wrap { max-width: 920px; margin: 0 auto; }
        .card { background: #fff; padding: 22px; border-radius: 12px; border: 1px solid #d9e4ff; box-shadow: 0 12px 30px rgba(15,23,42,0.06); }
        .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        @media (max-width:900px) { .grid { grid-template-columns: 1fr; } }
        .field { background: #f3f8ff; padding: 10px 12px; border-radius: 10px; border: 1px solid rgba(199,219,255,0.9); display:flex; flex-direction:column; gap:6px; }
        .label { font-weight:700; font-size:14px; color:#0b2b66; display:inline-block; padding:2px 8px; border-radius:8px; background: linear-gradient(90deg, rgba(49,93,255,0.03), rgba(49,93,255,0.01)); }
        input, textarea { padding:10px 12px; border-radius:10px; border:1px solid #c7dbff; background:#eef6ff; font-size:14px; }
        textarea { min-height: 90px; resize: vertical; }
        .required { color:#ef4444; margin-left:6px; }
        .actions { display:flex; gap:10px; justify-content:flex-end; margin-top:12px; }
        .btn { padding:10px 14px; border-radius:10px; border:none; font-weight:700; cursor:pointer; }
        .btn.primary { background:#315DFF; color:#fff; box-shadow: 0 8px 20px rgba(49,93,255,0.12); }
        .btn.ghost { background:#fff; border:1px solid #d1d5db; color:#27457a; }
        .hint { color:#6b7280; font-size:13px; margin-top:6px; }
        .top-note { color:#0f1724; font-weight:700; margin-bottom:6px; }
      `}</style>

      <div className="wrap">
        <h2 style={{ marginTop: 0 }}>Dealer Profile</h2>
        <div style={{ color: "#6b7280", marginBottom: 12 }}>Name, Email और Mobile अनिवार्य हैं — बाक़ी optional है।</div>

        <div className="card">
          <form onSubmit={handleSave}>
            <div className="grid">
              <div>
                <div className="field">
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div className="label">Name <span className="required">*</span></div>
                  </div>
                  <input name="name" value={form.name} onChange={handleChange} placeholder="Full name" />
                </div>

                <div className="field">
                  <div className="label">Email <span className="required">*</span></div>
                  <input name="email" value={form.email} onChange={handleChange} placeholder="you@example.com" />
                </div>

                <div className="field">
                  <div className="label">Mobile <span className="required">*</span></div>
                  <input name="mobile" value={form.mobile} onChange={handleChange} placeholder="e.g. 9876543210" />
                  <div className="hint">10-digit mobile number — required for contact</div>
                </div>
              </div>

              <div>
                <div className="field">
                  <div className="label">Address (optional)</div>
                  <textarea name="address" value={form.address} onChange={handleChange} placeholder="Office / personal address" />
                </div>

                <div className="field">
                  <div className="label">Balance / Opening Credit (optional)</div>
                  <input name="balance" value={form.balance} onChange={handleChange} placeholder="e.g. 1000 (₹)" />
                  <div className="hint">Optional — if left empty profile will still save.</div>
                </div>
              </div>
            </div>

            {msg && <div style={{ marginTop: 12, color: "#0b63d6", fontWeight: 700 }}>{msg}</div>}

            <div className="actions" style={{ marginTop: 14 }}>
              <button type="button" className="btn ghost" onClick={() => Router.push("/dealer/dashboard")}>Back</button>
              <button type="submit" className="btn primary" disabled={saving}>
                {saving ? "Saving..." : "Save Profile"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
