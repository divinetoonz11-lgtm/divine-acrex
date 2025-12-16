import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { getSession } from "next-auth/react";

/* ===== TAB COMPONENTS ===== */
import PendingTab from "./pending";
import SubscriptionsTab from "./subscriptions";
import AuditLogTab from "./audit-log";

/* ================= ADMIN EMAIL WHITELIST ================= */
const ADMIN_EMAILS = [
  "inder.ambalika@gmail.com",
  "divinetoonz11@gmail.com",
];

/* ================= DEMO DATA ================= */
const DEMO_USERS = [
  { _id: "u_demo1", name: "Deepika Sharma", mobile: "9876500001", email: "deepika1@example.com" },
  { _id: "u_demo2", name: "Rohan Verma", mobile: "9876500002", email: "rohan2@example.com" },
];

const DEMO_DEALERS = [
  { _id: "d_demo1", name: "Prime Estates", mobile: "9987600001", email: "prime@dealer.com", dealerStatus: "APPROVED" },
  { _id: "d_demo2", name: "Urban Realty", mobile: "9987600002", email: "urban@dealer.com", dealerStatus: "PENDING" },
];

const DEMO_PROPERTIES = [
  { _id: "p_demo1", title: "2 BHK Green Park", city: "Delhi", price: "45 L", status: "APPROVED" },
  { _id: "p_demo2", title: "Villa Blue Ridge", city: "Pune", price: "1.2 Cr", status: "PENDING" },
];

export default function AdminDashboard() {
  const router = useRouter();
  const [active, setActive] = useState("Overview");
  const [searchQ, setSearchQ] = useState("");
  const [checking, setChecking] = useState(true);

  const [users, setUsers] = useState(DEMO_USERS);
  const [dealers, setDealers] = useState(DEMO_DEALERS);
  const [properties, setProperties] = useState(DEMO_PROPERTIES);

  /* ================= SECURITY GUARD ================= */
  useEffect(() => {
    (async () => {
      const session = await getSession();
      if (!session || !ADMIN_EMAILS.includes(session.user?.email)) {
        router.replace("/");
        return;
      }
      setChecking(false);
    })();
  }, []);

  /* ================= FETCH REAL DATA ================= */
  useEffect(() => {
    if (checking) return;

    fetch("/api/admin/users")
      .then(r => r.json())
      .then(d => d?.ok && setUsers([...DEMO_USERS, ...(d.users || [])]));

    fetch("/api/admin/dealers")
      .then(r => r.json())
      .then(d => d?.ok && setDealers([...DEMO_DEALERS, ...(d.dealers || [])]));

    fetch("/api/admin/properties")
      .then(r => r.json())
      .then(d => d?.ok && setProperties([...DEMO_PROPERTIES, ...(d.properties || d.data || [])]));
  }, [checking]);

  if (checking) {
    return <div style={{ padding: 40, textAlign: "center" }}>Checking admin access…</div>;
  }

  /* ================= FULL MENU ================= */
  const menu = [
    "Overview",
    "Users",
    "Dealers",
    "Properties",
    "Pending",
    "Enquiries",
    "Payments / Transactions",
    "Reports / Analytics",
    "Subscriptions / Packages",
    "Notifications",
    "Messages / Chat",
    "Blog / Content",
    "Ads / Promotions",
    "Branches / Locations",
    "Settings",
    "Audit Log / History",
  ];

  const filter = (arr) =>
    arr.filter((o) =>
      Object.values(o).join(" ").toLowerCase().includes(searchQ.toLowerCase())
    );

  return (
    <div className="admin-wrapper">
      {/* SIDEBAR */}
      <aside className="admin-sidebar">
        <b style={{ marginBottom: 12, display: "block" }}>Admin Panel</b>
        {menu.map(m => (
          <div
            key={m}
            onClick={() => setActive(m)}
            className={`admin-sidebar-item ${active === m ? "active" : ""}`}
          >
            {m}
          </div>
        ))}
      </aside>

      {/* MAIN */}
      <main className="admin-main">
        <div className="admin-topbar">
          <b>{active}</b>
          <input
            placeholder="Search…"
            value={searchQ}
            onChange={(e) => setSearchQ(e.target.value)}
          />
        </div>

        <div style={{ padding: 24 }}>
          {active === "Overview" && (
            <div className="admin-grid">
              <Card title="Users" value={users.length} />
              <Card title="Dealers" value={dealers.length} />
              <Card title="Properties" value={properties.length} />
            </div>
          )}

          {active === "Users" && (
            <Table title="Users" data={filter(users)} cols={["name", "mobile", "email"]} />
          )}

          {active === "Dealers" && (
            <Table title="Dealers" data={filter(dealers)} cols={["name", "mobile", "email", "dealerStatus"]} />
          )}

          {active === "Properties" && (
            <Table title="Properties" data={filter(properties)} cols={["title", "city", "price", "status"]} />
          )}

          {active === "Pending" && <PendingTab />}

          {active === "Subscriptions / Packages" && <SubscriptionsTab />}

          {active === "Audit Log / History" && <AuditLogTab />}

          {![
            "Overview",
            "Users",
            "Dealers",
            "Properties",
            "Pending",
            "Subscriptions / Packages",
            "Audit Log / History",
          ].includes(active) && (
            <div className="admin-card">
              <h3>{active}</h3>
              <p style={{ color: "#6b7280" }}>
                {active} section backend connect hone ke baad active hoga.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

/* ================= SMALL COMPONENTS ================= */
const Card = ({ title, value }) => (
  <div className="admin-card">
    <div style={{ fontSize: 13, color: "#64748b" }}>{title}</div>
    <div style={{ fontSize: 26, fontWeight: 800 }}>{value}</div>
  </div>
);

const Table = ({ title, data, cols }) => (
  <div className="admin-card">
    <h3>{title}</h3>
    <table className="admin-table" width="100%">
      <thead>
        <tr>{cols.map(c => <th key={c}>{c}</th>)}</tr>
      </thead>
      <tbody>
        {data.map(row => (
          <tr key={row._id}>
            {cols.map(c => <td key={c}>{row[c]}</td>)}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);
