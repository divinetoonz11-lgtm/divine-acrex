import { getSession } from "next-auth/react";

const parseList = (s = "") => s.split(",").map(x => x.trim()).filter(Boolean);

const getAllowedOrigins = () => parseList(process.env.ALLOWED_ADMIN_ORIGINS || "");
const getAllowedEmails  = () => parseList(process.env.ADMIN_ALLOWED_EMAILS || "");

export default async function adminGuard(req, res) {
  try {
    // ------- ORIGIN / CORS CHECK -------
    const origin = req.headers?.origin || "";
    const allowedOrigins = getAllowedOrigins();

    if (origin) {
      const norm = origin.replace(/\/+$/, "");
      // allow common localhost variants
      const isLocal = norm.startsWith("http://localhost") || norm.startsWith("http://127.0.0.1");
      const originAllowed = isLocal || allowedOrigins.includes(norm) || allowedOrigins.includes(origin);
      if (!originAllowed) {
        res.status(403).json({ error: "Forbidden: origin not allowed" });
        return false;
      }
    }
    // if no origin (server-side) -> allow

    // ------- ADMIN KEY CHECK (extra layer) -------
    const adminKey = req.headers["x-admin-key"] || req.headers["admin-key"] || req.query?.adminKey;
    if (!adminKey || adminKey !== process.env.ADMIN_API_KEY) {
      res.status(401).json({ error: "Unauthorized: invalid admin key" });
      return false;
    }

    // ------- NEXTAUTH SESSION & EMAIL CHECK -------
    const session = await getSession({ req });
    const userEmail = session?.user?.email || "";

    const allowedEmails = getAllowedEmails();
    if (allowedEmails.length > 0) {
      if (!userEmail) {
        res.status(401).json({ error: "Unauthorized: login required" });
        return false;
      }
      if (!allowedEmails.includes(userEmail)) {
        res.status(403).json({ error: "Forbidden: admin email not allowed" });
        return false;
      }
    }

    // all good
    return true;
  } catch (err) {
    console.error("adminGuard error:", err);
    res.status(500).json({ error: "Server error (adminGuard)" });
    return false;
  }
}
