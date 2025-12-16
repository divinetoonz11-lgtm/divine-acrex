// File: pages/dealer/add-property.jsx
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
  const [photos, setPhotos] = useState([]); // File objects
  const [videos, setVideos] = useState([]); // File objects
  const [previewImgs, setPreviewImgs] = useState([]); // dataURL previews
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  // client-side limits
  const MAX_PHOTOS = 8;
  const MAX_VIDEOS = 2;

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  }

  function handlePhotos(e) {
    const files = Array.from(e.target.files || []);
    if (files.length + photos.length > MAX_PHOTOS) {
      setMsg(`You can upload up to ${MAX_PHOTOS} photos.`);
      return;
    }
    // keep files and generate previews
    setPhotos((p) => [...p, ...files]);
    files.forEach((f) => {
      const reader = new FileReader();
      reader.onload = (ev) =>
        setPreviewImgs((p) => [...p, { id: Date.now() + Math.random(), src: ev.target.result }]);
      reader.readAsDataURL(f);
    });
    setMsg("");
  }

  function handleVideos(e) {
    const files = Array.from(e.target.files || []);
    if (files.length + videos.length > MAX_VIDEOS) {
      setMsg(`You can upload up to ${MAX_VIDEOS} videos.`);
      return;
    }
    setVideos((p) => [...p, ...files]);
    setMsg("");
  }

  function removePhoto(index) {
    setPhotos((p) => p.filter((_, i) => i !== index));
    setPreviewImgs((p) => p.filter((_, i) => i !== index));
  }

  function removeVideo(index) {
    setVideos((p) => p.filter((_, i) => i !== index));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setMsg("");
    // basic validation
    if (!form.title || !form.price || !form.location) {
      setMsg("Please fill Title, Price and Location.");
      return;
    }
    setSaving(true);

    try {
      // Demo: we'll send metadata + first photo as dataURL (so dashboard shows image).
      // For production replace with actual file upload to storage.
      let image = "/images/listing-placeholder.png";
      if (previewImgs.length > 0) image = previewImgs[0].src;

      const body = {
        ...form,
        price: Number(form.price) || 0,
        bhk: form.bhk ? Number(form.bhk) : 0,
        area: form.area ? Number(form.area) : 0,
        image,
        status: "active",
        featured: false,
      };

      const res = await fetch("/api/properties", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const j = await res.json();
      if (!res.ok) throw new Error(j?.error || "Server error");
      setMsg("Property posted (demo). Redirecting...");
      // small delay so user sees message
      setTimeout(() => Router.push("/dealer/dashboard"), 800);
    } catch (err) {
      console.error(err);
      setMsg("Unable to save. Try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div style={{ minHeight: "100vh", display: "flex", fontFamily: "Inter, sans-serif", background: "#f6f8fb" }}>
      {/* Sidebar (kept visible always) */}
      <aside style={{ width: 300, background: "#07102a", color: "#fff", padding: 20, boxSizing: "border-box" }}>
        <div style={{ marginBottom: 20 }}>
          <div style={{ width: 44, height: 44, borderRadius: 8, background: "#fff", overflow: "hidden" }}>
            <img src="/images/login-1.png" alt="avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </div>
        </div>

        <nav style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <Link href="/dealer/dashboard" style={navLink(true)}>Dashboard</Link>
          <Link href="/dealer/add-property" style={navLink(true)}>Add Property</Link>
          <Link href="/dealer/leads" style={navLink(false)}>Leads</Link>
          <Link href="/dealer/plans" style={navLink(false)}>Plans</Link>
          <Link href="/dealer/payments" style={navLink(false)}>Payments</Link>
          <Link href="mailto:devindtooonz11@gmail.com" style={navLink(false)}>Support</Link>
        </nav>

        <div style={{ marginTop: 26 }}>
          <Link href="/post-property">
            <button style={{ width: "100%", padding: 12, borderRadius: 8, background: "#2b6ef6", color: "#fff", border: "none", fontWeight: 700 }}>
              List your property (FREE)
            </button>
          </Link>
        </div>

        <div style={{ marginTop: 18 }}>
          <button onClick={() => alert("Demo logout")} style={{ width: "100%", padding: 10, borderRadius: 8, background: "#ef4444", border: "none", color: "#fff" }}>
            Logout
          </button>
        </div>
      </aside>

      {/* Main */}
      <main style={{ flex: 1, padding: 28 }}>
        <h1 style={{ marginTop: 0 }}>Add Property</h1>
        <p style={{ color: "#6b7280" }}>Fill details and upload photos/videos (demo save in-memory)</p>

        <form onSubmit={handleSubmit} style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: 20, alignItems: "start" }}>
          {/* Left column */}
          <div>
            <div style={{ marginBottom: 12 }}>
              <label style={label}>Property Title *</label>
              <input name="title" value={form.title} onChange={handleChange} style={input} />
            </div>

            <div style={{ display: "flex", gap: 12, marginBottom: 12, flexWrap: "wrap" }}>
              <div style={{ flex: 1, minWidth: 140 }}>
                <label style={label}>Price (₹) *</label>
                <input name="price" value={form.price} onChange={handleChange} style={input} />
              </div>
              <div style={{ width: 120 }}>
                <label style={label}>BHK</label>
                <input name="bhk" value={form.bhk} onChange={handleChange} style={input} />
              </div>
              <div style={{ width: 140 }}>
                <label style={label}>Area (sqft)</label>
                <input name="area" value={form.area} onChange={handleChange} style={input} />
              </div>
            </div>

            <div style={{ marginBottom: 12 }}>
              <label style={label}>Location *</label>
              <input name="location" value={form.location} onChange={handleChange} style={input} />
            </div>

            <div style={{ marginBottom: 12 }}>
              <label style={label}>Owner Mobile</label>
              <input name="mobile" value={form.mobile} onChange={handleChange} style={input} placeholder="e.g. 9876543210" />
            </div>

            <div style={{ marginBottom: 12 }}>
              <label style={label}>Description (optional)</label>
              <textarea name="description" value={form.description} onChange={handleChange} rows={6} style={{ ...input, resize: "vertical" }} />
            </div>

            <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
              <button type="submit" disabled={saving} style={primaryBtn}>{saving ? "Saving..." : "Save Property"}</button>
              <Link href="/dealer/dashboard" style={ghostBtn}>Cancel</Link>
            </div>

            {msg && <div style={{ marginTop: 12, color: "#0b63d6" }}>{msg}</div>}
          </div>

          {/* Right column: media */}
          <div>
            <div style={{ marginBottom: 10 }}>
              <label style={label}>Photos (Max {MAX_PHOTOS})</label>
              <input type="file" accept="image/*" multiple onChange={handlePhotos} />
              <div style={{ fontSize: 12, color: "#6b7280", marginTop: 6 }}>Upload up to {MAX_PHOTOS} images (JPG/PNG). Preview shown below.</div>
            </div>

            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 12 }}>
              {previewImgs.map((im, idx) => (
                <div key={im.id} style={{ width: 88, height: 68, borderRadius: 6, overflow: "hidden", position: "relative", border: "1px solid #e6eefb" }}>
                  <img src={im.src} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  <button type="button" onClick={() => removePhoto(idx)} style={{ position: "absolute", right: 4, top: 4, background: "rgba(0,0,0,0.5)", color: "#fff", border: "none", borderRadius: 4, padding: "2px 6px", cursor: "pointer" }}>x</button>
                </div>
              ))}
            </div>

            <div style={{ marginBottom: 10 }}>
              <label style={label}>Videos (Max {MAX_VIDEOS})</label>
              <input type="file" accept="video/*" multiple onChange={handleVideos} />
              <div style={{ fontSize: 12, color: "#6b7280", marginTop: 6 }}>Upload up to {MAX_VIDEOS} videos (MP4). Large files may not be supported in demo.</div>
            </div>

            <div style={{ display: "flex", gap: 8, flexDirection: "column", marginTop: 12 }}>
              <div style={{ fontSize: 13, fontWeight: 700 }}>Preview</div>
              {videos.length === 0 ? <div style={{ fontSize: 13, color: "#6b7280" }}>No videos selected</div> :
                videos.map((v, i) => <div key={i} style={{ fontSize: 13 }}>{v.name} <button type="button" onClick={() => removeVideo(i)} style={{ marginLeft: 8 }}>Remove</button></div>)}
            </div>
          </div>
        </form>
      </main>
    </div>
  );
}

/* small styles (inline for easy paste) */
const navLink = (active) => ({
  display: "block",
  padding: "10px 12px",
  borderRadius: 8,
  color: active ? "#fff" : "#bcd0ff",
  background: active ? "rgba(255,255,255,0.04)" : "transparent",
  textDecoration: "none",
  fontWeight: 700
});
const label = { display: "block", fontSize: 13, marginBottom: 6, color: "#465b7a" };
const input = { width: "100%", padding: 10, borderRadius: 8, border: "1px solid #e6eefb", boxSizing: "border-box" };
const primaryBtn = { padding: "10px 14px", borderRadius: 8, border: "none", background: "#315DFF", color: "#fff", fontWeight: 800, cursor: "pointer" };
const ghostBtn = { display: "inline-block", padding: "10px 14px", borderRadius: 8, textDecoration: "none", border: "1px solid #e6eefb", color: "#111", background: "#fff" };
