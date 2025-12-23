// pages/dealer/add-property.jsx
import React, { useState } from "react";
import Link from "next/link";
import Router from "next/router";

export default function DealerAddProperty() {
  const [form, setForm] = useState({
    title: "",
    price: "",
    bhk: "",
    area: "",
    location: "",
    description: "",
    mobile: "",
  });

  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setMsg("");

    if (!form.title || !form.price || !form.location) {
      setMsg("Title, Price & Location are required");
      return;
    }

    setSaving(true);

    try {
      const res = await fetch("/api/dealer/post-property", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!data.ok) throw new Error();

      setMsg("✅ Property submitted for admin approval");
      setTimeout(() => Router.push("/dealer/dashboard"), 1000);
    } catch {
      setMsg("❌ Unable to submit property");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div style={{ padding: 28 }}>
      <h2>Post Property</h2>
      <p style={{ color: "#6b7280" }}>
        This property will go live after admin approval
      </p>

      <form onSubmit={handleSubmit} style={{ maxWidth: 700 }}>
        <label style={label}>Property Title *</label>
        <input name="title" value={form.title} onChange={handleChange} style={input} />

        <label style={label}>Price *</label>
        <input name="price" value={form.price} onChange={handleChange} style={input} />

        <label style={label}>BHK</label>
        <input name="bhk" value={form.bhk} onChange={handleChange} style={input} />

        <label style={label}>Area (sqft)</label>
        <input name="area" value={form.area} onChange={handleChange} style={input} />

        <label style={label}>Location *</label>
        <input name="location" value={form.location} onChange={handleChange} style={input} />

        <label style={label}>Owner Mobile</label>
        <input name="mobile" value={form.mobile} onChange={handleChange} style={input} />

        <label style={label}>Description</label>
        <textarea
          name="description"
          rows={5}
          value={form.description}
          onChange={handleChange}
          style={input}
        />

        <div style={{ marginTop: 16, display: "flex", gap: 12 }}>
          <button disabled={saving} style={primaryBtn}>
            {saving ? "Saving..." : "Submit Property"}
          </button>
          <Link href="/dealer/dashboard" style={cancelBtn}>Cancel</Link>
        </div>

        {msg && <div style={{ marginTop: 12 }}>{msg}</div>}
      </form>
    </div>
  );
}

/* styles */
const label = { marginTop: 12, display: "block", fontWeight: 600 };
const input = {
  width: "100%",
  padding: 10,
  borderRadius: 8,
  border: "1px solid #e5e7eb",
  marginTop: 6,
};
const primaryBtn = {
  padding: "10px 18px",
  borderRadius: 8,
  background: "#2563eb",
  color: "#fff",
  border: "none",
  fontWeight: 700,
};
const cancelBtn = {
  padding: "10px 18px",
  borderRadius: 8,
  background: "#e5e7eb",
  textDecoration: "none",
  color: "#111",
};
