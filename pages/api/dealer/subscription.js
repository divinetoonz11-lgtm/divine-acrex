// pages/api/dealer/subscription.js

/*
STEP 1 – FINAL
✔ One-time subscribe
✔ Redirect flag
✔ Welcome flag
✔ No auto-repeat
*/

let memorySubscription = {
  plan: null,              // FREE | STARTER | PRO | ELITE
  status: "NO_PLAN",       // NO_PLAN | PENDING | ACTIVE
  expiresAt: null,
};

export default function handler(req, res) {
  // ================= GET =================
  if (req.method === "GET") {
    return res.status(200).json({
      ok: true,
      subscription: memorySubscription,
    });
  }

  // ================= POST =================
  if (req.method === "POST") {
    const { plan } = req.body || {};

    if (!plan) {
      return res.status(400).json({
        ok: false,
        message: "Plan missing",
      });
    }

    // ❗ Already subscribed → block repeat
    if (memorySubscription.status !== "NO_PLAN") {
      return res.status(200).json({
        ok: true,
        message: "Already subscribed",
        redirect: "/dealer/dashboard",
      });
    }

    // ✅ First-time subscribe
    memorySubscription = {
      plan,
      status: "PENDING",
      expiresAt: plan === "FREE"
        ? new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString() // 3 months
        : null,
    };

    return res.status(200).json({
      ok: true,
      message: "Subscription received",
      redirect: "/dealer/dashboard",
      welcome: true,
    });
  }

  // ================= OTHER =================
  return res.status(405).json({
    ok: false,
    message: "Method not allowed",
  });
}
