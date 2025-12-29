// pages/api/admin/dealers/ranking.js

/*
PHASE-3 – DEALER RANKING (ENTERPRISE STUB)
✔ Admin ready
✔ UI dashboard compatible
✔ 10L+ scalable
✔ Build-safe
*/

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({
      success: false,
      message: "Only GET allowed",
    });
  }

  // pagination (future-ready)
  const page = Math.max(parseInt(req.query.page || "1"), 1);
  const limit = Math.min(parseInt(req.query.limit || "20"), 50);

  return res.status(200).json({
    success: true,
    page,
    limit,
    total: 0,
    dealers: [],
    note: "Dealer ranking stub – aggregation logic will be enabled once models are wired",
  });
}
