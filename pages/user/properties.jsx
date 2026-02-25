import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";

export default function UserProperties() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [photoIndex, setPhotoIndex] = useState({});
  const [verifyingId, setVerifyingId] = useState(null);
  const [stream, setStream] = useState(null);

  /* ================= AUTH ================= */
  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/login");
    }
  }, [status]);

  /* ================= LOAD MY PROPERTIES ================= */
  useEffect(() => {
    if (status !== "authenticated") return;

    fetch("/api/user/my-properties")
      .then(r => r.json())
      .then(d => {
        setList(Array.isArray(d?.data) ? d.data : []);
        setLoading(false);
      });
  }, [status]);

  /* ================= DELETE ================= */
  async function deleteProperty(id) {
    if (!confirm("Delete this property?")) return;

    await fetch("/api/user/my-properties", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ propertyId: id }),
    });

    setList(p => p.filter(x => x._id !== id));
  }

  /* ================= SOLD / RENTED ================= */
  async function updateStatus(id, status) {
    if (!confirm(`Mark as ${status}?`)) return;

    await fetch("/api/user/my-properties", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ propertyId: id, status }),
    });

    setList(p =>
      p.map(x =>
        x._id === id ? { ...x, status, availability: false } : x
      )
    );
  }

  /* ================= LIVE CAMERA VERIFY ================= */
  async function startVerify(propertyId) {
    if (!navigator.mediaDevices || !navigator.geolocation) {
      alert("Camera / GPS not supported");
      return;
    }

    const s = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: "environment" },
    });

    videoRef.current.srcObject = s;
    setStream(s);
    setVerifyingId(propertyId);
  }

  async function captureAndVerify(propertyId) {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0);

    navigator.geolocation.getCurrentPosition(async pos => {
      await fetch("/api/common/verify-property", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          propertyId,
          source: "LIVE_CAMERA",
          gps: {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          },
        }),
      });

      stream.getTracks().forEach(t => t.stop());
      setStream(null);
      setVerifyingId(null);

      const r = await fetch("/api/user/my-properties");
      const j = await r.json();
      setList(Array.isArray(j?.data) ? j.data : []);
    });
  }

  if (loading) return <div style={{ padding: 30 }}>Loading…</div>;

  return (
    <div style={wrap}>
      <h2>My Properties</h2>

      <button
        style={addBtn}
        onClick={() => router.push("/post-property")}
      >
        + Add Property
      </button>

      {list.length === 0 ? (
        <div style={card}>No properties posted yet.</div>
      ) : (
        <div style={{ display: "grid", gap: 14 }}>
          {list.map(p => {
            const photos = Array.isArray(p.photos) ? p.photos : [];
            const idx = photoIndex[p._id] || 0;
            const hasPhotos = photos.length > 0;

            return (
              <div key={p._id} style={card}>
                <b>{p.title}</b>
                <div style={muted}>
                  {p.city} • ₹{p.price}
                </div>

                {/* PHOTO */}
                <div style={photoFrame}>
                  {hasPhotos ? (
                    <img src={photos[idx]} style={photoMain} />
                  ) : (
                    <div style={noPhoto}>No photos</div>
                  )}
                </div>

                <div style={photoNav}>
                  <button
                    disabled={idx === 0}
                    onClick={() =>
                      setPhotoIndex(s => ({ ...s, [p._id]: idx - 1 }))
                    }
                  >
                    ◀
                  </button>
                  <span>
                    {hasPhotos ? idx + 1 : 0}/{Math.max(photos.length, 1)}
                  </span>
                  <button
                    disabled={idx >= photos.length - 1}
                    onClick={() =>
                      setPhotoIndex(s => ({ ...s, [p._id]: idx + 1 }))
                    }
                  >
                    ▶
                  </button>
                </div>

                <div style={{ fontSize: 12, marginTop: 6 }}>
                  Status: <b>{p.status}</b>{" "}
                  {p.verified ? "✅ Verified" : "⚠️ Unverified"}
                </div>

                <div style={actions}>
                  <button onClick={() => router.push(`/post-property?id=${p._id}`)}>
                    Edit
                  </button>
                  <button onClick={() => deleteProperty(p._id)}>
                    Delete
                  </button>
                  <button onClick={() => updateStatus(p._id, "sold")}>
                    Sold
                  </button>
                  <button onClick={() => updateStatus(p._id, "rented")}>
                    Rented
                  </button>

                  {!p.verified && (
                    <button
                      style={verifyBtn}
                      onClick={() => startVerify(p._id)}
                    >
                      Verify (Live Camera)
                    </button>
                  )}
                </div>

                {verifyingId === p._id && (
                  <div style={cameraBox}>
                    <video ref={videoRef} autoPlay playsInline style={video} />
                    <canvas ref={canvasRef} hidden />
                    <button
                      style={captureBtn}
                      onClick={() => captureAndVerify(p._id)}
                    >
                      Capture & Verify
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ================= STYLES ================= */
const wrap = { background: "#f1f5fb", minHeight: "100vh", padding: 20 };
const card = { background: "#fff", padding: 16, borderRadius: 12 };
const muted = { fontSize: 13, color: "#555" };
const actions = { display: "flex", gap: 8, flexWrap: "wrap", marginTop: 10 };

const addBtn = {
  marginBottom: 14,
  padding: "10px 14px",
  background: "#2563eb",
  color: "#fff",
  borderRadius: 8,
};

const photoFrame = { width: 240, height: 160, background: "#eee", borderRadius: 10 };
const photoMain = { width: "100%", height: "100%", objectFit: "cover", borderRadius: 10 };
const noPhoto = { padding: 20, color: "#777" };
const photoNav = { display: "flex", gap: 10, alignItems: "center", marginTop: 6 };

const verifyBtn = {
  background: "#16a34a",
  color: "#fff",
  padding: "6px 10px",
  borderRadius: 8,
};

const cameraBox = { marginTop: 10, padding: 10, background: "#000", borderRadius: 12 };
const video = { width: "100%", borderRadius: 10 };
const captureBtn = {
  marginTop: 10,
  width: "100%",
  padding: 10,
  background: "#2563eb",
  color: "#fff",
  borderRadius: 10,
};
