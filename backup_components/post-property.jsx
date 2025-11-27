// pages/post-property.jsx
import React, { useState, useRef, useEffect } from "react";

export default function PostProperty() {
  const [form, setForm] = useState({
    ownerName: "",
    mobile: "",
    propertyType: "",
    bedrooms: "",
    price: "",
    area: "",
    location: "",
    description: "",
  });

  // files state
  const [photos, setPhotos] = useState([]); // array of File
  const [video, setVideo] = useState(null); // single File
  const [photoPreviews, setPhotoPreviews] = useState([]); // array of object URLs
  const [videoPreview, setVideoPreview] = useState(null);

  const photoInputRef = useRef();
  const videoInputRef = useRef();

  // cleanup object URLs on unmount / change
  useEffect(() => {
    return () => {
      photoPreviews.forEach((u) => URL.revokeObjectURL(u));
      if (videoPreview) URL.revokeObjectURL(videoPreview);
    };
  }, [photoPreviews, videoPreview]);

  const handleChange = (key, value) => {
    setForm((s) => ({ ...s, [key]: value }));
  };

  // Photo change: allow multiple but limit to 5 total
  const onPhotosChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    const allowed = files.filter((f) =>
      ["image/jpeg", "image/png", "image/webp"].includes(f.type)
    );

    if (allowed.length !== files.length) {
      alert("Only JPG/PNG/WEBP images are allowed. Other files ignored.");
    }

    const spaceLeft = 5 - photos.length;
    const toAdd = allowed.slice(0, spaceLeft);

    const newPhotos = [...photos, ...toAdd];
    setPhotos(newPhotos);

    const newPreviews = [
      ...photoPreviews,
      ...toAdd.map((f) => URL.createObjectURL(f)),
    ];
    setPhotoPreviews(newPreviews);

    // clear input value so same file can be re-selected if removed later
    if (photoInputRef.current) photoInputRef.current.value = "";
  };

  const removePhoto = (idx) => {
    const removed = photoPreviews[idx];
    if (removed) URL.revokeObjectURL(removed);

    const nextPhotos = photos.filter((_, i) => i !== idx);
    const nextPreviews = photoPreviews.filter((_, i) => i !== idx);
    setPhotos(nextPhotos);
    setPhotoPreviews(nextPreviews);
  };

  // Video change: single file only
  const onVideoChange = (e) => {
    const f = e.target.files && e.target.files[0];
    if (!f) return;

    if (!["video/mp4", "video/webm"].includes(f.type)) {
      alert("Only MP4/WEBM videos allowed.");
      if (videoInputRef.current) videoInputRef.current.value = "";
      return;
    }

    // limit size optionally (e.g., 50MB)
    const maxBytes = 50 * 1024 * 1024;
    if (f.size > maxBytes) {
      alert("Video too large. Max 50 MB.");
      if (videoInputRef.current) videoInputRef.current.value = "";
      return;
    }

    if (videoPreview) URL.revokeObjectURL(videoPreview);
    setVideo(f);
    setVideoPreview(URL.createObjectURL(f));
    if (videoInputRef.current) videoInputRef.current.value = "";
  };

  const removeVideo = () => {
    if (videoPreview) URL.revokeObjectURL(videoPreview);
    setVideo(null);
    setVideoPreview(null);
    if (videoInputRef.current) videoInputRef.current.value = "";
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Basic validation
    if (!form.ownerName || !form.mobile || !form.propertyType) {
      alert("Please fill Owner Name, Mobile and Property Type.");
      return;
    }

    // Build FormData (ready to send to backend)
    const data = new FormData();
    Object.keys(form).forEach((k) => data.append(k, form[k]));

    photos.forEach((p, idx) => {
      data.append("photos[]", p, p.name);
    });

    if (video) data.append("video", video, video.name);

    // For demo: list keys and file names in console (do NOT log file contents)
    console.log("Form keys:");
    for (let pair of data.entries()) {
      if (pair[1] instanceof File) {
        console.log(pair[0], pair[1].name, pair[1].type, pair[1].size);
      } else {
        console.log(pair[0], pair[1]);
      }
    }

    // TODO: send to backend
    // fetch('/api/post-property', { method:'POST', body: data })

    alert("Property submitted (demo). Check console for FormData details.");

    // optional: reset form
    setForm({
      ownerName: "",
      mobile: "",
      propertyType: "",
      bedrooms: "",
      price: "",
      area: "",
      location: "",
      description: "",
    });
    photoPreviews.forEach((u) => URL.revokeObjectURL(u));
    if (videoPreview) URL.revokeObjectURL(videoPreview);
    setPhotos([]);
    setPhotoPreviews([]);
    setVideo(null);
    setVideoPreview(null);
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Post Your Property</h1>

      <form style={styles.form} onSubmit={handleSubmit}>
        <label style={styles.label}>Owner Name</label>
        <input
          style={styles.input}
          type="text"
          value={form.ownerName}
          onChange={(e) => handleChange("ownerName", e.target.value)}
          required
        />

        <label style={styles.label}>Mobile Number</label>
        <input
          style={styles.input}
          type="tel"
          value={form.mobile}
          onChange={(e) => handleChange("mobile", e.target.value)}
          required
        />

        <label style={styles.label}>Property Type</label>
        <select
          style={styles.input}
          value={form.propertyType}
          onChange={(e) => handleChange("propertyType", e.target.value)}
          required
        >
          <option value="">Select</option>
          <option>Residential Apartment</option>
          <option>Independent House</option>
          <option>Villa</option>
          <option>Plot</option>
          <option>Commercial Shop</option>
          <option>Office Space</option>
        </select>

        <label style={styles.label}>Bedrooms</label>
        <select
          style={styles.input}
          value={form.bedrooms}
          onChange={(e) => handleChange("bedrooms", e.target.value)}
        >
          <option value="">Select</option>
          <option>1 BHK</option>
          <option>2 BHK</option>
          <option>3 BHK</option>
          <option>4 BHK</option>
          <option>5+ BHK</option>
        </select>

        <label style={styles.label}>Price (₹)</label>
        <input
          style={styles.input}
          type="number"
          value={form.price}
          onChange={(e) => handleChange("price", e.target.value)}
          required
        />

        <label style={styles.label}>Area (sq.ft.)</label>
        <input
          style={styles.input}
          type="number"
          value={form.area}
          onChange={(e) => handleChange("area", e.target.value)}
          required
        />

        <label style={styles.label}>Location</label>
        <input
          style={styles.input}
          type="text"
          value={form.location}
          onChange={(e) => handleChange("location", e.target.value)}
          required
        />

        <label style={styles.label}>Description</label>
        <textarea
          style={styles.textarea}
          value={form.description}
          onChange={(e) => handleChange("description", e.target.value)}
        />

        {/* Photos upload */}
        <div style={{ marginTop: 8 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <label style={styles.label}>Photos (max 5)</label>
            <small style={{ color: "#666" }}>{photos.length}/5 selected</small>
          </div>

          <input
            ref={photoInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={onPhotosChange}
            style={{ marginTop: 8 }}
          />

          <div style={styles.photosGrid}>
            {photoPreviews.map((src, idx) => (
              <div key={idx} style={styles.thumb}>
                <img src={src} alt={`photo-${idx}`} style={styles.thumbImg} />
                <button
                  type="button"
                  onClick={() => removePhoto(idx)}
                  style={styles.removeBtn}
                  aria-label="Remove photo"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Video upload */}
        <div style={{ marginTop: 12 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <label style={styles.label}>Video (optional, max 50MB)</label>
            <small style={{ color: "#666" }}>{video ? video.name : "No video"}</small>
          </div>

          <input
            ref={videoInputRef}
            type="file"
            accept="video/mp4,video/webm"
            onChange={onVideoChange}
            style={{ marginTop: 8 }}
          />

          {videoPreview && (
            <div style={{ marginTop: 10 }}>
              <video src={videoPreview} controls style={{ width: 300, maxWidth: "100%", borderRadius: 8 }} />
              <div>
                <button type="button" onClick={removeVideo} style={styles.removeVideoBtn}>Remove video</button>
              </div>
            </div>
          )}
        </div>

        <button type="submit" style={styles.submitBtn}>Submit Property</button>
      </form>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "850px",
    margin: "30px auto",
    padding: "20px",
    background: "#fff",
    borderRadius: "12px",
    boxShadow: "0 0 12px rgba(0,0,0,0.08)",
  },
  title: {
    textAlign: "center",
    marginBottom: "18px",
    fontSize: "24px",
    fontWeight: 700,
  },
  form: { display: "flex", flexDirection: "column", gap: "12px" },
  label: { fontWeight: 600, fontSize: 14 },
  input: {
    padding: "10px 12px",
    borderRadius: 6,
    border: "1px solid #ccc",
    fontSize: 14,
  },
  textarea: {
    padding: "10px 12px",
    borderRadius: 6,
    border: "1px solid #ccc",
    minHeight: 90,
    fontSize: 14,
  },
  photosGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(5, 1fr)",
    gap: 8,
    marginTop: 8,
  },
  thumb: {
    position: "relative",
    width: "100%",
    paddingBottom: "100%",
    overflow: "hidden",
    borderRadius: 8,
    background: "#f6f6f6",
  },
  thumbImg: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  removeBtn: {
    position: "absolute",
    top: 6,
    right: 6,
    background: "rgba(0,0,0,0.6)",
    color: "#fff",
    border: "none",
    borderRadius: 6,
    padding: "4px 6px",
    cursor: "pointer",
  },
  removeVideoBtn: {
    marginTop: 8,
    padding: "8px 10px",
    background: "#e74c3c",
    color: "#fff",
    border: "none",
    borderRadius: 6,
    cursor: "pointer",
  },
  submitBtn: {
    marginTop: 16,
    padding: "12px",
    background: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: 16,
    fontWeight: 600,
  },
};
