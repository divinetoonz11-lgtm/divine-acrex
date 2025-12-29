import { getServerSession } from "next-auth/next";
import { authOptions } from "../pages/api/auth/[...nextauth]";

export default async function adminApiGuard(req, res) {
  try {
    const session = await getServerSession(req, res, authOptions);

    if (!session || session.user.role !== "admin") {
      res.status(401).json({ ok: false, message: "Unauthorized" });
      return false;
    }

    return true;
  } catch (e) {
    console.error("ADMIN API GUARD ERROR", e);
    res.status(500).json({ ok: false });
    return false;
  }
}
