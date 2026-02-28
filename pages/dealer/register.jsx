import { useState } from "react";
import { useRouter } from "next/router";
import DealerRegistrationForm from "../../components/DealerRegistrationForm";

export default function DealerRegister() {
  const router = useRouter();
  const [submitted, setSubmitted] = useState(false);

  /* ================= SUCCESS SCREEN ================= */

  if (submitted) {
    return (
      <div style={wrap}>
        <h2 style={title}>✅ Dealer Application Submitted</h2>

        <div style={noteBox}>
          ⏳ <b>Verification & admin approval</b> takes 24–48 business hours.
          <br /><br />
          📧 Status update will be sent to your registered email.
          <br /><br />
          🔐 After approval, you will receive email to set your password.
          <br /><br />
          📞 Support:
          <br />
          📧 divinetoonz11@gmail.com
          <br />
          📱 9867402515
        </div>

        <button style={btn} onClick={() => router.replace("/")}>
          Go to Home
        </button>
      </div>
    );
  }

  /* ================= MAIN FORM ================= */

  return (
    <div style={wrap}>
      <h2 style={title}>Become a Dealer</h2>
      <p style={sub}>India & UAE onboarding</p>

      <div style={noteBox}>
        <b>Important:</b><br /><br />
        1️⃣ This is a dealer request form. Submission does not guarantee approval.<br /><br />
        2️⃣ Admin verification takes 24–48 working hours.<br /><br />
        3️⃣ Username & password will be created only after approval.
      </div>

      <DealerRegistrationForm
        onSuccess={() => setSubmitted(true)}
      />
    </div>
  );
}

/* ================= STYLES (SAME UI UX) ================= */

const wrap = {
  maxWidth: 760,
  margin: "auto",
  padding: 24,
  background: "#f8fbff",
};

const title = {
  textAlign: "center",
  fontWeight: 900,
};

const sub = {
  textAlign: "center",
  fontSize: 13,
};

const noteBox = {
  padding: 14,
  background: "#eef2ff",
  borderRadius: 14,
  fontSize: 13,
  marginBottom: 18,
};

const btn = {
  padding: 14,
  borderRadius: 14,
  background: "#2563eb",
  color: "#fff",
  fontWeight: 800,
  border: "none",
};