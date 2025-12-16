import dbConnect from "../../../../utils/dbConnect";
import Property from "../../../../models/Property";
import adminGuard from "../../../../utils/adminGuard";

export default async function handler(req, res) {
  if (!(await adminGuard(req, res))) return;

  await dbConnect();

  try {
    if (req.method === "GET") {
      // example: list properties
      const props = await Property.find({}).limit(300).lean();
      return res.status(200).json(props);
    }

    if (req.method === "POST") {
      // create property (body expected)
      const payload = req.body;
      const created = await Property.create(payload);
      return res.status(201).json({ success: true, property: created });
    }

    return res.status(405).json({ error: "Method not allowed" });
  } catch (err) {
    console.error("admin/properties action error:", err);
    return res.status(500).json({ error: "Server error" });
  }
}
