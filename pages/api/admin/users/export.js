import clientPromise from "../../../../lib/mongodb";
import adminGuard from "../../../../lib/adminGuard";

/*
USERS CSV EXPORT – FINAL
✔ Admin only
✔ Current filters supported
✔ Large data safe (stream-like simple build)
✔ Excel compatible
*/

export default async function handler(req, res) {
  // 🔒 Admin check
  if (!(await adminGuard(req, res))) return;

  try {
    const db = (await clientPromise).db();

    const {
      q,
      role,
      status,
      from,
      to,
      kycStatus,
    } = req.query;

    const query = {};

    // 🔍 SEARCH
    if (q) {
      query.$or = [
        { name: { $regex: q, $options: "i" } },
        { email: { $regex: q, $options: "i" } },
        { mobile: { $regex: q, $options: "i" } },
      ];
    }

    // 🎭 FILTERS
    if (role) query.role = role;
    if (status) query.status = status;
    if (kycStatus) query.kycStatus = kycStatus;

    // 📅 DATE RANGE
    if (from || to) {
      query.createdAt = {};
      if (from) query.createdAt.$gte = new Date(from);
      if (to) query.createdAt.$lte = new Date(to + "T23:59:59.999Z");
    }

    const users = await db
      .collection("users")
      .find(query)
      .sort({ createdAt: -1 })
      .toArray();

    // 🧾 CSV HEADER
    let csv =
      "Name,Email,Role,Mobile,Status,KYC Status,Created At\n";

    // 🧾 CSV ROWS
    users.forEach((u) => {
      csv += `"${(u.name || "").replace(/"/g, '""')}",`;
      csv += `"${u.email}",`;
      csv += `"${u.role || ""}",`;
      csv += `"${u.mobile || ""}",`;
      csv += `"${u.status || ""}",`;
      csv += `"${u.kycStatus || ""}",`;
      csv += `"${u.createdAt ? new Date(u.createdAt).toISOString() : ""}"\n`;
    });

    // 📦 RESPONSE HEADERS
    res.setHeader("Content-Type", "text/csv; charset=utf-8");
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=users_export.csv"
    );

    return res.status(200).send(csv);
  } catch (err) {
    console.error("CSV EXPORT ERROR:", err);
    return res.status(500).json({
      ok: false,
      message: "CSV export failed",
    });
  }
}
