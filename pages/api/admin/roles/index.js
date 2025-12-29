import dbConnect from "../../../../utils/dbConnect";
import Role from "../../../../models/Role";
import adminGuard from "../../../../utils/adminGuard";

/*
ROLE MASTER API
✔ Create Role
✔ List Roles
✔ Used by Sub-Admin dropdown
*/

export default async function handler(req, res) {
  if (!(await adminGuard(req, res))) return;

  await dbConnect();

  /* ================= CREATE ROLE ================= */
  if (req.method === "POST") {
    const { name, scope, permissions } = req.body;

    if (!name || !scope) {
      return res.status(400).json({ ok: false, message: "Name & scope required" });
    }

    const exists = await Role.findOne({ name });
    if (exists) {
      return res.status(409).json({ ok: false, message: "Role already exists" });
    }

    const role = await Role.create({
      name,
      scope, // USER | DEALER | FRANCHISE_COUNTRY | FRANCHISE_STATE | FRANCHISE_CITY
      permissions: permissions || [],
    });

    return res.json({ ok: true, role });
  }

  /* ================= LIST ROLES ================= */
  if (req.method === "GET") {
    const roles = await Role.find({})
      .select("name scope permissions")
      .sort({ createdAt: -1 })
      .lean();

    return res.json({ ok: true, roles });
  }

  return res.status(405).json({ ok: false });
}
