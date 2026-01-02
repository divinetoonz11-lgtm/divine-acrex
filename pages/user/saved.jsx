// pages/user/saved.jsx
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function UserSaved() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [saved, setSaved] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔒 Login guard
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status]);

  // 📦 Load saved properties
  useEffect(() => {
    if (status !== "authenticated") return;

    (async () => {
      try {
        const res = await fetch("/api/user/saved");
        const data = res.ok ? await res.json() : [];
        setSaved(data || []);
      } finally {
        setLoading(false);
      }
    })();
  }, [status]);

  if (loading) {
    return <div style={{ padding: 30 }}>Loading saved properties…</div>;
  }

  return (
    <div style={{ minHeight: "100vh", background: "#f1f5fb", padding: 20 }}>
      <h2 style={{ marginBottom: 20 }}>Saved Properties</h2>

      {saved.length === 0 ? (
        <div
          style={{
            background: "#fff",
            padding: 20,
            borderRadius: 12,
          }}
        >
          You have not saved any properties yet.
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))",
            gap: 16,
          }}
        >
          {saved.map((p) => (
            <div
              key={p._id}
              style={{
                background: "#fff",
                padding: 16,
                borderRadius: 12,
              }}
            >
              <div style={{ fontWeight: 700 }}>
                {p.title || "Property"}
              </div>
              <div style={{ fontSize: 13, color: "#555", marginTop: 4 }}>
                {p.city || ""} {p.state || ""}
              </div>
              <div style={{ marginTop: 8, fontSize: 13 }}>
                Price: <b>{p.price || "—"}</b>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
