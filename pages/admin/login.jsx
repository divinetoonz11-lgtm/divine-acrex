import { useEffect } from "react";
import { useRouter } from "next/router";
import { getSession } from "next-auth/react";

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

  const loginWithGoogle = () => {
    window.location.href =
      "/api/auth/signin/admin-google?callbackUrl=/admin";
  };

  return (
    <div style={wrap}>
      <div style={box}>
        <h2 style={{ marginBottom: 12 }}>Admin Login</h2>

        <button style={btn} onClick={loginWithGoogle}>
          Continue with Google
        </button>
      </div>
    </div>
  );
}

/* ===== STYLES ===== */

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
