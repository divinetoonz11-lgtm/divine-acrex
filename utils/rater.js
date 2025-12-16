// utils/rater.js
const store = new Map();

// limit: max requests allowed
// window: time window (ms)
export function rateLimit(identifier, limit = 20, window = 10_000) {
  const now = Date.now();

  if (!store.has(identifier)) {
    store.set(identifier, { count: 1, expires: now + window });
    return { allowed: true };
  }

  const data = store.get(identifier);

  // window expired → reset
  if (now > data.expires) {
    store.set(identifier, { count: 1, expires: now + window });
    return { allowed: true };
  }

  // within window
  if (data.count >= limit) {
    return { allowed: false, retryAfter: data.expires - now };
  }

  data.count++;
  store.set(identifier, data);
  return { allowed: true };
}
