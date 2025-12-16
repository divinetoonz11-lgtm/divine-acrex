// pages/api/admin/properties.js
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";

const prisma = new PrismaClient();

/* 🔐 ADMIN EMAIL WHITELIST */
const ADMIN_EMAILS = [
  "inder.ambalika@gmail.com",
  "divinetoonz11@gmail.com",
];

export default async function handler(req, res) {
  try {
    /* ================= ADMIN GUARD ================= */
    const session = await getServerSession(req, res, authOptions);
    if (
      !session ||
      !ADMIN_EMAILS.includes(session.user?.email)
    ) {
      return res.status(403).json({ ok: false, message: "Forbidden" });
    }

    const { method } = req;

    /* ================= GET → ALL PROPERTIES ================= */
    if (method === "GET") {
      const data = await prisma.listing.findMany({
        where: { isDeleted: false },
        orderBy: { createdAt: "desc" },
      });

      return res.status(200).json({ ok: true, data });
    }

    /* ================= POST → APPROVE / REJECT ================= */
    if (method === "POST") {
      const { id, action } = req.body;

      if (!id || !action) {
        return res.status(400).json({ ok: false, message: "Invalid request" });
      }

      const status =
        action === "APPROVE"
          ? "APPROVED"
          : action === "REJECT"
          ? "REJECTED"
          : null;

      if (!status) {
        return res.status(400).json({ ok: false, message: "Invalid action" });
      }

      const updated = await prisma.listing.update({
        where: { id },
        data: { status },
      });

      return res.status(200).json({ ok: true, data: updated });
    }

    return res.status(405).json({ ok: false, message: "Method not allowed" });
  } catch (e) {
    console.error("ADMIN PROPERTIES ERROR:", e);
    return res.status(500).json({ ok: false, message: "Server error" });
  }
}
