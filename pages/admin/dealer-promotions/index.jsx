import { useState, useMemo } from "react";
import AdminLayout from "../../../components/admin/AdminLayout";
import AdminGuard from "../../../components/AdminGuard";

/*
ADMIN – DEALER PROMOTION (EXCEL STYLE MASTER)
✔ Single file
✔ Filters
✔ Promotion due logic
✔ Mobile visible
✔ Excel (CSV) export
✔ Admin action ready
*/

const LEVEL_RULES = {
  1: 1,
  2: 10,
  3: 25,
  4: 50,
  5: 100,
};

export default function DealerPromotionsAdmin() {
  /* ================= DUMMY STRUCTURE (API READY) ================= */
  const [rows] = useState([
    {
      name: "Manju Awasthi",
      mobile: "98XXXX1234",
      city: "Indore",
      activeSubs: 9,
      level: 1,
    },
    {
      name: "Rahul Verma",
      mobile: "97XXXX8899",
      city: "Delhi",
      activeSubs: 25,
      level: 2,
    },
  ]);

  /* ================= FILTER STATE ================= */
  const [search, setSearch] = useState("");
  const [levelFilter, setLevelFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  /* ================= FILTER + PROMOTION LOGIC ================= */
  const filtered = useMemo(() => {
    return rows.filter((r) => {
      const nextLevel = Math.min(r.level + 1, 5);
      const required = LEVEL_RULES[nextLevel];
      const remaining = required - r.activeSubs;
      const isDue = remaining <= 0;

      if (
        search &&
        !(
          r.name.toLowerCase().includes(search.toLowerCase()) ||
          r.mobile.includes(search)
        )
      )
        return false;

      if (levelFilter !== "all" && r.level !== Number(levelFilter))
        return false;

      if (statusFilter === "due" && !isDue) return false;
      if (statusFilter === "not-due" && isDue) return false;

      return true;
    });
  }, [rows, search, levelFilter, statusFilter]);

  /* ================= EXPORT CSV ================= */
  function exportCSV() {
    const header = [
      "Name",
      "Mobile",
      "City",
      "Active Subs",
      "Current Level",
      "Next Level",
      "Remaining Subs",
    ];

    const body = filtered.map((r) => {
      const next = Math.min(r.level + 1, 5);
      return [
        r.name,
        r.mobile,
        r.city,
        r.activeSubs,
        r.level,
        next,
        Math.max(0, LEVEL_RULES[next] - r.activeSubs),
      ].join(",");
    });

    const csv = [header.join(","), ...body].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "dealer-promotions.csv";
    a.click();
  }

  return (
    <AdminGuard>
      <AdminLayout>
        <div style={{ padding: 24 }}>
          <h1 style={{ fontSize: 26, fontWeight: 900 }}>
            Dealer Promotion – Admin Control
          </h1>

          {/* ================= FILTER BAR ================= */}
          <div style={filterBar}>
            <input
              placeholder="Search name / mobile"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={input}
            />

            <select
              value={levelFilter}
              onChange={(e) => setLevelFilter(e.target.value)}
              style={input}
            >
              <option value="all">All Levels</option>
              {[1, 2, 3, 4, 5].map((l) => (
                <option key={l} value={l}>
                  Level {l}
                </option>
              ))}
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={input}
            >
              <option value="all">All Status</option>
              <option value="due">Promotion Due</option>
              <option value="not-due">Not Eligible</option>
            </select>

            <button onClick={exportCSV} style={exportBtn}>
              Export Excel
            </button>
          </div>

          {/* ================= SUMMARY ================= */}
          <div style={summary}>
            Total Dealers: <b>{filtered.length}</b>
          </div>

          {/* ================= TABLE ================= */}
          <table style={table}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Mobile</th>
                <th>City</th>
                <th>Active Subs</th>
                <th>Level</th>
                <th>Next Level</th>
                <th>Remaining</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r, i) => {
                const next = Math.min(r.level + 1, 5);
                const remaining = LEVEL_RULES[next] - r.activeSubs;
                const due = remaining <= 0;

                return (
                  <tr key={i}>
                    <td>{r.name}</td>
                    <td>{r.mobile}</td>
                    <td>{r.city}</td>
                    <td>{r.activeSubs}</td>
                    <td>Level {r.level}</td>
                    <td>Level {next}</td>
                    <td>{Math.max(0, remaining)}</td>
                    <td style={{ color: due ? "#16a34a" : "#dc2626" }}>
                      {due ? "Promotion Due" : "Not Eligible"}
                    </td>
                    <td>
                      <button style={approveBtn}>Approve</button>
                      <button style={holdBtn}>Hold</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </AdminLayout>
    </AdminGuard>
  );
}

/* ================= STYLES ================= */

const filterBar = {
  display: "flex",
  gap: 10,
  margin: "20px 0",
  flexWrap: "wrap",
};

const input = {
  padding: 10,
  borderRadius: 10,
  border: "1px solid #cbd5f5",
  minWidth: 180,
};

const exportBtn = {
  padding: "10px 14px",
  background: "#1e40af",
  color: "#fff",
  border: "none",
  borderRadius: 10,
  fontWeight: 700,
};

const summary = {
  marginBottom: 10,
  fontSize: 14,
  color: "#475569",
};

const table = {
  width: "100%",
  borderCollapse: "collapse",
};

const approveBtn = {
  padding: "6px 10px",
  background: "#16a34a",
  color: "#fff",
  border: "none",
  borderRadius: 8,
  marginRight: 6,
};

const holdBtn = {
  padding: "6px 10px",
  background: "#f59e0b",
  color: "#fff",
  border: "none",
  borderRadius: 8,
};
