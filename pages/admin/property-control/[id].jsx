import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import AdminLayout from "../../../components/admin/AdminLayout";
import AdminGuard from "../../../components/AdminGuard";

function PropertyControlPage() {
  const router = useRouter();
  const { id } = router.query;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [title, setTitle] = useState("");
  const [city, setCity] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState([]);

  /* ================= LOAD PROPERTY ================= */
  useEffect(() => {
    if (!router.isReady || !id) return;

    setLoading(true);

    fetch(`/api/admin/properties?id=${id}`)
      .then(res => res.json())
      .then(data => {
        const p = data?.property || data;
        if (!p || !p._id) return;

        setTitle(p.title || "");
        setCity(p.city || "");
        setPrice(p.price || "");
        setDescription(p.description || "");
        setImages(Array.isArray(p.images) ? p.images : []);
      })
      .finally(() => {
        setLoading(false); // ✅ VERY IMPORTANT
      });
  }, [router.isReady, id]);

  /* ================= CLOUDINARY UPLOAD ================= */
  const uploadToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "property_images");
    formData.append("folder", "divineacres/properties");

    const res = await fetch(
      "https://api.cloudinary.com/v1_1/dzym7cbx2/image/upload",
      { method: "POST", body: formData }
    );

    const data = await res.json();
    return data.secure_url;
  };

  /* ================= IMAGE SELECT ================= */
  const onImageUpload = async (e) => {
    const files = Array.from(e.target.files);

    for (const file of files) {
      if (images.length >= 5) break;

      const url = await uploadToCloudinary(file);
      if (!url) continue;

      setImages(prev => [...prev, url]);
    }
  };

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  /* ================= SAVE ================= */
  const saveChanges = async () => {
    setSaving(true);

    const res = await fetch("/api/admin/properties/update", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id,
        title,
        city,
        price,
        description,
        images, // ✅ cloudinary URLs
      }),
    });

    const data = await res.json();
    setSaving(false);

    if (!data.ok) {
      alert("Save failed");
      return;
    }

    alert("Property updated successfully");
    router.push("/admin/properties");
  };

  /* ================= UI ================= */
  if (loading) {
    return <AdminLayout>Loading property…</AdminLayout>;
  }

  return (
    <AdminLayout>
      <h1>Property Control</h1>

      <div style={row}>
        <label>Title</label>
        <input value={title} onChange={e => setTitle(e.target.value)} style={input} />
      </div>

      <div style={row}>
        <label>City</label>
        <input value={city} onChange={e => setCity(e.target.value)} style={input} />
      </div>

      <div style={row}>
        <label>Price</label>
        <input value={price} onChange={e => setPrice(e.target.value)} style={input} />
      </div>

      <div style={row}>
        <label>Description</label>
        <textarea
          value={description}
          onChange={e => setDescription(e.target.value)}
          rows={4}
          style={textarea}
        />
      </div>

      <h3>Property Photos (Max 5)</h3>

      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        {images.map((img, i) => (
          <div key={i} style={{ position: "relative" }}>
            <img
              src={img}
              alt=""
              style={{ width: 140, height: 100, objectFit: "cover" }}
            />
            <button onClick={() => removeImage(i)} style={removeBtn}>✕</button>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 12 }}>
        <input type="file" multiple accept="image/*" onChange={onImageUpload} />
      </div>

      <div style={{ marginTop: 30 }}>
        <button onClick={() => router.back()} style={btn}>Back</button>
        <button
          onClick={saveChanges}
          disabled={saving}
          style={{ ...btn, background: "#2563eb" }}
        >
          {saving ? "Saving…" : "Save Changes"}
        </button>
      </div>
    </AdminLayout>
  );
}

export default function Page() {
  return (
    <AdminGuard>
      <PropertyControlPage />
    </AdminGuard>
  );
}

/* ================= STYLES ================= */
const row = { marginBottom: 14 };
const input = { width: "100%", padding: 8, border: "1px solid #d1d5db", borderRadius: 6 };
const textarea = { width: "100%", padding: 8, border: "1px solid #d1d5db", borderRadius: 6 };
const btn = { padding: "8px 14px", marginRight: 10, border: "none", borderRadius: 6, background: "#111827", color: "#fff" };
const removeBtn = {
  position: "absolute",
  top: -6,
  right: -6,
  background: "#dc2626",
  color: "#fff",
  borderRadius: "50%",
  width: 20,
  height: 20,
};
