import { useEffect } from "react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";

export default function AdminIndex() {
  const router = useRouter();
  const { status, data: session } = useSession();

  useEffect(() => {
    if (status === "loading") return;

    if (!session || session.user?.role !== "admin") {
      router.replace("/admin_login");
      return;
    }

    router.replace("/admin/overview"); // ✅ single source of truth
  }, [status, session, router]);

  return <div style={{ padding: 40 }}>Loading admin…</div>;
}
