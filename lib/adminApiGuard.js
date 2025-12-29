// lib/adminApiGuard.js
import { getServerSession } from "next-auth/next";
import { authOptions } from "./authOptions";

export async function adminApiGuard(req, res) {
  const session = await getServerSession(req, res, authOptions);

  if (!session || session.user.role !== "admin") {
    res.status(403).json({ error: "Admin access required" });
    return null;
  }

  return session;
}
