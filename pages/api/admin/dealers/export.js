// pages/api/admin/dealers/export.js
import dbConnect from "../../../../utils/dbConnect";
import Dealer from "../../../../models/Dealer";
import adminGuard from "../../../../utils/adminGuard";

/*
PHASE-3 – DEALER EXPORT (CSV)
✔ Admin only
✔ Stream-safe
*/

export default async function handler(req, res) {
  if (!(await adminGuard(req, res))) return;

  if (req.method !== "GET") {
    return res.status(405).end();
  }

  await dbConnect();

  const dealers = await Dealer.find({})
    .select("name email phone status createdAt")
    .lean();

  res.setHeader("Content-Type", "text/csv");
  res.setHeader("Content-Disposition", "attachment; filename=dealers.csv");

  res.write("Name,Email,Phone,Status,CreatedAt\n");
  dealers.forEach(d => {
    res.write(
      `${d.name || ""},${d.email || ""},${d.phone || ""},${d.status || ""},${d.createdAt}\n`
    );
  });
  res.end();
}
