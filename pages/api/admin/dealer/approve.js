import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]";
import clientPromise from "../../../../lib/mongodb";

/*
ADMIN DEALER APPROVAL API
-------------------------
✔ Only admin allowed
✔ Pending request only
✔ User role changed ONLY here
✔ Atomic & safe
*/

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, message: "Method not allowed" });
  }

  try {
    // 🔐 Admin session check
    const session = await getServerSession(req, res, authOptions);
    if (!session?.user?.email || session.user.role !== "admin") {
      return res.status(401).json({ ok: false, message: "Admin only" });
    }

    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ ok: false, message: "Email required" });
    }

    const client = await clientPromise;
    const db = client.db();

    const users = db.collection("users");
    const dealerRequests = db.collection("dealer_requests");

    // 🔍 Find pending request
    const request = await dealerRequests.findOne({
      email,
      status: "pending",
    });

    if (!request) {
      return res.status(404).json({
        ok: false,
        message: "No pending dealer request found",
      });
    }

    // 🔒 Update user role → dealer
    await users.updateOne(
      { email },
      { $set: { role: "dealer", updatedAt: new Date() } }
    );

    // ✅ Mark request approved
    await dealerRequests.updateOne(
      { email },
      {
        $set: {
          status: "approved",
          approvedAt: new Date(),
          approvedBy: session.user.email,
        },
      }
    );

    return res.json({
      ok: true,
      message: "Dealer approved successfully",
    });
  } catch (err) {
    console.error("ADMIN DEALER APPROVE ERROR:", err);
    return res.status(500).json({
      ok: false,
      message: "Server error",
    });
  }
}
