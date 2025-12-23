import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import dbConnect from "../../../utils/dbConnect";
import Notification from "../../../models/Notification";

/*
DEALER NOTIFICATIONS API – FINAL
✔ Dealer-only
✔ Latest first
✔ Consistent schema (userEmail)
*/

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);

  if (!session || session.user?.role !== "dealer") {
    return res.status(401).json({ ok: false, message: "Unauthorized" });
  }

  await dbConnect();

  if (req.method === "GET") {
    const list = await Notification.find({
      userEmail: session.user.email,
    })
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();

    return res.status(200).json({
      ok: true,
      data: list,
    });
  }

  return res.status(405).json({
    ok: false,
    message: "Method not allowed",
  });
}
