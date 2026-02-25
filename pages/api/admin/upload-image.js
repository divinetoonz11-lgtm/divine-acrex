import { put } from "@vercel/blob";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      ok: false,
      message: "Method not allowed",
    });
  }

  try {
    const blob = await put(req, {
      access: "public",
    });

    return res.status(200).json({
      ok: true,
      url: blob.url, // ✅ permanent Vercel Blob URL
    });
  } catch (err) {
    console.error("UPLOAD ERROR:", err);
    return res.status(500).json({
      ok: false,
      message: err.message,
    });
  }
}
