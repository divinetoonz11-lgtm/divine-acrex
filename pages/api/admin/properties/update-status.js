import dbConnect from "../../../../utils/dbConnect";
import Property from "../../../../models/Property";
import adminGuard from "../../../../utils/adminGuard";

export default async function handler(req, res) {
  if (!(await adminGuard(req, res))) return;

  await dbConnect();

  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Only POST allowed" });
  }

  try {
    const { propertyId, status } = req.body;
    if (!propertyId) return res.status(400).json({ success: false, message: "propertyId missing" });
    if (typeof status === "undefined") return res.status(400).json({ success: false, message: "status missing" });

    const property = await Property.findById(propertyId);
    if (!property) return res.status(404).json({ success: false, message: "Property not found" });

    property.status = status;
    await property.save();

    return res.status(200).json({ success: true, message: "Property status updated", property });
  } catch (err) {
    console.error("PROPERTY UPDATE STATUS ERROR:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
}
