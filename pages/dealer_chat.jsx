// pages/dealer_chat.jsx
import React, { useState } from "react";
import { useRouter } from "next/router";

export default function DealerChat() {
  const router = useRouter();
  const user = router.query.user || "User";

  const [messages, setMessages] = useState([
    { from: "user", text: "Hi, I'm interested in your property." },
    { from: "dealer", text: "Sure, please tell me your requirement." },
  ]);

  const [msg, setMsg] = useState("");

  function sendMessage() {
    if (!msg.trim()) return;
    setMessages([...messages, { from: "dealer", text: msg }]);
    setMsg("");
  }

  return (
    <div style={ST.page}>
      <div style={ST.header}>
        <div style={{ fontWeight: 800 }}>{user}</div>
        <button style={ST.back} onClick={() => router.back()}>Back</button>
      </div>

      <div style={ST.chatBox}>
        {messages.map((m, i) => (
          <div
            key={i}
            style={m.from === "dealer" ? ST.msgDealer : ST.msgUser}
          >
            {m.text}
          </div>
        ))}
      </div>

      <div style={ST.inputRow}>
        <input
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
          placeholder="Type a message..."
          style={ST.input}
        />
        <button onClick={sendMessage} style={ST.send}>Send</button>
      </div>
    </div>
  );
}

const ST = {
  page: { padding: 20, fontFamily: "Inter, sans-serif" },
  header: { display: "flex", justifyContent: "space-between", marginBottom: 16 },
  back: {
    padding: "6px 10px",
    background: "#e2e8f0",
    border: "none",
    borderRadius: 6,
    cursor: "pointer",
  },

  chatBox: {
    height: "70vh",
    overflowY: "auto",
    border: "1px solid #e5e7eb",
    borderRadius: 12,
    padding: 16,
    background: "#f8fafc",
  },

  msgDealer: {
    margin: "6px 0",
    padding: 10,
    background: "#0b6cff",
    color: "#fff",
    borderRadius: 12,
    marginLeft: "auto",
    maxWidth: "70%",
  },

  msgUser: {
    margin: "6px 0",
    padding: 10,
    background: "#e2e8f0",
    borderRadius: 12,
    marginRight: "auto",
    maxWidth: "70%",
  },

  inputRow: { marginTop: 12, display: "flex", gap: 10 },
  input: {
    flex: 1,
    padding: 10,
    borderRadius: 8,
    border: "1px solid #cbd5e1",
  },

  send: {
    padding: "10px 16px",
    background: "#0b6cff",
    border: "none",
    color: "#fff",
    borderRadius: 8,
    cursor: "pointer",
  },
};
