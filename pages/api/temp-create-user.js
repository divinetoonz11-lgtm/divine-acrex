// pages/api/temp-create-user.js
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export default async function handler(req, res) {
  try {
    const u = await prisma.user.upsert({
      where: { email: "test@example.com" },
      update: {},
      create: {
        email: "test@example.com",
        role: "USER",
      },
    });
    return res.json({ ok: true, userId: u.id });
  } catch (e) {
    return res.json({ ok: false, e: String(e) });
  }
}
