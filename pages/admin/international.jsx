// pages/admin/international.jsx
import { useEffect, useState } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import AdminGuard from "../../components/AdminGuard";

function AdminInternationalPage() {
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);

  // pagination
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 20;

  useEffect(() => {
    load(page);
  }, [page]);

  async function load(p = 1) {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/admin/international?page=${p}&limit=${limit}`
      );
      const d = await res.json();
      if (d?.countries) {
        setCountries(d.countries);
        setTotal(d.total || 0);
      } else {
        setCountries([]);
      }
    } catch {
      setCountries([]);
    } finally {
      setLoading(false);
    }
  }

  async function updateCountry(id, payload) {
    if (!confirm("Apply changes to this country?")) return;

    await fetch("/api/admin/international-action", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, ...payload }),
    });

    load(page);
  }

  const pages = Math.ceil(total / limit);

  return (
    <AdminLayout>
      <div style={{ maxWidth: 1500 }}>
        {/* HEADER */}
        <div style={{ marginBottom: 20 }}>
          <h1 style={title}>International Management</h1>
          <p style={sub}>Global country, currency & tax configuration</p>
        </div>

        {/* TABLE */}
        <div style={card}>
          <table style={table}>
            <thead>
              <tr>
                <th>Country</th>
                <th>Currency</th>
                <th>Symbol</th>
                <th>Tax %</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {loading && (
                <tr>
                  <td colSpan={6} style={empty}>
                    Loading countries…
                  </td>
                </tr>
              )}

              {!loading && countries.length === 0 && (
                <tr>
                  <td colSpan={6} style={empty}>
                    No country configured
                  </td>
                </tr>
              )}

              {countries.map((c) => (
                <tr key={c._id} style={row}>
                  <td>
                    <div style={{ fontWeight: 700 }}>{c.name}</div>
                    <div style={muted}>{c.code}</div>
                  </td>

                  <td>{c.currency}</td>
                  <td>{c.symbol}</td>
                  <td>{c.taxRate}%</td>

                  <td>
                    <span
                      style={{
                        ...badge,
                        background: c.active ? "#dcfce7" : "#fee2e2",
                        color: c.active ? "#166534" : "#991b1b",
                      }}
                    >
                      {c.active ? "ACTIVE" : "DISABLED"}
                    </span>
                  </td>

                  <td>
                    <div style={{ display: "flex", gap: 8 }}>
                      <button
                        style={btnPrimary}
                        onClick={() => {
                          const tax = prompt("Enter Tax %", c.taxRate);
                          if (tax !== null) {
                            updateCountry(c._id, { taxRate: Number(tax) });
                          }
                        }}
                      >
                        Edit Tax
                      </button>

                      <button
                        style={btnSecondary}
                        onClick={() =>
                          updateCountry(c._id, { active: !c.active })
                        }
                      >
                        {c.active ? "Disable" : "Enable"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* PAGINATION */}
        {pages > 1 && (
          <div style={{ marginTop: 18 }}>
            {Array.from({ length: pages }).map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i + 1)}
                style={pageBtn(page === i + 1)}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

/* WRAP */
export default function InternationalWithGuard(props) {
  return (
    <AdminGuard>
      <AdminInternationalPage {...props} />
    </AdminGuard>
  );
}

/* ================= STYLES ================= */

const title = {
  fontSize: 28,
  fontWeight: 900,
  color: "#0f172a",
};

const sub = {
  color: "#64748b",
  marginTop: 6,
};

const card = {
  background: "#fff",
  borderRadius: 16,
  boxShadow: "0 8px 28px rgba(15,23,42,.08)",
  overflowX: "auto",
};

const table = {
  width: "100%",
  borderCollapse: "collapse",
  minWidth: 1100,
};

const row = {
  borderBottom: "1px solid #eef2f6",
};

const empty = {
  padding: 28,
  textAlign: "center",
  color: "#64748b",
};

const muted = {
  fontSize: 12,
  color: "#94a3b8",
};

const badge = {
  padding: "4px 10px",
  borderRadius: 999,
  fontSize: 12,
  fontWeight: 800,
};

const btnPrimary = {
  padding: "6px 12px",
  background: "#2563eb",
  color: "#fff",
  border: "none",
  borderRadius: 8,
  cursor: "pointer",
};

const btnSecondary = {
  padding: "6px 12px",
  background: "#1e3a8a",
  color: "#fff",
  border: "none",
  borderRadius: 8,
  cursor: "pointer",
};

const pageBtn = (active) => ({
  padding: "6px 12px",
  marginRight: 6,
  borderRadius: 8,
  border: "1px solid #e5e7eb",
  background: active ? "#2563eb" : "#f8fafc",
  color: active ? "#fff" : "#0f172a",
  fontWeight: 600,
});
