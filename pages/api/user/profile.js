import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import clientPromise from "../../../lib/mongodb";
import formidable from "formidable";
import fs from "fs";
import path from "path";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  try {
    const session = await getServerSession(req, res, authOptions);
    if (!session?.user?.email) {
      return res.status(401).json({ ok: false, message: "Unauthorized" });
    }

    const client = await clientPromise;
    const db = client.db();
    const users = db.collection("users");
    const email = session.user.email;

    const user = await users.findOne({ email });
    if (!user) {
      return res.status(404).json({ ok: false, message: "User not found" });
    }

    /* ================= GET ================= */
    if (req.method === "GET") {
      return res.json({
        ok: true,
        name: user.name || "",
        email: user.email,
        phone: user.phone || "",
        image: user.photo || "",
        referralCode: user.referralCode || "",
        profileCompleted: !!user.profileCompleted,
      });
    }

    /* ================= PUT ================= */
    if (req.method === "PUT") {
      const uploadDir = path.join(process.cwd(), "public/uploads");
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      const form = formidable({
        multiples: false,
        keepExtensions: true,
      });

      form.parse(req, async (err, fields, files) => {
        if (err) {
          console.error("FORM ERROR:", err);
          return res.status(400).json({ ok: false });
        }

        const update = {};

        if (fields.name) update.name = String(fields.name);
        if (fields.phone) update.phone = String(fields.phone);
        if (fields.profileCompleted !== undefined) {
          update.profileCompleted = fields.profileCompleted === "true";
        }

        /* ===== PHOTO SAFE HANDLE ===== */
        const img = files?.image;
        const file = Array.isArray(img) ? img[0] : img;

        if (file && file.filepath) {
          const ext =
            path.extname(file.originalFilename || "") || ".jpg";

          const newName = `user_${Date.now()}${ext}`;
          const newPath = path.join(uploadDir, newName);

          fs.renameSync(file.filepath, newPath);
          update.photo = `/uploads/${newName}`;
        }

        await users.updateOne(
          { email },
          { $set: update }
        );

        return res.json({
          ok: true,
          image: update.photo || user.photo || "",
          referralCode: user.referralCode || "",
        });
      });

      return;
    }

    return res.status(405).json({ ok: false });
  } catch (err) {
    console.error("PROFILE API ERROR:", err);
    return res.status(500).json({ ok: false });
  }
}
