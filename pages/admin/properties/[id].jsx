import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import AdminLayout from "../../../components/admin/AdminLayout";
import AdminGuard from "../../../components/AdminGuard";

function AdminPropertyEditPage() {
  const router = useRouter();
  const { id } = router.query;

  const [property, setProperty] = useState(null);
  const [images, setImages] = useState([]);
  const [videos, setVideos] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  /* ================= LOAD PROPERTY ================= */
  useEffect(() => {
    if (!router.isReady || !id) return;

    async function loadProperty() {
      try {
        setLoading(true);

        const res = await fetch(`/api/properties/${id}`);
        const data = await res.json();

        if (data?.ok && data.data) {
          setProperty(data.data);
          setImages(Array.isArray(data.data.images) ? data.data.images : []);
          setVideos(Array.isArray(data.data.videos) ? data.data.videos : []);
        } else {
          setProperty(null);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    loadProperty();
  }, [router.isReady, id]);

  /* ================= CLOUDINARY UPLOAD ================= */

  async function uploadImage(file) {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "property_images");

    const res = await fetch(
      "https://api.cloudinary.com/v1_1/dzym7cbx2/image/upload",
      { method: "POST", body: formData }
    );

    const data = await res.json();
    return data.secure_url;
  }

  async function uploadVideo(file) {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "property_videos");

    const res = await fetch(
      "https://api.cloudinary.com/v1_1/dzym7cbx2/video/upload",
      { method: "POST", body: formData }
    );

    const data = await res.json();
    return data.secure_url;
  }

  async function onImageSelect(e) {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setUploading(true);
      const url = await uploadImage(file);
      if (url) setImages(prev => [...prev, url]);
    } catch {
      alert("Image upload failed");
    } finally {
      setUploading(false);
    }
  }

  async function onVideoSelect(e) {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setUploading(true);
      const url = await uploadVideo(file);
      if (url) setVideos(prev => [...prev, url]);
    } catch {
      alert("Video upload failed");
    } finally {
      setUploading(false);
    }
  }

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const removeVideo = (index) => {
    setVideos(prev => prev.filter((_, i) => i !== index));
  };

  /* ================= SAVE (FIXED API) ================= */

  async function saveChanges() {
    if (!property) return;

    try {
      setSaving(true);

      const res = await fetch(`/api/properties/${property._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: property.title,
          city: property.city,
          price: property.price,
          description: property.description,
          images,
          videos,
        }),
      });

      const data = await res.json();

      if (!data.ok) {
        alert("Save failed");
        return;
      }

      alert("Property updated successfully");
      router.push("/admin/properties");

    } catch {
      alert("Save failed");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <AdminLayout>Loading property…</AdminLayout>;
  }

  if (!property) {
    return <AdminLayout>Property not found</AdminLayout>;
  }

  return (
    <AdminLayout>
      <h1>Edit Property</h1>

      <input
        value={property.title || ""}
        onChange={e => setProperty({ ...property, title: e.target.value })}
        placeholder="Title"
        style={input}
      />

      <input
        value={property.city || ""}
        onChange={e => setProperty({ ...property, city: e.target.value })}
        placeholder="City"
        style={input}
      />

      <input
        type="number"
        value={property.price || ""}
        onChange={e =>
          setProperty({ ...property, price: Number(e.target.value) })
        }
        placeholder="Price"
        style={input}
      />

      <textarea
        value={property.description || ""}
        onChange={e =>
          setProperty({ ...property, description: e.target.value })
        }
        placeholder="Description"
        style={textarea}
      />

      <h3 style={{ marginTop: 20 }}>Property Photos</h3>
      <input type="file" accept="image/*" onChange={onImageSelect} />

      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 10 }}>
        {images.map((img, i) => (
          <div key={i} style={{ position: "relative" }}>
            <img src={img} alt="" style={{ width: 120, height: 90, objectFit: "cover" }} />
            <button onClick={() => removeImage(i)} style={removeBtn}>×</button>
          </div>
        ))}
      </div>

      <h3 style={{ marginTop: 20 }}>Property Videos</h3>
      <input type="file" accept="video/*" onChange={onVideoSelect} />

      <div style={{ marginTop: 10 }}>
        {videos.map((vid, i) => (
          <div key={i} style={{ position: "relative", marginBottom: 10 }}>
            <video src={vid} controls style={{ width: 250 }} />
            <button onClick={() => removeVideo(i)} style={removeBtn}>×</button>
          </div>
        ))}
      </div>

      <button onClick={saveChanges} disabled={saving || uploading} style={saveBtn}>
        {saving ? "Saving..." : "Save Changes"}
      </button>
    </AdminLayout>
  );
}

export default function Page() {
  return (
    <AdminGuard>
      <AdminPropertyEditPage />
    </AdminGuard>
  );
}

const input = {
  padding: 10,
  width: "100%",
  marginBottom: 10,
  border: "1px solid #d1d5db",
  borderRadius: 6,
};

const textarea = {
  padding: 10,
  width: "100%",
  minHeight: 120,
  border: "1px solid #d1d5db",
  borderRadius: 6,
};

const removeBtn = {
  position: "absolute",
  top: 2,
  right: 2,
  background: "red",
  color: "#fff",
  border: "none",
  borderRadius: "50%",
  cursor: "pointer",
};

const saveBtn = {
  marginTop: 20,
  padding: "10px 16px",
  background: "#16a34a",
  color: "#fff",
  border: "none",
  borderRadius: 8,
  cursor: "pointer",
};
