// pages/admin/config/adminSidebar.js

/*
ADMIN SIDEBAR CONFIG (ENTERPRISE)
✔ Sidebar menu data source
✔ Role / country / franchise ready
✔ Build-safe for Next.js (default component required)
*/

/* ===== SIDEBAR DATA ===== */
export const adminSidebarConfig = [
  // CORE
  { key: "overview", label: "Overview", path: "/admin/overview" },
  { key: "dashboard", label: "Dashboard", path: "/admin/dashboard" },

  // USERS & ACCESS
  { key: "users", label: "Users", path: "/admin/users" },
  { key: "dealers", label: "Dealers", path: "/admin/dealers" },
  { key: "roles", label: "Roles & Permissions", path: "/admin/roles" },
  { key: "blocked", label: "Blocked Accounts", path: "/admin/blocked" },

  // PROPERTIES
  { key: "properties", label: "All Properties", path: "/admin/properties" },
  {
    key: "pending",
    label: "Pending Properties",
    path: "/admin/properties?tab=pending",
  },
  {
    key: "reported",
    label: "Reported Listings",
    path: "/admin/properties?tab=reported",
  },
  {
    key: "featured",
    label: "Featured / Boosted",
    path: "/admin/properties?tab=featured",
  },
  { key: "projects", label: "Projects / Builders", path: "/admin/projects" },

  // LEADS & ENQUIRIES
  { key: "enquiries", label: "Enquiries", path: "/admin/enquiries" },
  { key: "leads", label: "Leads", path: "/admin/enquiries?tab=leads" },

  // REVENUE
  { key: "subscriptions", label: "Subscriptions", path: "/admin/subscriptions" },
  { key: "payments", label: "Payments", path: "/admin/payments" },
  { key: "payouts", label: "Payouts", path: "/admin/payments?tab=payouts" },
  { key: "tax", label: "GST / Tax", path: "/admin/payments?tab=tax" },

  // FRANCHISE & GLOBAL
  { key: "franchise", label: "Franchise Management", path: "/admin/franchise" },
  { key: "partners", label: "Partners", path: "/admin/partners" },
  {
    key: "international",
    label: "International Control",
    path: "/admin/international",
  },
  {
    key: "currency",
    label: "Currency & Pricing",
    path: "/admin/international?tab=pricing",
  },

  // MARKETING
  { key: "ads", label: "Advertisements", path: "/admin/ads" },
  { key: "banners", label: "Banner Manager", path: "/admin/banners" },
  { key: "campaigns", label: "Campaigns", path: "/admin/campaigns" },

  // ANALYTICS & SECURITY
  { key: "analytics", label: "Analytics", path: "/admin/analytics" },
  { key: "ai", label: "AI Moderation", path: "/admin/ai" },
  { key: "audit", label: "Audit Logs", path: "/admin/audit-log" },

  // SYSTEM
  { key: "settings", label: "System Settings", path: "/admin/settings" },
  { key: "profile", label: "Admin Profile", path: "/admin/profile" },
];

/* ===== REQUIRED DEFAULT EXPORT (BUILD SAFE) ===== */
export default function AdminSidebarConfigPage() {
  return null;
}
