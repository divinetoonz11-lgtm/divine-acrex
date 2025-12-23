import { useState } from "react";
import { signIn } from "next-auth/react";

export default function MobileLogin() {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState("phone"); // phone | otp
  const [loading, setLoading] = useState(false);

  /* ================= SEND OTP ================= */
  async function sendOTP() {
    if (phone.length !== 10) {
      alert("Enter valid 10 digit mobile number");
      return;
    }

    setLoading(true);

    const res = await fetch("/api/otp", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ phone }),
    });

    setLoading(false);

    if (res.ok) {
      setStep("otp");
    } else {
      alert("Unable to send OTP");
    }
  }

  /* ================= VERIFY OTP ================= */
  async function verifyOTP() {
    if (otp.length !== 6) {
      alert("Enter valid OTP");
      return;
    }

    setLoading(true);

    await signIn("credentials", {
      phone,
      otp,
      callbackUrl: "/user/dashboard",
    });

    setLoading(false);
  }

  return (
    <div style={wrap}>
      <div style={box}>
        <h2 style={{ fontWeight: 900 }}>
          Mobile Login
        </h2>

        {step === "phone" && (
          <>
            <input
              placeholder="Mobile Number"
              value={phone}
              maxLength={10}
              onChange={(e) =>
                setPhone(e.target.value.replace(/[^0-9]/g, ""))
              }
              style={inp}
            />

            <button onClick={sendOTP} style={btn} disabled={loading}>
              {loading ? "Sending OTP..." : "Send OTP"}
            </button>
          </>
        )}

        {step === "otp" && (
          <>
            <input
              placeholder="Enter OTP"
              value={otp}
              maxLength={6}
              onChange={(e) =>
                setOtp(e.target.value.replace(/[^0-9]/g, ""))
              }
              style={inp}
            />

            <button onClick={verifyOTP} style={btn} disabled={loading}>
              {loading ? "Verifying..." : "Verify OTP"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}

/* ===== STYLES ===== */

const wrap = {
  minHeight: "100vh",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background: "#f1f5fb",
};

const box = {
  width: 360,
  background: "#fff",
  padding: 28,
  borderRadius: 16,
  boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
  textAlign: "center",
};

const inp = {
  width: "100%",
  padding: "12px",
  marginBottom: 12,
  borderRadius: 8,
  border: "1px solid #d0d7ff",
  fontSize: 15,
};

const btn = {
  width: "100%",
  padding: 14,
  borderRadius: 10,
  background: "#1e4ed8",
  color: "#fff",
  border: "none",
  fontWeight: 800,
  cursor: "pointer",
};
