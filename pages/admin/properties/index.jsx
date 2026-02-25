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

  const limit = 20;

  /* ================= LOAD DATA ================= */
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

  /* ================= STATUS UPDATE ================= */
  async function updateStatus(id, newStatus) {
    if (!confirm("Update property status?")) return;

    const res = await fetch("/api/admin/properties/update-status", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status: newStatus }),
    });

    const data = await res.json();

    if (data?.ok) {
      loadData();
    } else {
      alert(data.message || "Status update failed");
    }
  }

  /* ================= VERIFY UPDATE ================= */
  async function toggleVerify(id, currentValue) {
    const res = await fetch("/api/admin/properties/update-status", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id,
        verified: !currentValue,
      }),
    });

    const data = await res.json();

    if (data?.ok) {
      loadData();
    } else {
      alert("Verify update failed");
    }
  }

  const formatCurrency = (num) => {
    if (!num) return "₹ 0";
    return "₹ " + Number(num).toLocaleString("en-IN");
  };

  if (loading) {
    return <AdminLayout>Loading...</AdminLayout>;
  }

  return (
    <AdminLayout>
      <h1 style={{ marginBottom: 20 }}>
        Enterprise Property Management
      </h1>

      {/* ================= FILTER ================= */}
      <div style={filterBar}>
        <input
          placeholder="Search by title / city"
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
              <th style={th}>Actions</th>
            </tr>
          </thead>

          <tbody>
            {properties.map((p) => (
              <tr key={p._id}>
                <td style={td}>{p.title}</td>
                <td style={td}>{p.city}</td>
                <td style={td}>{formatCurrency(p.price)}</td>

                {/* STATUS BADGE */}
                <td style={td}>
                  <span style={badge(p.status)}>
                    {p.status}
                  </span>
                </td>

                {/* VERIFIED BADGE */}
                <td style={td}>
                  <span
                    style={{
                      padding: "4px 8px",
                      borderRadius: 6,
                      color: "#fff",
                      background: p.verified ? "#16a34a" : "#6b7280",
                    }}
                  >
                    {p.verified ? "Verified" : "Unverified"}
                  </span>
                </td>

                {/* ACTIONS */}
                <td style={td}>
                  <button
                    style={editBtn}
                    onClick={() =>
                      router.push(`/admin/properties/${p._id}`)
                    }
                  >
                    Edit
                  </button>

                  <button
                    style={liveBtn}
                    onClick={() => updateStatus(p._id, "live")}
                  >
                    Live
                  </button>

                  <button
                    style={pendingBtn}
                    onClick={() => updateStatus(p._id, "pending")}
                  >
                    Pending
                  </button>

                  <button
                    style={blockBtn}
                    onClick={() => updateStatus(p._id, "blocked")}
                  >
                    Block
                  </button>

                  <button
                    style={verifyBtn}
                    onClick={() =>
                      toggleVerify(p._id, p.verified)
                    }
                  >
                    {p.verified ? "Unverify" : "Verify"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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

/* ================= STYLES ================= */

const filterBar = {
  display: "flex",
  gap: 10,
  marginBottom: 20,
  flexWrap: "wrap",
};

const input = {
  padding: 10,
  borderRadius: 6,
  border: "1px solid #d1d5db",
};

const table = {
  width: "100%",
  borderCollapse: "collapse",
  background: "#fff",
};

const th = {
  padding: 12,
  background: "#f9fafb",
  borderBottom: "1px solid #e5e7eb",
};

const td = {
  padding: 12,
  borderBottom: "1px solid #e5e7eb",
};

const editBtn = {
  padding: "6px 10px",
  background: "#2563eb",
  color: "#fff",
  border: "none",
  borderRadius: 6,
  cursor: "pointer",
  marginRight: 5,
};

const liveBtn = {
  padding: "6px 10px",
  background: "#16a34a",
  color: "#fff",
  border: "none",
  borderRadius: 6,
  cursor: "pointer",
  marginRight: 5,
};

const pendingBtn = {
  padding: "6px 10px",
  background: "#f59e0b",
  color: "#fff",
  border: "none",
  borderRadius: 6,
  cursor: "pointer",
  marginRight: 5,
};

const blockBtn = {
  padding: "6px 10px",
  background: "#dc2626",
  color: "#fff",
  border: "none",
  borderRadius: 6,
  cursor: "pointer",
  marginRight: 5,
};

const verifyBtn = {
  padding: "6px 10px",
  background: "#111827",
  color: "#fff",
  border: "none",
  borderRadius: 6,
  cursor: "pointer",
};

const badge = (status) => ({
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
