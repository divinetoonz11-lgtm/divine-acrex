import { useSession, signOut } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/router";

export default function TanviPanel() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // 🔒 Only admin allowed
  useEffect(() => {
    if (status === "loading") return;

    if (!session || session.user?.role !== "admin") {
      router.replace("/login");
    }
  }, [session, status, router]);

  if (status === "loading") return null;
  if (!session) return null;

  return (
    <div style={{ padding: 40 }}>
      <h1>Tanvi Admin Panel</h1>

      <p>
        Logged in as: <b>{session.user.email}</b>
      </p>

      <button
        onClick={() => signOut({ callbackUrl: "/" })}
        style={{
          marginTop: 20,
          padding: "10px 16px",
          background: "#dc2626",
          color: "#fff",
          border: "none",
          borderRadius: 8,
          fontWeight: 700,
          cursor: "pointer",
        }}
      >
        Logout
      </button>
    </div>
  );
}
