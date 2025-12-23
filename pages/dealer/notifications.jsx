import React from "react";

export default function DealerNotifications() {
  const notifications = [
    { id: 1, type: "lead", text: "New lead received for 3 BHK Andheri" },
    { id: 2, type: "referral", text: "Ravi joined using your referral code" },
    { id: 3, type: "plan", text: "Your subscription will expire in 3 days" },
    { id: 4, type: "payment", text: "₹1,200 referral earning credited" },
  ];

  return (
    <div style={wrap}>
      <h2>Notifications</h2>

      {notifications.length === 0 ? (
        <p>No notifications</p>
      ) : (
        notifications.map((n) => (
          <div key={n.id} style={card}>
            <span style={badge(n.type)}>{n.type.toUpperCase()}</span>
            <div style={{ marginTop: 6 }}>{n.text}</div>
          </div>
        ))
      )}
    </div>
  );
}

const wrap = { background: "#fff", padding: 24, borderRadius: 16 };
const card = {
  padding: 14,
  borderRadius: 12,
  border: "1px solid #e5e7eb",
  marginBottom: 12,
};
const badge = (t) => ({
  display: "inline-block",
  padding: "4px 10px",
  borderRadius: 20,
  fontSize: 12,
  fontWeight: 700,
  background:
    t === "lead"
      ? "#dbeafe"
      : t === "referral"
      ? "#dcfce7"
      : t === "payment"
      ? "#fef3c7"
      : "#fee2e2",
});
