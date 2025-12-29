import { getServerSession } from "next-auth/next";
import { authOptions } from "../pages/api/auth/[...nextauth]";

/*
ADMIN API GUARD – FINAL
✔ Uses NextAuth only
✔ Role based (admin)
✔ No hooks (server-safe)
*/

export default async function adminGuard(req, res) {
  const session = await getServerSession(req, res, authOptions);

  if (!session || session.user?.role !== "admin") {
    res.status(403).json({
      ok: false,
      message: "Admin access only",
    });
    return false;
  }

  return session;
}
