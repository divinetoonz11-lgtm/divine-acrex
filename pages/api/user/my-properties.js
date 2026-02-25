import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import clientPromise from "../../../lib/mongodb";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);

  if (!session?.user?.email) {
    return res.status(401).json({ ok: false, message: "Unauthorized" });
  }

  const client = await clientPromise;
  const db = client.db();
  const email = session.user.email;

  /* =====================================================
     GET → USER MY PROPERTIES
     ✔ Pending / Approved / Rejected sab dikhegi
     ✔ Admin approval ka wait nahi
  ===================================================== */
  if (req.method === "GET") {
    const rows = await db
      .collection("properties")
      .find({
        ownerEmail: email,
        isDeleted: { $ne: true },
      })
      .sort({ createdAt: -1 })
      .project({
        title: 1,
        city: 1,
        price: 1,
        status: 1,              // pending / approved
        verificationStatus: 1,  // VERIFIED / UNVERIFIED
        availability: 1,
        photos: 1,
        createdAt: 1,
      })
      .toArray();

    return res.json({
      ok: true,
      data: rows,
    });
  }

  /* =====================================================
     DELETE → SOFT DELETE
  ===================================================== */
  if (req.method === "DELETE") {
    const { propertyId } = req.body;

    if (!propertyId) {
      return res.status(400).json({
        ok: false,
        message: "Property id missing",
      });
    }

    await db.collection("properties").updateOne(
      {
        _id: new ObjectId(propertyId),
        ownerEmail: email,
      },
      {
        $set: {
          isDeleted: true,
          updatedAt: new Date(),
        },
      }
    );

    return res.json({ ok: true });
  }

  /* =====================================================
     PATCH → SOLD / RENTED
  ===================================================== */
  if (req.method === "PATCH") {
    const { propertyId, status } = req.body;

    if (!propertyId || !["sold", "rented"].includes(status)) {
      return res.status(400).json({
        ok: false,
        message: "Invalid request",
      });
    }

    await db.collection("properties").updateOne(
      {
        _id: new ObjectId(propertyId),
        ownerEmail: email,
      },
      {
        $set: {
          status,
          availability: false,
          updatedAt: new Date(),
        },
      }
    );

    return res.json({ ok: true });
  }

  return res.status(405).json({
    ok: false,
    message: "Method not allowed",
  });
}
