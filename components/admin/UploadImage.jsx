import { put } from "@vercel/blob";

/**
 * This API returns a signed upload URL
 * Frontend will upload file directly to Vercel Blob
 * MongoDB me sirf final image URL save hoga
 */

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, message: "Method not allowed" });
  }

  try {
    const { filename, contentType } = req.body;

    if (!filename || !contentType) {
      return res.status(400).json({
        ok: false,
        message: "filename and contentType required",
      });
    }

    // ✅ Generate signed upload URL (FREE)
    const blob = await put(
      `properties/${Date.now()}-${filename}`,
      null,
      {
        access: "public",
        contentType,
        addRandomSuffix: false,
      }
    );

    return res.status(200).json({
      ok: true,
      uploadUrl: blob.uploadUrl, // frontend PUT karega
      publicUrl: blob.url,       // 🔥 permanent image URL
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      ok: false,
      message: "Upload URL generation failed",
    });
  }
}
