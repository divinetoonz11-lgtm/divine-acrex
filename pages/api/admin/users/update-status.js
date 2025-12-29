import dbConnect from "../../../../utils/dbConnect";
import User from "../../../../models/User";
import adminGuard from "../../../../utils/adminGuard";

export default async function handler(req, res) {
  // 🔐 ADMIN CHECK (SERVER SAFE)
  const ok = await adminGuard(req, res);
  if (!ok) return;

  if (req.method !== "PUT") {
    return res.status(405).json({
      error: "Only PUT allowed",
    });
  }

  try {
    await dbConnect();

    const { id, status } = req.body || {};

    if (!id || !status) {
      return res.status(400).json({
        error: "Missing user id or status",
      });
    }

    const updated = await User.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    ).lean();

    if (!updated) {
      return res.status(404).json({
        error: "User not found",
      });
    }

    return res.status(200).json({
      user: updated,
    });
  } catch (err) {
    console.error("ADMIN USER UPDATE STATUS ERROR:", err);
    return res.status(500).json({
      error: "Server error",
    });
  }
}
