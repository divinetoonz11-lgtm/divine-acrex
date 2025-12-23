import React, { useEffect, useState } from "react";

export default function DealerLeadsPage() {
  const [loading, setLoading] = useState(true);
  const [leads, setLeads] = useState([]);

  // filters
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [appliedFrom, setAppliedFrom] = useState("");
  const [appliedTo, setAppliedTo] = useState("");
  const [search, setSearch] = useState("");

  /* PREVIEW (sirf UI ke liye) */
  const previewLeads = [
    {
      _id: "p1",
      buyerName: "Rohit Kumar",
      buyerPhone: "9876543210",
      buyerEmail: "rohit@gmail.com",
      propertyTitle: "3 BHK • Noida Sector 62",
      status: "NEW",
      createdAt: new Date(),
      preview: true,
    },
  ];

  useEffect(() => {
    fetchLeads();
  }, [appliedFrom, appliedTo]);

  /* ================= FETCH LEADS ================= */
  async function fetchLeads() {
    setLoading(true);
    let url = "/api/dealer/leads";

    if (appliedFrom && appliedTo) {
      url += `?from=${new Date(appliedFrom).toISOString()}&to=${new Date(
        appliedTo
      ).toISOString()}`;
    }

    try {
      const res = await fetch(url);
      const data = await res.json();
      setLeads(data.ok ? data.leads : []);
    } catch {
      setLeads([]);
    } finally {
      setLoading(false);
    }
  }

  function applyDateFilter() {
    if (!fromDate || !toDate) {
      alert("Please select both From and To date");
      return;
    }
    setAppliedFrom(fromDate);
    setAppliedTo(toDate);
  }

  function clearDateFilter() {
    setFromDate("");
    setToDate("");
    setAppliedFrom("");
    setAppliedTo("");
  }

  /* ================= IMPORT / DOWNLOAD ================= */

  function downloadSample() {
    const csv =
      "Name,Phone,Email,Property,Status\n" +
      "Rahul Sharma,9876543210,rahul@gmail.com,2 BHK Andheri,NEW\n";

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "lead-import-sample.csv";
    a.click();

    window.URL.revokeObjectURL(url);
  }

  function handleImport(e) {
    const file = e.target.files[0];
    if (!file) return;
    alert("File selected: " + file.name + "\n(Backend import will be added)");
  }

  /* ================= SEARCH ================= */

  const shownLeads = (leads.length ? leads : previewLeads).filter((l) => {
    const q = search.toLowerCase();
    return (
      l.buyerName.toLowerCase().includes(q) ||
      l.buyerPhone.includes(q) ||
      (l.buyerEmail || "").toLowerCase().includes(q) ||
      l.propertyTitle.toLowerCase().includes(q)
    );
  });

  return (
    <div style={page}>
      <h1 style={title}>Dealer Leads</h1>

      {/* DATE RANGE */}
      <div style={dateBox}>
        <div>
          <label style={label}>From</label>
          <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
        </div>

        <div>
          <label style={label}>To</label>
          <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} />
        </div>

        <button style={applyBtn} onClick={applyDateFilter}>Apply</button>
        <button style={clearBtn} onClick={clearDateFilter}>Reset</button>
      </div>

      {appliedFrom && appliedTo && (
        <div style={activeRange}>
          Showing leads from <b>{appliedFrom}</b> to <b>{appliedTo}</b>
        </div>
      )}

      {/* ACTION BAR */}
      <div style={actionBar}>
        <input
          placeholder="Search name / phone / email / property"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ flex: 1 }}
        />

        <button style={downloadBtn} onClick={downloadSample}>
          ⬇ Download Sample
        </button>

        <label style={importBtn}>
          ⬆ Import Leads
          <input type="file" accept=".csv" hidden onChange={handleImport} />
        </label>
      </div>

      {/* TABLE */}
      <div style={tableBox}>
        {loading ? (
          <div style={{ padding: 20 }}>Loading leads…</div>
        ) : (
          <table style={table}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Phone</th>
                <th>Email</th>
                <th>Property</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>

            <tbody>
              {shownLeads.map((l) => (
                <tr key={l._id} style={{ opacity: l.preview ? 0.6 : 1 }}>
                  <td>{l.buyerName}{l.preview && " (Preview)"}</td>
                  <td><b>{l.buyerPhone}</b></td>
                  <td>{l.buyerEmail || "-"}</td>
                  <td>{l.propertyTitle}</td>
                  <td>{l.status}</td>
                  <td>{new Date(l.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

/* ================= STYLES ================= */

const page = {
  padding: 30,
  minHeight: "100vh",
  background: "linear-gradient(180deg,#f9fafb,#eef2ff)",
  fontFamily: "Inter, system-ui, sans-serif",
};

const title = {
  marginBottom: 16,
  fontSize: 26,
  fontWeight: 700,
  color: "#0f172a",
};

const dateBox = {
  display: "flex",
  gap: 12,
  alignItems: "end",
  background: "#fff",
  padding: 16,
  borderRadius: 12,
  boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
};

const label = {
  fontSize: 12,
  fontWeight: 600,
  color: "#1e293b",
  display: "block",
};

const applyBtn = {
  padding: "10px 14px",
  background: "#2563eb",
  color: "#fff",
  borderRadius: 8,
  border: "none",
  fontWeight: 600,
};

const clearBtn = {
  padding: "10px 14px",
  background: "#e5e7eb",
  color: "#111827",
  borderRadius: 8,
  border: "none",
  fontWeight: 600,
};

const activeRange = {
  marginTop: 10,
  marginBottom: 14,
  fontWeight: 600,
  color: "#1e40af",
};

const actionBar = {
  display: "flex",
  gap: 10,
  marginBottom: 16,
};

const downloadBtn = {
  background: "#16a34a",
  color: "#fff",
  border: "none",
  padding: "10px 14px",
  borderRadius: 8,
  fontWeight: 600,
};

const importBtn = {
  background: "#9333ea",
  color: "#fff",
  padding: "10px 14px",
  borderRadius: 8,
  cursor: "pointer",
  fontWeight: 600,
};

const tableBox = {
  background: "#ffffff",
  borderRadius: 14,
  overflow: "hidden",
  boxShadow: "0 12px 34px rgba(0,0,0,0.1)",
};

const table = {
  width: "100%",
  borderCollapse: "collapse",
};
