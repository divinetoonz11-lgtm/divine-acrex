import { signIn, getSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/router";

const ADMIN_EMAILS = [
  "inder.ambalika@gmail.com",
  "divinetoonz11@gmail.com",
];

export default function AdminLogin() {
  const router = useRouter();

  useEffect(() => {
    (async () => {
      const session = await getSession();
      if (session && ADMIN_EMAILS.includes(session.user?.email)) {
        router.replace("/admin");
      }
    })();
  }, []);

  const loginWithGoogle = async () => {
    await signIn("google", {
      callbackUrl: "/admin",
    });
  };

  return (
    <div style={wrap}>
      <div style={box}>
        <h2 style={{ marginBottom: 10 }}>Admin Login</h2>
        <p style={{ color: "#64748b", marginBottom: 20 }}>
          Authorized admin email required
        </p>

        <button style={btn} onClick={loginWithGoogle}>
          Continue with Google
        </button>

        <p style={{ marginTop: 20, fontSize: 12, color: "#999" }}>
          Only allowed emails can access admin panel
        </p>
      </div>
    </div>
  );
}

/* ---------------- styles ---------------- */

const wrap = {
  minHeight: "100vh",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background: "#f5f7fb",
};

const box = {
  background: "#fff",
  padding: 30,
  borderRadius: 14,
  width: 360,
  textAlign: "center",
  boxShadow: "0 20px 40px rgba(0,0,0,.08)",
};

const btn = {
  width: "100%",
  padding: 14,
  borderRadius: 10,
  background: "#315DFF",
  color: "#fff",
  border: "none",
  fontWeight: 800,
  cursor: "pointer",
};
