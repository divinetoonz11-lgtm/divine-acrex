import dbConnect from "../../../../utils/dbConnect";
import User from "../../../../models/User";
import adminGuard from "../../../../utils/adminGuard";

export default async function handler(req, res) {
  // 🔐 ADMIN CHECK (SERVER SAFE)
  const ok = await adminGuard(req, res);
  if (!ok) return;

  if (req.method !== "DELETE") {
    return res.status(405).json({
      error: "Only DELETE allowed",
    });
  }

  try {
    await dbConnect();

    const { id } = req.body || {};
    if (!id) {
      return res.status(400).json({
        error: "Missing user id",
      });
    }

    const deleted = await User.findByIdAndDelete(id).lean();
    if (!deleted) {
      return res.status(404).json({
        error: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
    });
  } catch (err) {
    console.error("ADMIN USER DELETE ERROR:", err);
    return res.status(500).json({
      error: "Server error",
    });
  }
}
