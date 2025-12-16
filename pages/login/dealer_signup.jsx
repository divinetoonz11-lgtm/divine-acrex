// pages/dealer_signup.jsx
import { useState } from "react";
import { useRouter } from "next/router";

export default function DealerSignup() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  function submit(e) {
    e.preventDefault();

    const dealer = {
      role: "dealer",
      name,
      company,
      email,
      phone,
    };

    localStorage.setItem("da_user", JSON.stringify(dealer));
    localStorage.setItem("dealer_name", name);
    localStorage.setItem("dealer_company", company);
    localStorage.setItem("dealer_email", email);
    localStorage.setItem("dealer_phone", phone);

    alert("Dealer account created!");
    router.push("/dashboard/dealer");
  }

  return (
    <div style={ST.page}>
      <div style={ST.card}>
        <h2 style={ST.title}>Dealer Registration</h2>

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
            placeholder="Company / Builder Name"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            required
          />

          <input
            style={ST.input}
            placeholder="Dealer Email"
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
            Create Dealer Account
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
    background: "#e0e7ff",
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
    border: "1px solid #cbd5e1",
    fontSize: 15,
  },
  btn: {
    width: "100%",
    padding: "12px",
    marginTop: 10,
    background: "#0f766e",
    color: "#fff",
    borderRadius: 8,
    border: "none",
    cursor: "pointer",
    fontSize: 16,
    fontWeight: 700,
  },
};
