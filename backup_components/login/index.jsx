import { useRouter } from "next/router";

export default function LoginSelection() {
  const router = useRouter();

  const goToRole = (role) => {
    router.push(`/login/${role}`);
  };

  return (
    <div
      style={{
        maxWidth: 450,
        margin: "60px auto",
        padding: 20,
        textAlign: "center",
        border: "1px solid #eee",
        borderRadius: 12,
        background: "#fff",
        boxShadow: "0 4px 12px rgba(0,0,0,0.08)"
      }}
    >
      <h1 style={{ fontSize: 28, fontWeight: 700 }}>Login</h1>
      <p style={{ color: "#6b7280", marginBottom: 30 }}>
        Select how you want to login
      </p>

      <div style={{ display: "grid", gap: 16 }}>
        <button onClick={() => goToRole("user")} style={btn}>
          Login as User
        </button>

        <button onClick={() => goToRole("dealer")} style={btn}>
          Login as Dealer
        </button>

        <button onClick={() => goToRole("admin")} style={btn}>
          Login as Admin
        </button>
      </div>
    </div>
  );
}

const btn = {
  padding: "14px 18px",
  fontSize: 18,
  background: "#6b21a8",
  color: "#fff",
  border: "none",
  borderRadius: 10,
  cursor: "pointer",
  fontWeight: 600
};
