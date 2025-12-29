// lib/hasPermission.js
export function hasPermission(user, permission) {
  if (!user) return false;
  if (user.role === "admin") return true;
  return user.role === "sub-admin" && user.permissions?.includes(permission);
}
