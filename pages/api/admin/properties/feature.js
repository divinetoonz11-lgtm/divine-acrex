// pages/api/admin/properties/feature.js
import dbConnect from "../../../../utils/dbConnect";
import Property from "../../../../models/Property";
import adminGuard from "../../../../utils/adminGuard";

/*
PROPERTY FEATURE TOGGLE – FINAL
✔ adminGuard secured
✔ true / false toggle
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
    const { id, featured } = req.body;

    if (!id) {
      return res.status(400).json({ ok: false, message: "id missing" });
    }

    if (typeof featured !== "boolean") {
      return res.status(400).json({ ok: false, message: "featured must be boolean" });
    }

    const property = await Property.findById(id);
    if (!property) {
      return res.status(404).json({ ok: false, message: "Property not found" });
    }

    property.featured = featured;
    await property.save();

    return res.status(200).json({
      ok: true,
      property,
    });
  } catch (err) {
    console.error("PROPERTY FEATURE ERROR:", err);
    return res.status(500).json({
      ok: false,
      message: "Server error",
    });
  }
}
