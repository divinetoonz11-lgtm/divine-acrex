// pages/api/admin/dealers/subscriptions.js

/*
PHASE-2 – DEALER SUBSCRIPTIONS (ENTERPRISE STUB)
✔ Admin ready
✔ Dealer-wise view compatible
✔ Pagination ready (10L+ scale)
✔ Build-safe
*/

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({
      success: false,
      message: "Only GET allowed",
    });
  }

  const dealerId = req.query.dealerId || null;
  const page = Math.max(parseInt(req.query.page || "1"), 1);
  const limit = Math.min(parseInt(req.query.limit || "20"), 50);

  if (!dealerId) {
    return res.status(400).json({
      success: false,
      message: "dealerId required",
    });
  }

  return res.status(200).json({
    success: true,
    dealer: {
      _id: dealerId,
      name: "Dealer Name",
    },
    page,
    limit,
    total: 0,
    subscriptions: [],
    note: "Dealer subscriptions stub – models will be wired later",
  });
}
