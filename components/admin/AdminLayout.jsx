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
      ["Dealer Referrals", "/admin/dealer-referrals"],
    ],
  },
  {
    title: "PROPERTY MANAGEMENT",
    items: [
      ["All Properties", "/admin/properties"],
      ["Pending Listings", "/admin/pending"],
      ["Featured Listings", "/admin/featured"],
      ["Boosted Listings", "/admin/boosted"],
      ["Property Filters", "/admin/filters"],
      ["Enquiries", "/admin/enquiries"],
      ["Property Reports", "/admin/reports"],
      ["Spam / Abuse", "/admin/spam"],
    ],
  },
  {
    title: "REVENUE MANAGEMENT",
    items: [
      ["Subscriptions", "/admin/subscriptions"],
      ["Payments", "/admin/payments"],
      ["Payouts", "/admin/payouts"],
      ["Revenue Analytics", "/admin/revenue"],
      ["Commission Rules", "/admin/commission"],
      ["Coupons", "/admin/coupons"],
      ["Invoices", "/admin/invoices"],
    ],
  },
  {
    title: "FRANCHISE MANAGEMENT",
    items: [
      ["Global Franchise Overview", "/admin/franchise"],
      ["Country Franchises", "/admin/franchise/country"],
      ["State Franchises", "/admin/franchise/state"],
      ["City Franchises", "/admin/franchise/city"],
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
              <div className="admin-group-title">
                {group.title}
              </div>

              {group.items.map(([label, path], i) => (
                <Link key={i} href={path}>
                  <div
                    className={
                      router.pathname === path
                        ? "admin-item active"
                        : "admin-item"
                    }
                  >
                    {label}
                  </div>
                </Link>
              ))}
            </div>
          ))}
        </div>

        {/* 🔒 LOGOUT */}
        <button
          className="admin-logout"
          onClick={() => signOut({ callbackUrl: "/" })}
        >
          Logout
        </button>
      </aside>

      <main className="admin-main">{children}</main>

      {/* ================= STYLES ================= */}
      <style jsx global>{`
        .admin-root {
          display: flex;
          height: 100vh;
        }

        .admin-sidebar {
          width: 300px;
          background: linear-gradient(180deg, #0a1e3b, #0b254f);
          color: #ffffff;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
        }

        .admin-logo {
          padding: 22px;
          font-size: 20px;
          font-weight: 900;
          text-align: center;
          letter-spacing: 1px;
          background: rgba(255,255,255,0.08);
        }

        .admin-menu {
          flex: 1;
          padding-bottom: 20px;
        }

        .admin-group {
          margin-top: 18px;
        }

        /* 🔵 READABLE HEADING */
        .admin-group-title {
          margin: 14px 14px 8px;
          padding: 6px 10px;
          font-size: 12px;
          font-weight: 900;
          letter-spacing: 1px;
          text-transform: uppercase;
          color: #c7d2fe;
          background: rgba(255,255,255,0.12);
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
          transition: background 0.2s;
        }

        .admin-item:hover {
          background: rgba(255,255,255,0.12);
        }

        .admin-item.active {
          background: linear-gradient(135deg,#2563eb,#1e40af);
          font-weight: 800;
          color: #ffffff;
        }

        .admin-logout {
          margin: 12px;
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
          background: #f1f5fb;
          overflow-y: auto;
        }
      `}</style>
    </div>
  );
}
