import clientPromise from "../../../../lib/mongodb";
import { ObjectId } from "mongodb";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]";

const ADMIN_EMAILS = [
  "inder.ambalika@gmail.com",
  "divinetoonz11@gmail.com",
];

export default async function handler(req, res) {
  try {
    if (req.method !== "PUT") {
      return res.status(405).json({
        ok: false,
        message: "Only PUT allowed",
      });
    }

    const session = await getServerSession(req, res, authOptions);

    if (!session || !ADMIN_EMAILS.includes(session.user?.email)) {
      return res.status(401).json({
        ok: false,
        message: "Unauthorized",
      });
    }

    const { id, status, verified } = req.body;

    if (!id || !ObjectId.isValid(id)) {
      return res.status(400).json({
        ok: false,
        message: "Invalid property id",
      });
    }

    const client = await clientPromise;
    const db = client.db("divineacres");
    const col = db.collection("properties");

    let updateData = {
      updatedAt: new Date(),
    };

    // STATUS UPDATE
    if (status) {
      if (!["pending", "live", "blocked"].includes(status)) {
        return res.status(400).json({
          ok: false,
          message: "Invalid status",
        });
      }
      updateData.status = status;
    }

    // VERIFIED UPDATE
    if (typeof verified === "boolean") {
      updateData.verified = verified;

      if (verified) {
        updateData.approvedBy = session.user.email;
        updateData.approvedAt = new Date();
      } else {
        updateData.approvedBy = null;
        updateData.approvedAt = null;
      }
    }

    await col.updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );

    return res.status(200).json({
      ok: true,
      message: "Updated successfully",
    });

  } catch (err) {
    console.error("ADMIN UPDATE ERROR:", err);
    return res.status(500).json({
      ok: false,
      message: "Server error",
    });
  }
}
