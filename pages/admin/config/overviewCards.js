// pages/admin/config/overviewCards.js

/*
ADMIN OVERVIEW CARDS CONFIG (ENTERPRISE)
✔ Overview cards ka data source
✔ Dashboard / analytics ready
✔ Build-safe default export added
*/

/* ===== OVERVIEW CARD DATA ===== */
export const overviewCardsConfig = [
  {
    key: "users",
    label: "Total Users",
    valueKey: "users",
    icon: "users",
    color: "blue",
  },
  {
    key: "dealers",
    label: "Active Dealers",
    valueKey: "dealers",
    icon: "briefcase",
    color: "green",
  },
  {
    key: "properties",
    label: "Live Properties",
    valueKey: "properties",
    icon: "home",
    color: "indigo",
  },
  {
    key: "revenue",
    label: "Total Revenue",
    valueKey: "revenue",
    icon: "currency",
    color: "emerald",
  },
];

/* ===== REQUIRED DEFAULT EXPORT (NEXT.JS SAFE) ===== */
export default function OverviewCardsConfigPage() {
  return null;
}
