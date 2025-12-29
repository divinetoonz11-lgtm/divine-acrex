// pages/api/admin/properties/update-status.js
import dbConnect from "../../../../utils/dbConnect";
import Property from "../../../../models/Property";
import adminGuard from "../../../../utils/adminGuard";

/*
PROPERTY STATUS UPDATE – FINAL
✔ adminGuard secured
✔ lowercase status enforced
✔ UI compatible
*/

export default async function handler(req, res) {
  // 🔐 ADMIN ONLY
  if (!(await adminGuard(req, res))) return;

  await dbConnect();

  if (req.method !== "PUT") {
    return res.status(405).json({
      ok: false,
      message: "Only PUT allowed",
    });
  }

  try {
    const { id, status } = req.body;

    if (!id) {
      return res.status(400).json({ ok: false, message: "id missing" });
    }

    if (!status) {
      return res.status(400).json({ ok: false, message: "status missing" });
    }

    // 🔒 LOCKED STATUS VALUES
    const nextStatus = status.toLowerCase(); // pending | live | blocked

    const property = await Property.findById(id);
    if (!property) {
      return res.status(404).json({ ok: false, message: "Property not found" });
    }

    property.status = nextStatus;
    await property.save();

    return res.status(200).json({
      ok: true,
      property,
    });
  } catch (err) {
    console.error("PROPERTY UPDATE STATUS ERROR:", err);
    return res.status(500).json({
      ok: false,
      message: "Server error",
    });
  }
}
