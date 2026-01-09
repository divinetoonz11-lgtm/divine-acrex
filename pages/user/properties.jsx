import { useEffect, useState } from "react";

export default function AdminProperties() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ===== LOAD PROPERTIES ===== */
  useEffect(() => {
    fetch("/api/admin/properties")
      .then(r => r.json())
      .then(d => {
        setList(Array.isArray(d?.data) ? d.data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  /* ===== APPROVE PROPERTY ===== */
  async function approveProperty(id) {
    console.log("CLICK:", id); // 🔥 DEBUG

    const ok = window.confirm("Approve this property?");
    if (!ok) return;

    try {
      const res = await fetch("/api/admin/update-listing-status", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          propertyId: id,
          status: "live",
        }),
      });

      const data = await res.json();
      console.log("API RESULT:", data);

      if (!res.ok) {
        alert("Approve failed");
        return;
      }

      setList(p =>
        p.map(x =>
          x._id === id ? { ...x, status: "live", verified: true } : x
        )
      );
    } catch (e) {
      alert("Network error");
    }
  }

  if (loading) return <div style={{ padding: 40 }}>Loading…</div>;

  return (
    <div style={{ padding: 24 }}>
      <h2>All Properties</h2>

      <table width="100%" cellPadding={10} style={{ background: "#fff" }}>
        <thead>
          <tr style={{ background: "#f1f5f9", textAlign: "left" }}>
            <th>Property</th>
            <th>Owner</th>
            <th>Role</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {list.map(p => (
            <tr key={p._id} style={{ borderBottom: "1px solid #e5e7eb" }}>
              <td>
                <b>{p.title}</b>
                <div style={{ fontSize: 12 }}>
                  {p.city} • ₹{p.price}
                </div>
                <div style={{ fontSize: 11 }}>ID: {p._id}</div>
              </td>

              <td>
                <b>{p.ownerName || p.dealerName}</b>
                <div style={{ fontSize: 12 }}>{p.ownerEmail}</div>
              </td>

              <td>
                {p.dealerName || p.dealerCompany ? "DEALER" : "USER"}
              </td>

              <td>
                <b>{p.status?.toUpperCase()}</b>
              </td>

              <td>
                {p.status === "pending" ? (
                  <button
                    type="button"     // 🔥 IMPORTANT
                    onClick={() => approveProperty(p._id)}
                    style={{
                      padding: "6px 14px",
                      background: "#16a34a",
                      color: "#fff",
                      border: 0,
                      cursor: "pointer",
                    }}
                  >
                    Submit
                  </button>
                ) : (
                  <span style={{ color: "green", fontWeight: 700 }}>
                    Approved
                  </span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
