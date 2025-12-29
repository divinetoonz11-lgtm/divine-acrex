// pages/admin/index.jsx
import { useEffect } from "react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";

export default function AdminIndex() {
  const router = useRouter();
  const { status, data: session } = useSession();

  useEffect(() => {
    // ⏳ Session load hone do
    if (status === "loading") return;

    // 🔒 Session hi nahi → login
    if (!session) {
      router.replace("/login");
      return;
    }

    // 🔐 Role check (admin hi allowed)
    if (session.user?.role !== "admin") {
      router.replace("/login");
      return;
    }

    // ✅ Sab sahi → admin overview
    router.replace("/admin/overview");
  }, [status, session, router]);

  return (
    <div style={{ padding: 40, textAlign: "center" }}>
      Loading admin dashboard…
    </div>
  );
}
