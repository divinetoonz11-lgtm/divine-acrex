// pages/user/properties.jsx
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function UserProperties() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔒 Auth guard
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status]);

  // 📦 Load user properties
  useEffect(() => {
    if (status !== "authenticated") return;

    (async () => {
      try {
        const res = await fetch("/api/user/listings");
        const data = res.ok ? await res.json() : [];
        setProperties(data || []);
      } finally {
        setLoading(false);
      }
    })();
  }, [status]);

  // 🚀 Go Live handler
  async function goLive(id) {
    const ok = confirm(
      "Go Live करने पर property public दिखेगी (Unverified). Continue?"
    );
    if (!ok) return;

    const res = await fetch("/api/user/post-property", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, action: "GO_LIVE" }),
    });

    if (res.ok) {
      setProperties((prev) =>
        prev.map((p) =>
          p._id === id ? { ...p, status: "LIVE_UNVERIFIED" } : p
        )
      );
    }
  }

  if (loading) {
    return <div style={{ padding: 30 }}>Loading properties…</div>;
  }

  return (
    <div style={{ minHeight: "100vh", background: "#f1f5fb", padding: 20 }}>
      <h2 style={{ marginBottom: 20 }}>My Properties</h2>

      {properties.length === 0 ? (
        <div style={{ background: "#fff", padding: 20, borderRadius: 12 }}>
          No properties posted yet.
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))",
            gap: 16,
          }}
        >
          {properties.map((p) => {
            const hasMedia =
              (p.photosCount || 0) >= 3 || !!p.videoName;

            return (
              <div
                key={p._id}
                style={{
                  background: "#fff",
                  padding: 16,
                  borderRadius: 12,
                }}
              >
                <div style={{ fontWeight: 800 }}>
                  {p.title || "Property"}
                </div>

                <div style={{ fontSize: 13, color: "#555", marginTop: 4 }}>
                  {p.city || ""} {p.state || ""}
                </div>

                {/* STATUS */}
                <div style={{ marginTop: 8, fontSize: 13 }}>
                  Status:{" "}
                  <b>
                    {p.status === "VERIFIED"
                      ? "✅ Verified"
                      : p.status === "LIVE_UNVERIFIED"
                      ? "🟡 Live (Unverified)"
                      : "⚪ Unverified"}
                  </b>
                </div>

                {/* ACTION */}
                {p.status !== "VERIFIED" && hasMedia && (
                  <button
                    onClick={() => goLive(p._id)}
                    style={{
                      marginTop: 12,
                      padding: "8px 12px",
                      background: "#16a34a",
                      color: "#fff",
                      border: "none",
                      borderRadius: 8,
                      fontWeight: 700,
                      cursor: "pointer",
                      width: "100%",
                    }}
                  >
                    Go Live
                  </button>
                )}

                {!hasMedia && (
                  <div
                    style={{
                      marginTop: 10,
                      fontSize: 12,
                      color: "#dc2626",
                    }}
                  >
                    Upload at least 3 photos or 1 video to go live
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
