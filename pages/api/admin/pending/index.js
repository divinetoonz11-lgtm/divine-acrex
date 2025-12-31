import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]";
import clientPromise from "../../../../lib/mongodb";

/*
ADMIN – DEALER REQUESTS (PENDING)
---------------------------------
✔ Only admin can access
✔ Reads from dealer_requests collection
✔ Shows public + logged-in submissions
*/

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ ok: false, message: "Method not allowed" });
  }

  try {
    // 🔐 Admin session check
    const session = await getServerSession(req, res, authOptions);
    if (!session || session.user.role !== "admin") {
      return res.status(401).json({ ok: false, message: "Unauthorized" });
    }

    // 🗄️ DB connect
    const client = await clientPromise;
    const db = client.db();

    // ✅ यही MAIN FIX है
    const requests = await db
      .collection("dealer_requests")
      .find({ status: "pending" })
      .sort({ createdAt: -1 })
      .toArray();

    return res.json({
      ok: true,
      count: requests.length,
      data: requests,
    });
  } catch (err) {
    console.error("ADMIN PENDING DEALERS ERROR:", err);
    return res.status(500).json({
      ok: false,
      message: "Server error",
    });
  }
}
