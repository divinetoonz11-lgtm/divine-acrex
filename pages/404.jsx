// pages/404.jsx
export default function Custom404() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#f8fafc",
        color: "#0f172a",
        fontFamily: "Inter, system-ui, sans-serif",
      }}
    >
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 64, fontWeight: 900 }}>404</div>
        <div style={{ fontSize: 16, opacity: 0.7, marginTop: 8 }}>
          Page not found
        </div>
      </div>
    </div>
  );
}
