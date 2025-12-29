// utils/logAudit.js
import AuditLog from "../models/AuditLog";
import dbConnect from "./dbConnect";

export async function logAudit({ type, action, actor, target, meta }) {
  await dbConnect();
  await AuditLog.create({
    type,
    action,
    actor,
    target,
    meta,
  });
}
