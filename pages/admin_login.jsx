import { signIn, getSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

/* 🔒 PERMANENT ADMIN EMAIL LIST */
const ADMIN_EMAILS = [
  "inder.ambalika@gmail.com",
  "divinetoonz11@gmail.com",
];

export default function AdminLogin() {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    (async () => {
      const session = await getSession();

      // ✅ Already logged-in admin → ADMIN DASHBOARD
      if (
        session?.user?.email &&
        ADMIN_EMAILS.includes(session.user.email) &&
        session.user.role === "admin"
      ) {
        router.replace("/admin/dashboard");
        return;
      }

      setReady(true);
    })();
  }, [router]);

  if (!ready) return null;

  const loginWithGoogle = async () => {
    await signIn("google", {
      callbackUrl: "/admin/dashboard", // ✅ FINAL & CORRECT
      prompt: "select_account",
    });
  };

  return (
    <main style={wrap}>
      <div style={box}>
        <h2 style={{ marginBottom: 10 }}>Admin Login</h2>

        <p style={{ color: "#64748b", marginBottom: 20 }}>
          Authorized admin Google account required
        </p>

        <button style={btn} onClick={loginWithGoogle}>
          Continue with Google
        </button>

        <p style={{ marginTop: 20, fontSize: 12, color: "#999" }}>
          Google sign-in only • Admin access restricted
        </p>
      </div>
    </main>
  );
}

/* ================= styles ================= */

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
