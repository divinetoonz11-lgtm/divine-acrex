// pages/verify-property.jsx
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";

export default function VerifyProperty() {
  const router = useRouter();
  const { id } = router.query;

  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const [stream, setStream] = useState(null);
  const [photo, setPhoto] = useState(null);
  const [gps, setGps] = useState(null);
  const [loading, setLoading] = useState(false);

  /* ================= START CAMERA ================= */
  useEffect(() => {
    if (!id) return;

    async function startCamera() {
      try {
        const s = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" },
        });
        videoRef.current.srcObject = s;
        setStream(s);
      } catch (e) {
        alert("Camera access denied");
      }
    }

    startCamera();

    return () => {
      stream?.getTracks().forEach(t => t.stop());
    };
  }, [id]);

  /* ================= GPS ================= */
  useEffect(() => {
    if (!navigator.geolocation) {
      alert("GPS not supported");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setGps({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
      },
      () => alert("Location permission denied")
    );
  }, []);

  /* ================= CAPTURE PHOTO ================= */
  function capture() {
    const canvas = canvasRef.current;
    const video = videoRef.current;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0);

    setPhoto(canvas.toDataURL("image/jpeg"));
  }

  /* ================= SUBMIT ================= */
  async function submit() {
    if (!photo || !gps) {
      alert("Photo + location required");
      return;
    }

    setLoading(true);

    const res = await fetch("/api/common/verify-property", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        propertyId: id,
        source: "LIVE_CAMERA",
        gps,
        photo, // 🔥 PROOF IMAGE
      }),
    });

    const json = await res.json();
    setLoading(false);

    if (json?.verified) {
      alert("✅ Property verified successfully");
      router.back();
    } else {
      alert("❌ Verification failed");
    }
  }

  return (
    <div style={wrap}>
      <h2>Live Property Verification</h2>

      {!photo ? (
        <>
          <video
            ref={videoRef}
            autoPlay
            playsInline
            style={videoStyle}
          />
          <button style={btnPrimary} onClick={capture}>
            📸 Capture Photo
          </button>
        </>
      ) : (
        <>
          <img src={photo} style={preview} />
          <button style={btnPrimary} onClick={submit} disabled={loading}>
            {loading ? "Verifying…" : "Submit & Verify"}
          </button>
        </>
      )}

      <canvas ref={canvasRef} hidden />
    </div>
  );
}

/* ================= STYLES ================= */
const wrap = { minHeight: "100vh", padding: 20, background: "#f1f5fb" };
const videoStyle = { width: "100%", maxHeight: 420, borderRadius: 12 };
const preview = { width: "100%", borderRadius: 12, marginTop: 10 };
const btnPrimary = {
  marginTop: 16,
  padding: "12px 18px",
  background: "#16a34a",
  color: "#fff",
  border: 0,
  borderRadius: 10,
  fontSize: 16,
};
