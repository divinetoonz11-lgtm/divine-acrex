import clientPromise from "../../../../lib/mongodb";
import adminGuard from "../../../../lib/adminGuard";
import { ObjectId } from "mongodb";

/*
ADMIN SUBSCRIPTION STATUS UPDATE
✔ Activate
✔ Cancel
✔ Used by admin UI button
*/

export default async function handler(req, res) {
  if (!(await adminGuard(req, res))) return;

  if (req.method !== "PUT") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { id, status } = req.body;

  if (!id || !status) {
    return res.status(400).json({
      message: "id and status required",
    });
  }

  const db = (await clientPromise).db();

  const update = {
    status,
    updatedAt: new Date(),
  };

  if (status === "active") {
    update.startDate = new Date();
  }

  const result = await db
    .collection("subscriptions")
    .findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: update },
      { returnDocument: "after" }
    );

  return res.json({
    subscription: result.value,
  });
}
