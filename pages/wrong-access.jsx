// pages/wrong-access.jsx
export default function WrongAccess() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#f8fafc",
        fontFamily: "Inter, system-ui",
      }}
    >
      <div
        style={{
          background: "#ffffff",
          padding: 32,
          borderRadius: 16,
          maxWidth: 420,
          width: "100%",
          textAlign: "center",
          boxShadow: "0 10px 30px rgba(15,23,42,.08)",
        }}
      >
        <div style={{ fontSize: 22, fontWeight: 800, color: "#0f172a" }}>
          Access Restricted
        </div>

        <div
          style={{
            marginTop: 12,
            fontSize: 14,
            color: "#475569",
            lineHeight: 1.6,
          }}
        >
          Aap galat panel open kar rahe hain.  
          Aapke account ke liye alag dashboard available hai.
        </div>

        <div
          style={{
            marginTop: 20,
            padding: 12,
            borderRadius: 10,
            background: "#eff6ff",
            color: "#1d4ed8",
            fontWeight: 700,
            fontSize: 13,
          }}
        >
          📩 Security notice:  
          Is activity ka record system me save ho gaya hai.
        </div>

        <a
          href="/"
          style={{
            display: "inline-block",
            marginTop: 22,
            padding: "10px 18px",
            borderRadius: 10,
            background: "#2563eb",
            color: "#fff",
            textDecoration: "none",
            fontWeight: 800,
          }}
        >
          Go to correct dashboard
        </a>
      </div>
    </div>
  );
}
