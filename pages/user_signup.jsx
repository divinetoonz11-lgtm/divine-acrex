// pages/user_signup.jsx
import { useState } from "react";
import { useRouter } from "next/router";

export default function UserSignup() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  function submit(e) {
    e.preventDefault();

    const user = {
      role: "user",
      name,
      email,
      phone,
    };

    localStorage.setItem("da_user", JSON.stringify(user));
    localStorage.setItem("user_name", name);
    localStorage.setItem("user_email", email);
    localStorage.setItem("user_phone", phone);

    alert("Account created successfully!");
    router.push("/user_dashboard");
  }

  return (
    <div style={ST.page}>
      <div style={ST.card}>
        <h2 style={ST.title}>Create Your Account</h2>

        <form onSubmit={submit}>
          <input
            style={ST.input}
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <input
            style={ST.input}
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            required
          />

          <input
            style={ST.input}
            placeholder="Mobile Number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />

          <button style={ST.btn} type="submit">
            Create Account
          </button>
        </form>

        <div style={{ marginTop: 14, textAlign: "center" }}>
          Already have an account?{" "}
          <a href="#" onClick={() => router.push("/")} style={{ color: "#2563eb" }}>
            Login
          </a>
        </div>
      </div>
    </div>
  );
}

const ST = {
  page: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#eef2ff",
    padding: 20,
  },
  card: {
    width: 360,
    padding: 28,
    background: "#fff",
    borderRadius: 14,
    boxShadow: "0 8px 30px rgba(0,0,0,0.08)",
  },
  title: {
    fontSize: 24,
    fontWeight: 800,
    marginBottom: 20,
    textAlign: "center",
    color: "#1e3a8a",
  },
  input: {
    width: "100%",
    padding: "12px 14px",
    margin: "8px 0",
    borderRadius: 8,
    border: "1px solid #d0d7ff",
    fontSize: 15,
  },
  btn: {
    width: "100%",
    padding: "12px",
    marginTop: 10,
    background: "#2563eb",
    color: "#fff",
    borderRadius: 8,
    border: "none",
    cursor: "pointer",
    fontSize: 16,
    fontWeight: 700,
  },
};
