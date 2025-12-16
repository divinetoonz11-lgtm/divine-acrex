import dbConnect from "../../../../utils/dbConnect";
import Property from "../../../../models/Property";
import adminGuard from "../../../../utils/adminGuard";

export default async function handler(req, res) {
  // SECURITY
  if (!(await adminGuard(req, res))) return;

  await dbConnect();

  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Only POST allowed" });
  }

  try {
    const { propertyId } = req.body;
    if (!propertyId) return res.status(400).json({ success: false, message: "propertyId missing" });

    const deleted = await Property.findByIdAndDelete(propertyId);
    if (!deleted) return res.status(404).json({ success: false, message: "Property not found" });

    return res.status(200).json({ success: true, message: "Property deleted" });
  } catch (err) {
    console.error("PROPERTY DELETE ERROR:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
}
