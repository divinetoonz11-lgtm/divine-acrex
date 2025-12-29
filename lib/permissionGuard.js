// lib/permissionGuard.js
export function permissionGuard(session, permission) {
  if (!session || !session.user) return false;

  // MASTER ADMIN → full access
  if (session.user.role === "admin") return true;

  // SUB ADMIN → permission based
  if (
    session.user.role === "sub-admin" &&
    Array.isArray(session.user.permissions) &&
    session.user.permissions.includes(permission)
  ) {
    return true;
  }

  return false;
}
