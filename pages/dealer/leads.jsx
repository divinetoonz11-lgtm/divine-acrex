// pages/dealer/leads.jsx
import React, { useState } from "react";

export default function DealerLeadsPage() {
  const [leads, setLeads] = useState([
    {
      id: "L1",
      name: "Rohit Kumar",
      phone: "9876543210",
      property: "3 BHK in Noida Sector 62",
      status: "New",
      time: "2 hrs ago",
      note: "",
    },
    {
      id: "L2",
      name: "Simran",
      phone: "9001234567",
      property: "2 BHK in Gurugram",
      status: "Contacted",
      time: "1 day ago",
      note: "Will call after 6 pm",
    },
    {
      id: "L3",
      name: "Amit Mishra",
      phone: "9911002200",
      property: "Studio Apartment Delhi",
      status: "Closed",
      time: "3 days ago",
      note: "",
    },
  ]);

  function updateStatus(id, newStatus) {
    setLeads((prev) =>
      prev.map((l) => (l.id === id ? { ...l, status: newStatus } : l))
    );
  }

  function updateNote(id, note) {
    setLeads((prev) =>
      prev.map((l) => (l.id === id ? { ...l, note } : l))
    );
  }

  function deleteLead(id) {
    if (!confirm("Delete this lead?")) return;
    setLeads(leads.filter((l) => l.id !== id));
  }

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        background: "#f6f8fb",
        fontFamily: "Inter",
      }}
    >
      {/* Sidebar */}
      <aside
        style={{
          width: 260,
          background: "#07102a",
          padding: 20,
          color: "white",
        }}
      >
        <h2 style={{ fontSize: 22, margin: 0 }}>Dealer Panel</h2>

        <nav
          style={{
            marginTop: 20,
            display: "flex",
            flexDirection: "column",
            gap: 10,
          }}
        >
          <a href="/dealer/dashboard" style={sideLink}>
            Dashboard
          </a>
          <a href="/dealer/add-property" style={sideLink}>
            Add Property
          </a>
          <a href="/dealer/leads" style={sideLinkActive}>
            Leads
          </a>
          <a href="/dealer/plans" style={sideLink}>
            Plans
          </a>
          <a href="/dealer/profile" style={sideLink}>
            Profile
          </a>
          <a href="/dealer/support" style={sideLink}>
            Support
          </a>
        </nav>

        <button
          style={{
            marginTop: 20,
            width: "100%",
            padding: "10px 14px",
            background: "#ef4444",
            color: "#fff",
            border: "none",
            borderRadius: 8,
            cursor: "pointer",
            fontWeight: 700,
          }}
          onClick={() => alert("Logout (demo)")}
        >
          Logout
        </button>
      </aside>

      {/* MAIN CONTENT */}
      <main style={{ flex: 1, padding: 30 }}>
        <h1 style={{ margin: 0 }}>Leads</h1>
        <p style={{ color: "#6b7280", marginBottom: 18 }}>
          Manage and follow up your property enquiries
        </p>

        <div
          style={{
            background: "#fff",
            padding: 20,
            borderRadius: 10,
            boxShadow: "0 8px 24px rgba(12,20,40,0.06)",
          }}
        >
          <table
            style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}
          >
            <thead>
              <tr style={{ background: "#f1f5f9", textAlign: "left" }}>
                <th style={th}>Name</th>
                <th style={th}>Phone</th>
                <th style={th}>Property</th>
                <th style={th}>Status</th>
                <th style={th}>Note</th>
                <th style={th}>Time</th>
                <th style={th}>Actions</th>
              </tr>
            </thead>

            <tbody>
              {leads.map((l) => (
                <tr key={l.id} style={{ borderBottom: "1px solid #e5e7eb" }}>
                  <td style={td}>{l.name}</td>
                  <td style={td}>{l.phone}</td>
                  <td style={td}>{l.property}</td>

                  {/* STATUS DROPDOWN */}
                  <td style={td}>
                    <select
                      value={l.status}
                      onChange={(e) => updateStatus(l.id, e.target.value)}
                      style={{
                        padding: 6,
                        borderRadius: 6,
                        border: "1px solid #d1d5db",
                      }}
                    >
                      <option>New</option>
                      <option>Contacted</option>
                      <option>Closed</option>
                    </select>
                  </td>

                  {/* NOTE */}
                  <td style={td}>
                    <input
                      value={l.note}
                      onChange={(e) => updateNote(l.id, e.target.value)}
                      placeholder="Add note"
                      style={{
                        width: "100%",
                        padding: 6,
                        borderRadius: 6,
                        border: "1px solid #d1d5db",
                      }}
                    />
                  </td>

                  <td style={td}>{l.time}</td>

                  {/* DELETE */}
                  <td style={td}>
                    <button
                      onClick={() => deleteLead(l.id)}
                      style={{
                        padding: "6px 10px",
                        borderRadius: 6,
                        background: "#ef4444",
                        color: "#fff",
                        border: "none",
                        cursor: "pointer",
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}

/* TABLE STYLES */
const th = { padding: "10px 8px", fontWeight: 700, fontSize: 13 };
const td = { padding: "10px 8px" };

/* SIDEBAR STYLES */
const sideLink = {
  padding: "10px 12px",
  borderRadius: 6,
  color: "#bcc6dd",
  textDecoration: "none",
  fontWeight: 600,
};

const sideLinkActive = {
  ...sideLink,
  background: "rgba(255,255,255,0.1)",
  color: "#fff",
};
