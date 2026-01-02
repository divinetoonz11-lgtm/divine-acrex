export function addRecentlyViewed(property) {
  if (typeof window === "undefined") return;

  const key = "recently_viewed_props";
  const old = JSON.parse(localStorage.getItem(key) || "[]");

  const filtered = old.filter(p => p._id !== property._id);
  const updated = [property, ...filtered].slice(0, 15);

  localStorage.setItem(key, JSON.stringify(updated));
}
