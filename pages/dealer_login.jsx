import { signIn } from "next-auth/react";

export default function DealerLogin() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#eef2ff",
      }}
    >
      <div
        style={{
          width: 360,
          background: "#fff",
          padding: 30,
          borderRadius: 14,
          boxShadow: "0 6px 25px rgba(0,0,0,0.08)",
          textAlign: "center",
        }}
      >
        <h2 style={{ marginBottom: 20, fontWeight: 900 }}>
          Dealer Login
        </h2>

        {/* ✅ DEALER GOOGLE LOGIN – CORRECT */}
        <button
          onClick={() =>
            signIn("google", {
              callbackUrl: "/dealer/dashboard",
            })
          }
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 10,
            padding: "12px",
            width: "100%",
            border: "1px solid #d0d7ff",
            borderRadius: 8,
            fontWeight: 700,
            background: "#fff",
            cursor: "pointer",
          }}
        >
          Continue with Google
        </button>
      </div>
    </div>
  );
}
