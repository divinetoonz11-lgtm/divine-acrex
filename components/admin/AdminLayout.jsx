import Link from "next/link";
import { useRouter } from "next/router";
import { signOut } from "next-auth/react";

const MENU = [
  {
    title: "ADMIN MANAGEMENT",
    items: [
      ["Overview", "/admin/overview"],
      ["Dashboard", "/admin/dashboard"],
      ["Admin Profile", "/admin/profile"],
    ],
  },
  {
    title: "USER MANAGEMENT",
    items: [
      ["Users", "/admin/users"],
      ["Sub Admins", "/admin/sub-admins"],
      ["Roles & Permissions", "/admin/roles"],
    ],
  },
  {
    title: "DEALER MANAGEMENT",
    items: [
      ["Dealers", "/admin/dealers"],
      ["Dealer Promotions", "/admin/dealer-promotions"],
    ],
  },
  {
    title: "PROPERTY MANAGEMENT",
    items: [
      ["Overview", "/admin/property-overview"],
      ["All Properties", "/admin/properties"],
      ["Property Control", "/admin/property-control"],
      ["Insights & Reports", "/admin/insights_reports"],
      ["Abuse & Spam", "/admin/abuse"],
    ],
  },
  {
    title: "REVENUE MANAGEMENT",
    items: [
      ["Subscriptions", "/admin/subscriptions"],
      ["Payments", "/admin/payments"],
      ["Payouts", "/admin/payouts"],
      ["Revenue Analytics", "/admin/revenue"],
      ["Ads & Promotions", "/admin/ads"],
    ],
  },

  // ✅ NEW SECTION ADDED
  {
    title: "OWNER CONTACT MANAGEMENT",
    items: [
      ["Plans", "/admin/owner-contact-plans"],
      ["Payments", "/admin/owner-contact-payments"],
      ["Usage Logs", "/admin/owner-contact-logs"],
    ],
  },

  {
    title: "SYSTEM MANAGEMENT",
    items: [
      ["Analytics", "/admin/analytics"],
      ["Audit Logs", "/admin/audit-log"],
      ["Notifications", "/admin/notifications"],
      ["Settings", "/admin/settings"],
    ],
  },
];

export default function AdminLayout({ children }) {
  const router = useRouter();

  return (
    <div className="admin-root">
      <aside className="admin-sidebar">
        <div className="admin-logo">DIVINE ACRES</div>

        <div className="admin-menu">
          {MENU.map((group, gi) => (
            <div key={gi} className="admin-group">
              <div className="admin-group-title">{group.title}</div>

              {group.items.map(([label, path], i) => {
                const active =
                  router.pathname === path ||
                  router.asPath.startsWith(path);

                return (
                  <Link key={i} href={path}>
                    <div className={`admin-item ${active ? "active" : ""}`}>
                      {label}
                    </div>
                  </Link>
                );
              })}
            </div>
          ))}
        </div>

        <button
          className="admin-logout"
          onClick={() => signOut({ callbackUrl: "/" })}
        >
          Logout
        </button>
      </aside>

      <main className="admin-main">{children}</main>

      <style jsx global>{`
        .admin-root {
          display: flex;
          min-height: 100vh;
          background: #f1f5fb;
        }

        .admin-sidebar {
          width: 300px;
          background: linear-gradient(180deg, #0a1e3b, #0b254f);
          color: #ffffff;
          display: flex;
          flex-direction: column;
          overflow-y: auto;
        }

        .admin-logo {
          padding: 22px;
          font-size: 20px;
          font-weight: 900;
          text-align: center;
          letter-spacing: 1px;
          background: rgba(255, 255, 255, 0.08);
        }

        .admin-menu {
          flex: 1;
          padding-bottom: 20px;
        }

        .admin-group {
          margin-top: 18px;
        }

        .admin-group-title {
          margin: 12px 14px 6px;
          padding: 6px 10px;
          font-size: 12px;
          font-weight: 900;
          letter-spacing: 1px;
          text-transform: uppercase;
          color: #c7d2fe;
          background: rgba(255, 255, 255, 0.12);
          border-radius: 8px;
        }

        .admin-item {
          padding: 10px 14px;
          margin: 4px 10px;
          border-radius: 10px;
          cursor: pointer;
          font-size: 14px;
          font-weight: 600;
          color: #e5e7eb;
          transition: all 0.2s ease;
        }

        .admin-item:hover {
          background: rgba(255, 255, 255, 0.15);
        }

        .admin-item.active {
          background: linear-gradient(135deg, #2563eb, #1e40af);
          color: #ffffff;
          font-weight: 800;
        }

        .admin-logout {
          margin: 14px;
          padding: 12px;
          border-radius: 12px;
          border: none;
          background: #ef4444;
          color: #ffffff;
          font-weight: 800;
          cursor: pointer;
        }

        .admin-logout:hover {
          background: #dc2626;
        }

        .admin-main {
          flex: 1;
          padding: 32px;
          overflow-y: auto;
        }
      `}</style>
    </div>
  );
}
