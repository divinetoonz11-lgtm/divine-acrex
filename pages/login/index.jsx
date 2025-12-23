import { signIn } from "next-auth/react";

export default function LoginIndex() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#f1f5fb",
      }}
    >
      <div
        style={{
          width: 360,
          background: "#ffffff",
          padding: 28,
          borderRadius: 16,
          boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
          textAlign: "center",
        }}
      >
        <h2>User Login</h2>

        {/* ✅ USER GOOGLE LOGIN */}
        <button
          onClick={() =>
            signIn("google-user", {
              callbackUrl: "/auth/redirect",
            })
          }
          style={{
            marginTop: 16,
            width: "100%",
            padding: 12,
            background: "#1e4ed8",
            color: "#fff",
            border: "none",
            borderRadius: 10,
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          Continue with Google
        </button>

        <div style={{ marginTop: 16, fontSize: 13 }}>
          Are you a dealer?{" "}
          <a
            href="/dealer_login"
            style={{ color: "#1e4ed8", fontWeight: 700 }}
          >
            Login here
          </a>
        </div>
      </div>
    </div>
  );
}
