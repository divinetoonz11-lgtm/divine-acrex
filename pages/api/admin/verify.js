import dbConnect from "../../../utils/dbConnect";
import Admin from "../../../models/Admin";

export default async function handler(req, res) {
  await dbConnect();

  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Only POST allowed" });
  }

  const auth = req.headers.authorization || "";
  const token = auth.startsWith("Bearer ") ? auth.split(" ")[1] : null;

  if (!token) {
    return res.status(401).json({ success: false, message: "Missing token" });
  }

  // ? Accept either environment ADMIN_TOKEN (recommended) OR legacy static token
  const validToken = process.env.ADMIN_TOKEN || "ADMIN_SECURE_TOKEN";

  if (token === validToken) {
    return res.status(200).json({ success: true, message: "Verified" });
  }

  // Optional: allow token to be admin id (not recommended long-term)
  try {
    const admin = await Admin.findById(token).select("_id email name");
    if (admin) {
      return res.status(200).json({ success: true, message: "Verified (admin id)" });
    }
  } catch (e) {
    // ignore parse errors
  }

  return res.status(401).json({ success: false, message: "Invalid token" });
}
