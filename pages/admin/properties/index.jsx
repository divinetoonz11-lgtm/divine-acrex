import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import AdminLayout from "../../../components/admin/AdminLayout";
import AdminGuard from "../../../components/AdminGuard";

function AdminPropertiesPage() {
  const router = useRouter();

  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");

  // 🔥 FIXED AUTO VERIFY
  const [autoVerify, setAutoVerify] = useState(null);

  const [rowAction, setRowAction] = useState({});

  const limit = 20;

  /* ================= LOAD PROPERTIES ================= */
  useEffect(() => {
    loadData();
  }, [page, search, status]);

  async function loadData() {
    setLoading(true);

    const res = await fetch(
      `/api/admin/properties?page=${page}&limit=${limit}&search=${search}&status=${status}`
    );

    const data = await res.json();

    if (data?.ok) {
      setProperties(data.properties);
      setTotalPages(data.totalPages);
    }

    setLoading(false);
  }

  /* ================= LOAD AUTO VERIFY ================= */
  useEffect(() => {
    async function loadAutoVerify() {
      const res = await fetch("/api/admin/settings/auto-verify");
      const data = await res.json();
      if (data?.ok) {
        setAutoVerify(data.value);
      }
    }
    loadAutoVerify();
  }, []);

  /* ================= TOGGLE AUTO VERIFY ================= */
  async function toggleAutoVerify() {
    const newValue = !autoVerify;

    const res = await fetch("/api/admin/settings/auto-verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ value: newValue }),
    });

    const data = await res.json();

    if (data?.ok) {
      setAutoVerify(newValue);
    }
  }

  /* ================= APPLY ROW ACTION ================= */
  async function applyAction(id) {
    const action = rowAction[id];
    if (!action) return alert("Select action first");

    await fetch("/api/admin/properties/update-status", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id,
        status:
          action === "live" ||
          action === "pending" ||
          action === "blocked"
            ? action
            : undefined,
        verified:
          action === "verify"
            ? true
            : action === "unverify"
            ? false
            : undefined,
      }),
    });

    setRowAction((prev) => ({ ...prev, [id]: "" }));
    loadData();
  }

  const formatCurrency = (num) =>
    "₹ " + Number(num || 0).toLocaleString("en-IN");

  if (loading) return <AdminLayout>Loading...</AdminLayout>;

  return (
    <AdminLayout>
      <h1 style={{ marginBottom: 20 }}>
        Enterprise Property Management
      </h1>

      {/* ================= FILTER BAR ================= */}
      <div style={topBar}>
        <input
          placeholder="Search title / city"
          value={search}
          onChange={(e) => {
            setPage(1);
            setSearch(e.target.value);
          }}
          style={input}
        />

        <select
          value={status}
          onChange={(e) => {
            setPage(1);
            setStatus(e.target.value);
          }}
          style={input}
        >
          <option value="">All Status</option>
          <option value="live">Live</option>
          <option value="pending">Pending</option>
          <option value="blocked">Blocked</option>
        </select>

        <button
          disabled={autoVerify === null}
          style={{
            ...autoBtn,
            background: autoVerify ? "#16a34a" : "#dc2626",
          }}
          onClick={toggleAutoVerify}
        >
          AUTO VERIFY: {autoVerify ? "ON" : "OFF"}
        </button>
      </div>

      {/* ================= TABLE ================= */}
      <div style={{ overflowX: "auto" }}>
        <table style={table}>
          <thead>
            <tr>
              <th style={th}>Title</th>
              <th style={th}>City</th>
              <th style={th}>Price</th>
              <th style={th}>Status</th>
              <th style={th}>Verified</th>
              <th style={th}>Manage</th>
            </tr>
          </thead>

          <tbody>
            {properties.map((p) => (
              <tr key={p._id}>
                <td style={td}>{p.title}</td>
                <td style={td}>{p.city}</td>
                <td style={td}>{formatCurrency(p.price)}</td>

                <td style={td}>
                  <span style={statusBadge(p.status)}>
                    {p.status}
                  </span>
                </td>

                <td style={td}>
                  <span style={verifyBadge(p.verified)}>
                    {p.verified ? "Verified" : "Unverified"}
                  </span>
                </td>

                <td style={td}>
                  <select
                    value={rowAction[p._id] || ""}
                    onChange={(e) =>
                      setRowAction((prev) => ({
                        ...prev,
                        [p._id]: e.target.value,
                      }))
                    }
                    style={dropdown}
                  >
                    <option value="">Select</option>
                    <option value="live">Live</option>
                    <option value="pending">Pending</option>
                    <option value="blocked">Block</option>
                    <option value="verify">Verify</option>
                    <option value="unverify">Unverify</option>
                  </select>

                  <button
                    style={applyBtn}
                    onClick={() => applyAction(p._id)}
                  >
                    Apply
                  </button>

                  <button
                    style={editBtn}
                    onClick={() =>
                      router.push(`/admin/properties/${p._id}`)
                    }
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ================= PAGINATION ================= */}
      <div style={pagination}>
        <button
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
        >
          Prev
        </button>

        <span>
          Page {page} / {totalPages}
        </span>

        <button
          disabled={page === totalPages}
          onClick={() => setPage(page + 1)}
        >
          Next
        </button>
      </div>
    </AdminLayout>
  );
}

export default function Page() {
  return (
    <AdminGuard>
      <AdminPropertiesPage />
    </AdminGuard>
  );
}

/* ================= UI ================= */

const topBar = {
  display: "flex",
  gap: 10,
  marginBottom: 20,
  flexWrap: "wrap",
};

const input = {
  padding: 10,
  border: "1px solid #ddd",
  borderRadius: 6,
};

const table = {
  width: "100%",
  borderCollapse: "collapse",
  background: "#fff",
};

const th = {
  padding: 12,
  background: "#f3f4f6",
  borderBottom: "1px solid #e5e7eb",
};

const td = {
  padding: 12,
  borderBottom: "1px solid #e5e7eb",
};

const dropdown = {
  padding: 6,
  borderRadius: 6,
  border: "1px solid #ccc",
  marginRight: 6,
};

const applyBtn = {
  padding: "6px 10px",
  background: "#111827",
  color: "#fff",
  border: "none",
  borderRadius: 6,
  marginRight: 6,
  cursor: "pointer",
};

const editBtn = {
  padding: "6px 10px",
  background: "#2563eb",
  color: "#fff",
  border: "none",
  borderRadius: 6,
  cursor: "pointer",
};

const autoBtn = {
  padding: "8px 14px",
  color: "#fff",
  border: "none",
  borderRadius: 6,
  cursor: "pointer",
};

const pagination = {
  marginTop: 20,
  display: "flex",
  gap: 15,
  alignItems: "center",
};

const statusBadge = (status) => ({
  padding: "4px 8px",
  borderRadius: 6,
  color: "#fff",
  background:
    status === "live"
      ? "#16a34a"
      : status === "pending"
      ? "#f59e0b"
      : "#dc2626",
});

const verifyBadge = (v) => ({
  padding: "4px 8px",
  borderRadius: 6,
  color: "#fff",
  background: v ? "#2563eb" : "#6b7280",
});