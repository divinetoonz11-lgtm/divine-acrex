// pages/admin/notifications.jsx
import { useEffect, useState } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import AdminGuard from "../../components/AdminGuard";

/*
NOTIFICATIONS – ENTERPRISE GRADE
*/

function AdminNotificationsPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [target, setTarget] = useState("all");

  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 20;

  useEffect(() => {
    load(page);
  }, [page]);

  async function load(p = 1) {
    setLoading(true);
    try {
      const r = await fetch(`/api/admin/notifications?page=${p}&limit=${limit}`);
      const d = await r.json();
      setItems(d.items || []);
      setTotal(d.total || 0);
    } finally {
      setLoading(false);
    }
  }

  async function create() {
    if (!title || !message) return alert("Title & message required");

    await fetch("/api/admin/notifications", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, message, target }),
    });

    setTitle("");
    setMessage("");
    setTarget("all");
    load(1);
  }

  const pages = Math.ceil(total / limit);

  return (
    <AdminLayout>
      <div style={{ maxWidth: 1400 }}>
        <h1 style={{ fontSize: 26, fontWeight: 800 }}>System Notifications</h1>

        <div style={card}>
          <input
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={input}
          />

          <select
            value={target}
            onChange={(e) => setTarget(e.target.value)}
            style={input}
          >
            <option value="all">All</option>
            <option value="user">Users</option>
            <option value="dealer">Dealers</option>
          </select>

          <textarea
            placeholder="Message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            style={textarea}
          />

          <button style={btn} onClick={create}>
            Send
          </button>
        </div>

        <div style={card}>
          {loading && <div>Loading…</div>}
          {!loading &&
            items.map((n, i) => (
              <div key={i} style={{ padding: 10, borderBottom: "1px solid #eee" }}>
                <strong>{n.title}</strong> ({n.target})
              </div>
            ))}
        </div>

        {pages > 1 && (
          <div>
            {Array.from({ length: pages }).map((_, i) => (
              <button key={i} onClick={() => setPage(i + 1)}>
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

export default function NotificationsWithGuard() {
  return (
    <AdminGuard>
      <AdminNotificationsPage />
    </AdminGuard>
  );
}

const card = {
  background: "#fff",
  padding: 16,
  borderRadius: 14,
  marginTop: 16,
};

const input = {
  padding: 10,
  width: "100%",
  marginBottom: 8,
};

const textarea = {
  padding: 10,
  width: "100%",
  height: 80,
};

const btn = {
  padding: "8px 14px",
  background: "#2563eb",
  color: "#fff",
  border: "none",
  borderRadius: 8,
};
