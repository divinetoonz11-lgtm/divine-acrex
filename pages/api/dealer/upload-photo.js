import formidable from "formidable";
import fs from "fs";
import path from "path";
import clientPromise from "../../../lib/mongodb";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";

export const config = {
  api: { bodyParser: false },
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ ok: false });
  }

  try {
    /* ================= AUTH ================= */
    const session = await getServerSession(req, res, authOptions);
    if (!session?.user?.email) {
      return res.status(401).json({ ok: false });
    }

    /* ================= FORM ================= */
    const form = new formidable.IncomingForm({
      keepExtensions: true,
      multiples: false,
    });

    const uploadDir = path.join(process.cwd(), "public/uploads");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    form.parse(req, async (err, fields, files) => {
      if (err) {
        console.error("Form parse error:", err);
        return res.status(500).json({ ok: false, message: "Parse error" });
      }

      /* ===== FILE SAFE ACCESS ===== */
      let file = files.photo;
      if (Array.isArray(file)) file = file[0];

      if (!file || !file.filepath) {
        return res.status(400).json({ ok: false, message: "No file" });
      }

      const ext =
        path.extname(file.originalFilename || "") || ".jpg";

      const filename = `${Date.now()}-${Math.random()
        .toString(36)
        .slice(2)}${ext}`;

      const newPath = path.join(uploadDir, filename);

      fs.copyFileSync(file.filepath, newPath);

      /* ================= DB UPDATE ================= */
      const client = await clientPromise;
      const db = client.db();

      await db.collection("users").updateOne(
        { email: session.user.email },
        { $set: { image: `/uploads/${filename}` } }
      );

      /* ================= RESPONSE ================= */
      return res.status(200).json({
        ok: true,
        image: `/uploads/${filename}`,
      });
    });
  } catch (e) {
    console.error("Upload error:", e);
    return res.status(500).json({ ok: false });
  }
}
