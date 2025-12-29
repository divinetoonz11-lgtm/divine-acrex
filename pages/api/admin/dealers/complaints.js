// pages/api/admin/dealers/complaints.js

/*
PHASE-2 – DEALER COMPLAINTS (STUB)
✔ Admin only (future)
✔ Pagination ready
✔ Build-safe
*/

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({
      success: false,
      message: "Only GET allowed",
    });
  }

  return res.status(200).json({
    success: true,
    dealer: null,
    page: 1,
    limit: 20,
    total: 0,
    complaints: [],
    note: "Complaints module stub (models not wired yet)",
  });
}
