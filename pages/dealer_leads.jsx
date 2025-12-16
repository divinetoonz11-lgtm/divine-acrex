// pages/dealer_leads.jsx
import React, { useEffect, useState } from "react";
import { auth } from "../utils/firebaseClient";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/router";

export default function DealerLeads() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    onAuthStateChanged(auth, (u) => {
      if (!u) return router.push("/login/dealer");
      const saved = localStorage.getItem("dealerProfile");
      setProfile(saved ? JSON.parse(saved) : null);
      setChecking(false);
    });
  }, []);

  if (checking) return <div style={{ padding: 40 }}>Loading Leads…</div>;

  const leads = [
    { id: 1, name: "Rahul Mehra", mobile: "9876543210", property: "2 BHK Noida", time: "Today 4:30 PM" },
    { id: 2, name: "Amrita Shah", mobile: "9898989898", property: "3 BHK Gnxt", time: "Yesterday" },
    { id: 3, name: "Sagar", mobile: "9988776655", property: "1 BHK Indirapuram", time: "2 Days Ago" },
  ];

  return (
    <div style={ST.page}>
      <h2 style={ST.h2}>Leads</h2>

      <div style={ST.list}>
        {leads.map((l) => (
          <div key={l.id} style={ST.card}>
            <div style={{ fontSize: 18, fontWeight: 700 }}>{l.name}</div>
            <div style={ST.sub}>{l.mobile}</div>
            <div style={ST.prop}>Property: {l.property}</div>
            <div style={ST.time}>{l.time}</div>

            <button style={ST.msgBtn} onClick={() => router.push(`/dealer_chat?user=${l.name}`)}>
              Message
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

const ST = {
  page: { padding: 30, fontFamily: "Inter, sans-serif" },
  h2: { fontSize: 26, fontWeight: 800, marginBottom: 20 },
  list: { display: "grid", gap: 16 },
  card: {
    background: "#fff",
    padding: 20,
    borderRadius: 12,
    boxShadow: "0 6px 20px rgba(0,0,0,0.05)",
  },
  sub: { color: "#475569", marginTop: 4 },
  prop: { marginTop: 8, fontWeight: 600 },
  time: { color: "#64748b", marginTop: 4 },
  msgBtn: {
    marginTop: 14,
    padding: "10px 14px",
    background: "#0b6cff",
    color: "#fff",
    border: "none",
    borderRadius: 8,
    cursor: "pointer",
    fontWeight: 600,
  },
};
