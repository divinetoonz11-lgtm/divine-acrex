import { useState } from "react";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");

  function submit(e) {
    e.preventDefault();

    if (email === "admin@demo" && pw === "admin") {
      window.location.href = "/admin_panel";
    } else {
      alert("Use admin@demo / admin for demo");
    }
  }

  return (
    <div style={{ padding: 40 }}>
      <h1>Admin Login (Demo)</h1>

      <form onSubmit={submit}>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="email"
          style={{ display: "block", margin: "8px 0", padding: 10 }}
        />

        <input
          type="password"
          value={pw}
          onChange={(e) => setPw(e.target.value)}
          placeholder="password"
          style={{ display: "block", margin: "8px 0", padding: 10 }}
        />

        <button type="submit" style={{ padding: "10px 14px" }}>
          Login
        </button>
      </form>
    </div>
  );
}
