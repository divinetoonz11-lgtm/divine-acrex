import React, { useState, useEffect } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/router";

export default function LoginModal({ open, onClose }) {
  const router = useRouter();

  const [step, setStep] = useState("role"); // role | form | otp
  const [role, setRole] = useState(null);   // user | dealer
  const [agree, setAgree] = useState(false);

  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");

  /* ================= REFERRAL CAPTURE ================= */
  useEffect(() => {
    if (router.query.ref) {
      localStorage.setItem("da_referral_code", router.query.ref);
    }
  }, [router.query.ref]);

  useEffect(() => {
    if (!open) {
      setStep("role");
      setRole(null);
      setAgree(false);
      setPhone("");
      setOtp("");
    }
  }, [open]);

  if (!open) return null;

  /* ================= ROLE SELECT ================= */
  const selectRole = (r) => {
    setRole(r);
    localStorage.setItem("da_login_role", r);
    setStep("form");
  };

  /* ================= GOOGLE LOGIN ================= */
  const googleLogin = async () => {
    if (!agree) return alert("Accept Terms & Conditions");

    await signIn("google", {
      callbackUrl: "/auth/redirect",
      state: JSON.stringify({
        role: localStorage.getItem("da_login_role"),
        ref: localStorage.getItem("da_referral_code"),
      }),
    });
  };

  /* ================= SEND OTP ================= */
  const sendOtp = async () => {
    if (!agree) return alert("Accept Terms & Conditions");
    if (phone.length !== 10) return alert("Enter valid phone number");

    const res = await fetch("/api/otp/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        phone,
        role: localStorage.getItem("da_login_role"),
        referralCode: localStorage.getItem("da_referral_code"),
      }),
    });

    const data = await res.json();
    if (!data.ok) return alert(data.message || "OTP failed");

    alert("Demo OTP sent: 123456");
    setStep("otp");
  };

  /* ================= VERIFY OTP + LOGIN ================= */
  const verifyOtp = async () => {
    if (otp.length !== 6) return alert("Invalid OTP");

    const res = await fetch("/api/otp/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        phone,
        otp,
        referralCode: localStorage.getItem("da_referral_code"),
      }),
    });

    const data = await res.json();
    if (!data.ok) return alert("OTP invalid");

    const login = await signIn("credentials", {
      phone,
      role: localStorage.getItem("da_login_role"),
      referralCode: localStorage.getItem("da_referral_code"),
      redirect: false,
    });

    if (login?.ok) {
      window.location.href = "/auth/redirect";
    } else {
      alert("Phone login failed");
    }
  };

  return (
    <div style={overlay} onClick={onClose}>
      <div style={box} onClick={(e) => e.stopPropagation()}>
        <button style={close} onClick={onClose}>✕</button>

        {step === "role" && (
          <>
            <h2 style={title}>Select Account Type</h2>
            <button style={roleBtn} onClick={() => selectRole("user")}>
              Login as User
            </button>
            <button style={roleBtnAlt} onClick={() => selectRole("dealer")}>
              Login as Dealer
            </button>
          </>
        )}

        {step === "form" && (
          <>
            <h2 style={title}>
              {role === "dealer" ? "Dealer Login" : "User Login"}
            </h2>

            <button style={googleBtn} onClick={googleLogin}>
              <img
                src="https://developers.google.com/identity/images/g-logo.png"
                alt="google"
                style={{ width: 18, height: 18 }}
              />
              <span>Continue with Google</span>
            </button>

            <div style={orLine}>OR</div>

            <input
              placeholder="Mobile Number"
              value={phone}
              maxLength={10}
              onChange={(e) =>
                setPhone(e.target.value.replace(/[^0-9]/g, ""))
              }
              style={input}
            />

            <button style={btn} onClick={sendOtp}>Send OTP</button>

            <label style={agreeBox}>
              <input
                type="checkbox"
                checked={agree}
                onChange={(e) => setAgree(e.target.checked)}
              />
              <span>I agree to Terms & Conditions</span>
            </label>
          </>
        )}

        {step === "otp" && (
          <>
            <h2 style={title}>Verify OTP</h2>

            <input
              placeholder="Enter 6-digit OTP"
              value={otp}
              maxLength={6}
              onChange={(e) =>
                setOtp(e.target.value.replace(/[^0-9]/g, ""))
              }
              style={inputOtp}
            />

            <button style={btn} onClick={verifyOtp}>
              Verify & Login
            </button>

            <p style={demoNote}>
              Demo OTP: <b>123456</b>
            </p>
          </>
        )}
      </div>
    </div>
  );
}

/* ================= STYLES (unchanged) ================= */
const overlay = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.55)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 9999,
};
const box = { width: 420, maxWidth: "95%", background: "#fff", padding: 24, borderRadius: 14, position: "relative" };
const close = { position: "absolute", top: 10, right: 12, border: "none", background: "transparent", fontSize: 22, cursor: "pointer" };
const title = { textAlign: "center", marginBottom: 18, fontWeight: 800 };
const roleBtn = { width: "100%", padding: 14, marginTop: 12, borderRadius: 10, border: "none", background: "#315DFF", color: "#fff", fontSize: 16, fontWeight: 700 };
const roleBtnAlt = { ...roleBtn, background: "#0A2E6F" };
const googleBtn = { width: "100%", padding: 12, display: "flex", alignItems: "center", justifyContent: "center", gap: 10, background: "#fff", border: "1px solid #ddd", borderRadius: 8, fontWeight: 700 };
const orLine = { textAlign: "center", margin: "14px 0", fontWeight: 600, color: "#777" };
const input = { width: "100%", padding: 12, borderRadius: 8, border: "1px solid #ddd", marginBottom: 10 };
const inputOtp = { ...input, textAlign: "center", letterSpacing: 6, fontSize: 18, fontWeight: 700 };
const btn = { width: "100%", padding: 12, background: "#315DFF", color: "#fff", border: "none", borderRadius: 8, fontWeight: 700 };
const agreeBox = { display: "flex", gap: 8, fontSize: 13, marginTop: 12 };
const demoNote = { textAlign: "center", fontSize: 12, marginTop: 10, color: "#666" };
