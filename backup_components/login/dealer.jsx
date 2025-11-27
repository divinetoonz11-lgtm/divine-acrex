import { useRouter } from "next/router";
import { useState } from "react";
import {
  auth,
  signInWithGooglePopup,
  signInWithEmail,
  sendOtpToPhone,
  makeRecaptcha
} from "../../utils/firebaseClient";

export default function DealerLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");

  // phone OTP
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  // Email Login
  const emailLogin = async (e) => {
    e.preventDefault();
    if (!email || !pass) return alert("Enter email & password");
    try {
      setLoading(true);
      const res = await signInWithEmail(email, pass);
      localStorage.setItem("logged_in", "yes");
      localStorage.setItem("role", "dealer");
      localStorage.setItem("dealer_email", res.user.email);
      router.push("/dashboard/dealer");
    } catch (err) {
      alert("Login failed: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Google Login
  const googleLogin = async () => {
    try {
      setLoading(true);
      const res = await signInWithGooglePopup();
      localStorage.setItem("logged_in", "yes");
      localStorage.setItem("role", "dealer");
      localStorage.setItem("dealer_email", res.user.email);
      router.push("/dashboard/dealer");
    } catch {
      alert("Google login failed");
    } finally {
      setLoading(false);
    }
  };

  // Send OTP
  const sendOtp = async () => {
    if (!phone) return alert("Enter phone like +91xxxxxxxxxx");
    try {
      setLoading(true);
      makeRecaptcha("recaptcha-container-dealer");
      const result = await sendOtpToPhone(phone, "recaptcha-container-dealer");
      window.__dealerOtp = result;
      setSent(true);
      alert("OTP sent");
    } catch (err) {
      alert("Failed: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Verify OTP
  const verifyOtp = async () => {
    try {
      setLoading(true);
      const res = await window.__dealerOtp.confirm(otp);
      localStorage.setItem("logged_in", "yes");
      localStorage.setItem("role", "dealer");
      localStorage.setItem("dealer_phone", res.user.phoneNumber);
      router.push("/dashboard/dealer");
    } catch (err) {
      alert("OTP wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={box}>
      <h2 style={title}>Dealer Login</h2>

      <div style={{ display:"grid", gap: 14 }}>
        
        {/* Email Login */}
        <form onSubmit={emailLogin}>
          <input style={input} placeholder="Email" value={email} onChange={(e)=>setEmail(e.target.value)} />
          <input style={input} placeholder="Password" type="password" value={pass} onChange={(e)=>setPass(e.target.value)} />
          <button style={btn} disabled={loading}>Login with Email</button>
        </form>

        <div style={{textAlign:"center"}}>— OR —</div>

        {/* Google */}
        <button style={{...btn,background:"#de5246"}} onClick={googleLogin} disabled={loading}>
          Login with Google
        </button>

        <div style={{textAlign:"center"}}>— OR Phone OTP —</div>

        {/* Phone OTP */}
        {!sent ? (
          <>
            <input style={input} placeholder="+919876543210" value={phone} onChange={(e)=>setPhone(e.target.value)} />
            <div id="recaptcha-container-dealer"></div>
            <button style={btn} onClick={sendOtp} disabled={loading}>Send OTP</button>
          </>
        ) : (
          <>
            <input style={input} placeholder="Enter OTP" value={otp} onChange={(e)=>setOtp(e.target.value)} />
            <button style={btn} onClick={verifyOtp} disabled={loading}>Verify OTP</button>
          </>
        )}

      </div>
    </div>
  );
}

const box = { maxWidth:460, margin:"40px auto", padding:18, background:"#fff", borderRadius:8, boxShadow:"0 6px 20px rgba(0,0,0,0.08)" };
const title = { fontSize:26, fontWeight:700, marginBottom:12 };
const input = { width:"100%", padding:12, border:"1px solid #ddd", borderRadius:8, marginBottom:12 };
const btn = { width:"100%", padding:14, background:"#6b21a8", color:"#fff", border:"none", borderRadius:8, cursor:"pointer" };
