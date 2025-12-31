import { getServerSession } from "next-auth/next";
import clientPromise from "../../../../lib/mongodb";

/*
ADMIN – DEALER REQUESTS (PENDING)
---------------------------------
✔ Only admin can access
✔ Fetches public dealer applications
✔ Reads from dealer_requests collection
*/

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({
      ok: false,
      message: "Method not allowed",
    });
  }

  try {
    /* =========================
       🔐 ADMIN AUTH CHECK
    ========================= */
    const { authOptions } = await import("../../auth/[...nextauth]");
    const session = await getServerSession(req, res, authOptions);

    if (!session || session.user?.role !== "admin") {
      return res.status(401).json({
        ok: false,
        message: "Unauthorized",
      });
    }

    /* =========================
       📦 DB FETCH
    ========================= */
    const client = await clientPromise;
    const db = client.db();

    const requests = await db
      .collection("dealer_requests")
      .find({ status: "pending" })
      .sort({ createdAt: -1 })
      .toArray();

    /* =========================
       ✅ RESPONSE
    ========================= */
    return res.json({
      ok: true,
      rows: requests, // 🔑 frontend इसी key को पढ़ता है
    });
  } catch (err) {
    console.error("ADMIN DEALER REQUESTS ERROR:", err);
    return res.status(500).json({
      ok: false,
      message: "Server error",
    });
  }
}
