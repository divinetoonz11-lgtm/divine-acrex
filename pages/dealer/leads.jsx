import React, { useEffect, useState } from "react";

export default function DealerLeadsPage() {
  const [loading, setLoading] = useState(true);
  const [leads, setLeads] = useState([]);

  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [appliedFrom, setAppliedFrom] = useState("");
  const [appliedTo, setAppliedTo] = useState("");
  const [search, setSearch] = useState("");

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

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

      {/* DATE FILTER */}
      <div style={{
        ...dateBox,
        flexDirection: isMobile ? "column" : "row"
      }}>
        <div style={{ width: isMobile ? "100%" : "auto" }}>
          <label style={label}>From</label>
          <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} style={input}/>
        </div>

        <div style={{ width: isMobile ? "100%" : "auto" }}>
          <label style={label}>To</label>
          <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} style={input}/>
        </div>

        <button style={{ ...applyBtn, width: isMobile ? "100%" : "auto" }} onClick={applyDateFilter}>
          Apply
        </button>

        <button style={{ ...clearBtn, width: isMobile ? "100%" : "auto" }} onClick={clearDateFilter}>
          Reset
        </button>
      </div>

      {/* SEARCH + ACTION */}
      <div style={{
        ...actionBar,
        flexDirection: isMobile ? "column" : "row"
      }}>
        <input
          placeholder="Search name / phone / email / property"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            ...searchInput,
            width: isMobile ? "100%" : "auto"
          }}
        />

        <button style={{ ...downloadBtn, width: isMobile ? "100%" : "auto" }}>
          ⬇ Download Sample
        </button>

        <button style={{ ...importBtn, width: isMobile ? "100%" : "auto" }}>
          ⬆ Import Leads
        </button>
      </div>

      {/* TABLE */}
      <div style={tableBox}>
        {loading ? (
          <div style={{ padding: 20 }}>Loading leads…</div>
        ) : (
          <div style={{ overflowX: "auto" }}>
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
                  <tr key={l._id}>
                    <td>{l.buyerName}</td>
                    <td><b>{l.buyerPhone}</b></td>
                    <td>{l.buyerEmail || "-"}</td>
                    <td>{l.propertyTitle}</td>
                    <td>{l.status}</td>
                    <td>{new Date(l.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

/* ================= STYLES ================= */

const page = {
  padding: 20,
  minHeight: "100vh",
  background: "linear-gradient(180deg,#f9fafb,#eef2ff)",
};

const title = {
  marginBottom: 16,
  fontSize: 26,
  fontWeight: 700,
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

const actionBar = {
  display: "flex",
  gap: 10,
  marginTop: 16,
  marginBottom: 16,
};

const input = {
  padding: 10,
  borderRadius: 8,
  border: "1px solid #ddd",
  width: "100%"
};

const searchInput = {
  flex: 1,
  padding: 10,
  borderRadius: 8,
  border: "1px solid #ddd",
};

const applyBtn = {
  padding: "10px 14px",
  background: "#2563eb",
  color: "#fff",
  borderRadius: 8,
  border: "none",
};

const clearBtn = {
  padding: "10px 14px",
  background: "#e5e7eb",
  borderRadius: 8,
  border: "none",
};

const downloadBtn = {
  background: "#16a34a",
  color: "#fff",
  border: "none",
  padding: "10px 14px",
  borderRadius: 8,
};

const importBtn = {
  background: "#9333ea",
  color: "#fff",
  border: "none",
  padding: "10px 14px",
  borderRadius: 8,
};

const label = {
  fontSize: 12,
  fontWeight: 600,
};

const tableBox = {
  background: "#fff",
  borderRadius: 14,
  overflow: "hidden",
  boxShadow: "0 12px 34px rgba(0,0,0,0.1)",
};

const table = {
  width: "100%",
  borderCollapse: "collapse",
};