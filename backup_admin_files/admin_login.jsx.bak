import { useState } from "react";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");

  function submit(e) {
    e.preventDefault();

    if (email === "divinetoonz11@gmail.com" && pw === "Tanvi@2910") {
      localStorage.setItem("admin_ok", "true"); // IMPORTANT FIX
      window.location.href = "/admin_dashboard";
    } else {
      alert("Wrong admin email or password");
    }
  }

  return (
    <div style={{ padding: 40 }}>
      <h1>Admin Login</h1>

      <form onSubmit={submit}>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Admin Email"
          style={{ display: "block", margin: "8px 0", padding: 10 }}
        />

        <input
          type="password"
          value={pw}
          onChange={(e) => setPw(e.target.value)}
          placeholder="Admin Password"
          style={{ display: "block", margin: "8px 0", padding: 10 }}
        />

        <button type="submit" style={{ padding: "10px 14px" }}>
          Login
        </button>
      </form>
    </div>
  );
}
