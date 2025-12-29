// pages/notifications.jsx
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

export default function NotificationsPage() {
  const { data: session, status } = useSession();
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 20;

  useEffect(() => {
    if (status === "authenticated") {
      load(page);
    }
  }, [status, page]);

  async function load(p) {
    const res = await fetch(
      `/api/notifications? page=${p}&limit=${limit}`.replace(" ", "")
    );
    const d = await res.json();
    if (d.ok) {
      setItems(d.items || []);
      setTotalPages(d.totalPages || 1);
    }
  }

  async function markRead(id) {
    await fetch("/api/notifications/mark-read", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    setItems(prev =>
      prev.map(n => (n._id === id ? { ...n, read: true } : n))
    );
  }

  if (status === "loading") return <div>Loading…</div>;
  if (status !== "authenticated") return <div>Please login</div>;

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f8fafc",
        padding: 20,
        fontFamily: "Inter, system-ui",
      }}
    >
      <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 16 }}>
        Notifications
      </h1>

      <div style={{ display: "grid", gap: 12 }}>
        {items.length === 0 && (
          <div style={{ color: "#64748b" }}>No notifications</div>
        )}

        {items.map(n => (
          <div
            key={n._id}
            style={{
              background: "#fff",
              borderRadius: 14,
              padding: 18,
              boxShadow: "0 6px 20px rgba(15,23,42,.06)",
              opacity: n.read ? 0.7 : 1,
            }}
          >
            <div style={{ fontWeight: 800 }}>{n.title}</div>
            <div style={{ marginTop: 6, fontSize: 14 }}>{n.message}</div>

            <div
              style={{
                marginTop: 10,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div style={{ fontSize: 12, color: "#64748b" }}>
                {new Date(n.createdAt).toLocaleString()}
              </div>

              {!n.read && (
                <button
                  onClick={() => markRead(n._id)}
                  style={{
                    padding: "6px 10px",
                    borderRadius: 8,
                    border: "none",
                    background: "#2563eb",
                    color: "#fff",
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  Mark read
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div
          style={{
            marginTop: 20,
            display: "flex",
            gap: 6,
            overflowX: "auto",
          }}
        >
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i + 1)}
              style={{
                minWidth: 36,
                padding: "8px 12px",
                borderRadius: 8,
                border: "1px solid #e5e7eb",
                background: page === i + 1 ? "#2563eb" : "#f8fafc",
                color: page === i + 1 ? "#fff" : "#0f172a",
                fontWeight: 700,
              }}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
