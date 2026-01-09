import dbConnect from "../../../../utils/dbConnect";
import Property from "../../../../models/Property";
import Enquiry from "../../../../models/Enquiry";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]";

const ADMIN_EMAILS = [
  "inder.ambalika@gmail.com",
  "divinetoonz11@gmail.com",
];

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);
  if (!session || !ADMIN_EMAILS.includes(session.user?.email)) {
    return res.status(401).json({ ok: false });
  }

  await dbConnect();

  const page = parseInt(req.query.page || "1");
  const limit = parseInt(req.query.limit || "10");
  const skip = (page - 1) * limit;

  const props = await Property.find({ spam: true })
    .skip(skip)
    .limit(limit)
    .lean();

  const enqs = await Enquiry.find({ spam: true })
    .skip(skip)
    .limit(limit)
    .lean();

  const items = [
    ...props.map(p => ({
      _id: p._id,
      type: "property",
      title: p.title,
      reason: p.spamReason,
    })),
    ...enqs.map(e => ({
      _id: e._id,
      type: "enquiry",
      name: e.name,
      reason: e.spamReason,
    })),
  ];

  const total =
    (await Property.countDocuments({ spam: true })) +
    (await Enquiry.countDocuments({ spam: true }));

  res.json({ ok: true, items, total });
}
