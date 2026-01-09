import dbConnect from "../../../../utils/dbConnect";
import Property from "../../../../models/Property";
import Enquiry from "../../../../models/Enquiry";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]";

export default async function handler(req, res) {
  if (req.method !== "PUT") {
    return res.status(405).json({ ok: false });
  }

  const session = await getServerSession(req, res, authOptions);
  if (!session) return res.status(401).json({ ok: false });

  await dbConnect();

  const { id, type, action, reason } = req.body;

  const Model = type === "property" ? Property : Enquiry;

  // AUTO FLAG RULES
  if (action === "reason") {
    await Model.findByIdAndUpdate(id, {
      spam: true,
      spamReason: reason,
    });
  }

  if (action === "clear") {
    await Model.findByIdAndUpdate(id, {
      spam: false,
      spamReason: "",
    });
  }

  if (action === "delete") {
    await Model.findByIdAndDelete(id);
  }

  res.json({ ok: true });
}
