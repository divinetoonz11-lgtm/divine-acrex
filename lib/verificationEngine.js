// lib/verificationEngine.js
export function getVerificationResult({ source, gps }) {
  // source: "LIVE_CAMERA" | "GALLERY"
  // gps: { lat, lng } | null

  if (source === "LIVE_CAMERA" && gps?.lat && gps?.lng) {
    return {
      verified: true,
      verificationMode: "AUTO",
      verificationReason: "Live camera with GPS",
    };
  }

  return {
    verified: false,
    verificationMode: "MANUAL",
    verificationReason: "Gallery upload or missing GPS",
  };
}
