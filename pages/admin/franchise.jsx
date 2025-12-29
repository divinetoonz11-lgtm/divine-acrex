import { useEffect, useState } from "react";
import AdminGuard from "../../components/AdminGuard";

function AdminFranchisePage() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);

  // pagination
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 20;

  useEffect(() => {
    load(page);
  }, [page]);

  async function load(p = 1) {
    setLoading(true);
    const res = await fetch(`/api/admin/franchise?page=${p}&limit=${limit}`);
    const d = await res.json();
    if (d.franchises) {
      setRows(d.franchises);
      setTotal(d.total || 0);
    } else {
      setRows([]);
    }
    setLoading(false);
  }

  async function updateRate(id, rate) {
    if (!confirm("Update commission rate?")) return;
    await fetch("/api/admin/franchise-action", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, rate }),
    });
    load(page);
  }

  const pages = Math.ceil(total / limit);

  return (
    <div style={{ padding: 24 }}>
      <h2 style={{ marginBottom: 16 }}>Franchise & Commission</h2>

      <div style={box}>
        <table style={table}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Level</th>
              <th>Region</th>
              <th>Commission %</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr><td colSpan={5} style={empty}>Loading…</td></tr>
            )}
            {!loading && rows.length === 0 && (
              <tr><td colSpan={5} style={empty}>No franchises</td></tr>
            )}
            {rows.map(r => (
              <tr key={r._id}>
                <td>{r.name}</td>
                <td>{r.level}</td>
                <td>{r.region}</td>
                <td>{r.rate}%</td>
                <td>
                  <button
                    style={btn}
                    onClick={() => {
                      const rate = prompt("Enter commission %", r.rate);
                      if (rate !== null) updateRate(r._id, Number(rate));
                    }}
                  >
                    Update
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {pages > 1 && (
        <div style={{ marginTop: 16 }}>
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
  );
}

export default function FranchiseWithGuard(props) {
  return (
    <AdminGuard>
      <AdminFranchisePage {...props} />
    </AdminGuard>
  );
}

const box = { background: "#fff", padding: 16, borderRadius: 10 };
const table = { width: "100%", borderCollapse: "collapse" };
const empty = { padding: 20, textAlign: "center" };
const btn = { padding: "6px 10px", background: "#1e40af", color: "#fff", border: "none", borderRadius: 6 };
const pageBtn = (a) => ({
  padding: "6px 10px",
  marginRight: 6,
  background: a ? "#2563eb" : "#f3f4f6",
  color: a ? "#fff" : "#000",
  border: "none",
  borderRadius: 6,
});
