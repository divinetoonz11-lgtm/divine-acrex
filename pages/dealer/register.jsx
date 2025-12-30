import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

/* ================= LOCATION DATA ================= */

// INDIA STATES (ALL)
const STATES = {
  India: [
    "Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh",
    "Goa","Gujarat","Haryana","Himachal Pradesh","Jharkhand",
    "Karnataka","Kerala","Madhya Pradesh","Maharashtra","Manipur",
    "Meghalaya","Mizoram","Nagaland","Odisha","Punjab",
    "Rajasthan","Sikkim","Tamil Nadu","Telangana","Tripura",
    "Uttar Pradesh","Uttarakhand","West Bengal",
    "Delhi","Jammu and Kashmir","Ladakh","Puducherry",
    "Chandigarh","Dadra and Nagar Haveli","Daman and Diu",
    "Andaman and Nicobar Islands","Lakshadweep"
  ],
  UAE: [
    "Abu Dhabi","Dubai","Sharjah","Ajman","Ras Al Khaimah",
    "Fujairah","Umm Al Quwain"
  ],
};

// MAJOR CITIES (FILTER-BASED)
const CITIES = {
  Delhi: ["New Delhi"],
  Maharashtra: ["Mumbai","Pune","Nagpur","Nashik"],
  Uttar Pradesh: ["Noida","Greater Noida","Lucknow","Kanpur","Agra","Varanasi"],
  Haryana: ["Gurgaon","Faridabad","Panipat"],
  Karnataka: ["Bengaluru","Mysuru","Hubli"],
  Tamil Nadu: ["Chennai","Coimbatore","Madurai"],
  Telangana: ["Hyderabad","Warangal"],
  Gujarat: ["Ahmedabad","Surat","Vadodara","Rajkot"],
  Rajasthan: ["Jaipur","Udaipur","Jodhpur"],
  Punjab: ["Ludhiana","Amritsar","Jalandhar"],
  West Bengal: ["Kolkata","Howrah","Durgapur"],
  Kerala: ["Kochi","Trivandrum","Kozhikode"],
  Madhya Pradesh: ["Indore","Bhopal","Gwalior"],
  Bihar: ["Patna","Gaya"],
  Odisha: ["Bhubaneswar","Cuttack"],
  Assam: ["Guwahati","Dibrugarh"],

  Dubai: ["Dubai"],
  "Abu Dhabi": ["Abu Dhabi","Al Ain"],
  Sharjah: ["Sharjah"],
  Ajman: ["Ajman"],
  "Ras Al Khaimah": ["RAK"],
  Fujairah: ["Fujairah"],
  "Umm Al Quwain": ["Umm Al Quwain"],
};

export default function DealerRegister() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    country: "India",
    state: "",
    city: "",
    countryCode: "+91",
    mobile: "",
    company: "",
    dealerType: "",
    experience: "",
    referralCode: "",
    idProofType: "",
    addressProofType: "",
    agreed: false,
  });

  const [documentFile, setDocumentFile] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  if (status !== "authenticated") return null;

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.agreed) return alert("Please accept Terms & Conditions");

    const fd = new FormData();
    fd.append("email", session.user.email);
    Object.keys(form).forEach((k) => fd.append(k, form[k]));
    if (documentFile) fd.append("document", documentFile);

    await fetch("/api/dealer/request", { method: "POST", body: fd });
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div style={wrap}>
        <h2 style={title}>✅ Dealer Application Submitted</h2>
        <div style={noteBox}>
          ⏳ Verification takes <b>24–48 hours</b><br />
          📧 Update will be sent on registered email
        </div>
        <button style={btn} onClick={() => router.replace("/user/dashboard")}>
          Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div style={wrap}>
      <h2 style={title}>Become a Dealer</h2>
      <p style={sub}>India & UAE onboarding</p>

      <p style={browserNote}>
        Best experience ke liye Chrome, Edge ya Firefox browser use karein.
      </p>

      <form onSubmit={handleSubmit} style={formBox}>
        <input name="name" placeholder="Full Name" required onChange={handleChange} style={input} />
        <input value={session.user.email} disabled style={input} />

        <select name="country" value={form.country} onChange={handleChange} style={input}>
          <option value="India">India</option>
          <option value="UAE">United Arab Emirates</option>
        </select>

        <select name="state" value={form.state} onChange={handleChange} required style={input}>
          <option value="">Select State</option>
          {STATES[form.country].map((s) => <option key={s}>{s}</option>)}
        </select>

        <select name="city" value={form.city} onChange={handleChange} required style={input}>
          <option value="">Select City</option>
          {(CITIES[form.state] || ["Other"]).map((c) => <option key={c}>{c}</option>)}
        </select>

        <input name="mobile" placeholder="Mobile Number" required onChange={handleChange} style={input} />
        <input name="company" placeholder="Company / Firm" required onChange={handleChange} style={input} />

        <label style={agree}>
          <input type="checkbox" name="agreed" onChange={handleChange} /> I agree to Terms
        </label>

        <button type="submit" style={btn}>Submit Application</button>
      </form>
    </div>
  );
}

/* ================= STYLES ================= */

const wrap = { maxWidth: 760, margin: "auto", padding: 24 };
const title = { textAlign: "center", fontWeight: 900 };
const sub = { textAlign: "center", fontSize: 13 };
const formBox = { display: "flex", flexDirection: "column", gap: 12 };
const input = { padding: 12, borderRadius: 10, border: "1px solid #c7d2fe" };
const btn = { padding: 14, background: "#2563eb", color: "#fff", borderRadius: 12 };
const agree = { fontSize: 13 };
const noteBox = { padding: 14, background: "#eef2ff", borderRadius: 12 };
const browserNote = {
  background: "#fff7ed",
  color: "#9a3412",
  padding: 8,
  textAlign: "center",
  borderRadius: 8,
  fontSize: 13,
  marginBottom: 12,
};
