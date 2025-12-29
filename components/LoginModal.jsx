import React, { useState, useEffect } from "react";
import { signIn } from "next-auth/react";

export default function LoginModal({ open, onClose }) {
  const [step, setStep] = useState("role"); // role | login | otp
  const [role, setRole] = useState("");
  const [agree, setAgree] = useState(false);

  // OTP
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [serverOtp, setServerOtp] = useState("");

  // USERNAME / PASSWORD
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // REFERRAL
  const [referralCode, setReferralCode] = useState("");

  // CAPTCHA
  const [num1, setNum1] = useState(0);
  const [num2, setNum2] = useState(0);
  const [captcha, setCaptcha] = useState("");

  function generateCaptcha() {
    const a = Math.floor(Math.random() * 9) + 1;
    const b = Math.floor(Math.random() * 9) + 1;
    setNum1(a);
    setNum2(b);
    setCaptcha("");
  }

  useEffect(() => {
    if (open) generateCaptcha();
    if (!open) {
      setStep("role");
      setRole("");
      setAgree(false);
      setPhone("");
      setOtp("");
      setServerOtp("");
      setUsername("");
      setPassword("");
      setReferralCode("");
      setCaptcha("");
    }
  }, [open]);

  if (!open) return null;

  const verifyCaptcha = () => {
    if (parseInt(captcha) !== num1 + num2) {
      alert("Captcha incorrect. Please try again.");
      generateCaptcha();
      return false;
    }
    return true;
  };

  /* ================= GOOGLE LOGIN ================= */
  const googleLogin = async () => {
    if (!verifyCaptcha()) return;
    if (!agree) return alert("Please accept Terms & Conditions");

    if (referralCode) {
      localStorage.setItem("referralCode", referralCode);
    }

    await signIn("google", {
      callbackUrl: "/auth/redirect",
    });
  };

  /* ================= USERNAME / PASSWORD LOGIN ================= */
  const passwordLogin = async () => {
    if (!verifyCaptcha()) return;
    if (!username || !password) return alert("Enter Username & Password");

    const res = await signIn("credentials", {
      username,
      password,
      referralCode,
      redirect: false,
    });

    if (!res?.ok) return alert("Invalid login");
    window.location.href = "/auth/redirect";
  };

  /* ================= OTP FLOW ================= */
  const sendOtp = async () => {
    if (!verifyCaptcha()) return;
    if (!agree) return alert("Please accept Terms & Conditions");
    if (phone.length !== 10) return alert("Invalid mobile number");

    const res = await fetch("/api/otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone, referralCode }),
    });

    const data = await res.json();
    if (!data.ok) return alert("OTP failed");

    setServerOtp(data.otp);
    setStep("otp");
  };

  const verifyOtp = async () => {
    if (!verifyCaptcha()) return;
    if (otp.length !== 6) return alert("Invalid OTP");

    const res = await signIn("credentials", {
      phone,
      otp,
      referralCode,
      redirect: false,
    });

    if (!res?.ok) return alert("Login failed");
    window.location.href = "/auth/redirect";
  };

  return (
    <div style={overlay} onClick={onClose}>
      <div style={box} onClick={(e) => e.stopPropagation()}>
        <button style={close} onClick={onClose}>✕</button>

        {/* ===== ROLE SELECT ===== */}
        {step === "role" && (
          <>
            <h2 style={title}>Select Account Type</h2>
            <button style={roleBtn} onClick={() => { setRole("user"); setStep("login"); generateCaptcha(); }}>
              Login as User
            </button>
            <button style={roleBtnAlt} onClick={() => { setRole("dealer"); setStep("login"); generateCaptcha(); }}>
              Login as Dealer
            </button>
          </>
        )}

        {/* ===== LOGIN ===== */}
        {step === "login" && (
          <>
            <h2 style={title}>{role === "dealer" ? "Dealer Login" : "User Login"}</h2>

            <button style={googleBtn} onClick={googleLogin}>
              Continue with Google
            </button>

            <div style={orLine}>OR</div>

            <input
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={input}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={input}
            />
            <button style={btn} onClick={passwordLogin}>
              Login with Password
            </button>

            <div style={orLine}>OR</div>

            <input
              placeholder="Mobile Number"
              value={phone}
              maxLength={10}
              onChange={(e) => setPhone(e.target.value.replace(/[^0-9]/g, ""))}
              style={input}
            />
            <button style={btnAlt} onClick={sendOtp}>
              Send OTP
            </button>

            <input
              placeholder="Referral Code (optional)"
              value={referralCode}
              onChange={(e) => setReferralCode(e.target.value)}
              style={input}
            />

            {/* CAPTCHA */}
            <div style={captchaBox}>
              <span>{num1} + {num2} =</span>
              <input
                value={captcha}
                onChange={(e) => setCaptcha(e.target.value.replace(/[^0-9]/g, ""))}
                placeholder="Answer"
                style={captchaInput}
              />
            </div>

            <label style={agreeBox}>
              <input
                type="checkbox"
                checked={agree}
                onChange={(e) => setAgree(e.target.checked)}
              />
              <span>I agree to <u>Terms & Conditions</u></span>
            </label>
          </>
        )}

        {/* ===== OTP VERIFY ===== */}
        {step === "otp" && (
          <>
            <h2 style={title}>Verify OTP</h2>
            <input
              placeholder="Enter OTP"
              value={otp}
              maxLength={6}
              onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ""))}
              style={inputOtp}
            />
            {serverOtp && <div style={otpBox}>OTP: {serverOtp}</div>}
            <button style={btn} onClick={verifyOtp}>
              Verify & Login
            </button>
          </>
        )}
      </div>
    </div>
  );
}

/* ================= MOBILE-FIRST STYLES ================= */

const overlay = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,.55)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 9999,
};

const box = {
  width: "92%",
  maxWidth: 420,
  maxHeight: "90vh",
  overflowY: "auto",
  background: "#fff",
  padding: 20,
  borderRadius: 14,
  position: "relative",
};

const close = {
  position: "absolute",
  top: 10,
  right: 12,
  background: "transparent",
  border: "none",
  fontSize: 22,
};

const title = {
  textAlign: "center",
  marginBottom: 16,
  fontWeight: 800,
};

const roleBtn = {
  width: "100%",
  padding: 14,
  borderRadius: 10,
  background: "#315DFF",
  color: "#fff",
  border: "none",
  marginBottom: 10,
};

const roleBtnAlt = {
  ...roleBtn,
  background: "#0A2E6F",
};

const googleBtn = {
  width: "100%",
  padding: 12,
  borderRadius: 8,
  border: "1px solid #ddd",
};

const orLine = {
  textAlign: "center",
  margin: "12px 0",
  color: "#777",
};

const input = {
  width: "100%",
  padding: 12,
  borderRadius: 8,
  border: "1px solid #ddd",
  marginBottom: 10,
};

const inputOtp = {
  ...input,
  textAlign: "center",
  letterSpacing: 6,
  fontSize: 18,
  fontWeight: 700,
};

const btn = {
  width: "100%",
  padding: 12,
  background: "#315DFF",
  color: "#fff",
  border: "none",
  borderRadius: 8,
};

const btnAlt = {
  ...btn,
  background: "#0A2E6F",
};

const agreeBox = {
  display: "flex",
  gap: 8,
  fontSize: 13,
  marginTop: 12,
};

const otpBox = {
  marginTop: 10,
  padding: 8,
  background: "#E8F0FF",
  borderRadius: 6,
  textAlign: "center",
  fontWeight: 800,
};

const captchaBox = {
  display: "flex",
  gap: 10,
  alignItems: "center",
  marginTop: 12,
};

const captchaInput = {
  width: 80,
  padding: 8,
  border: "1px solid #ddd",
  borderRadius: 6,
};
