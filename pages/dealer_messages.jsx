// pages/dealer_messages.jsx
import { useRouter } from "next/router";

export default function DealerMessages() {
  const router = useRouter();

  const chats = [
    { id: 1, name: "Rahul Mehra", last: "Thanks, will call you.", time: "3 min ago" },
    { id: 2, name: "Amrita Shah", last: "Please share pics", time: "1 hr ago" },
    { id: 3, name: "Sagar", last: "Interested in property", time: "Yesterday" },
  ];

  return (
    <div style={ST.page}>
      <h2 style={ST.h2}>Messages</h2>

      <div style={ST.list}>
        {chats.map((c) => (
          <div key={c.id} style={ST.card} onClick={() => router.push(`/dealer_chat?user=${c.name}`)}>
            <div style={ST.name}>{c.name}</div>
            <div style={ST.last}>{c.last}</div>
            <div style={ST.time}>{c.time}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

const ST = {
  page: { padding: 30, fontFamily: "Inter, sans-serif" },
  h2: { fontSize: 26, fontWeight: 800, marginBottom: 20 },
  list: { display: "grid", gap: 14 },
  card: {
    background: "#fff",
    padding: 18,
    borderRadius: 12,
    cursor: "pointer",
    boxShadow: "0 5px 18px rgba(0,0,0,0.05)",
  },
  name: { fontWeight: 700, fontSize: 18 },
  last: { marginTop: 4, color: "#475569" },
  time: { marginTop: 6, fontSize: 12, color: "#6b7280" },
};
