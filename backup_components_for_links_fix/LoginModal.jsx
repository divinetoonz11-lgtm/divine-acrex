import React, { useState, useEffect } from "react";

export default function LoginModal() {
  const [open, setOpen] = useState(false);
  const [screen, setScreen] = useState("choose"); // choose | userAuth | dealerAuth | adminAuth
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");

  useEffect(() => {
    const handler = () => setOpen(true);
    window.addEventListener("openLogin", handler);
    return () => window.removeEventListener("openLogin", handler);
  }, []);

  function close() {
    setOpen(false);
    setScreen("choose");
    setEmail(""); setPassword(""); setPhone(""); setOtp("");
  }

  function loginAsUser(e) {
    e?.preventDefault();
    // simple mock auth: store user and redirect
    const user = { role: "user", email };
    localStorage.setItem("da_user", JSON.stringify(user));
    window.location.href = "/user/dashboard";
  }

  function loginAsDealer(e) {
    e?.preventDefault();
    const dealer = { role: "dealer", email };
    localStorage.setItem("da_user", JSON.stringify(dealer));
    window.location.href = "/dealer/dashboard";
  }

  function adminRedirect() {
    // admin has separate page
    window.location.href = "/admin/login";
  }

  function sendOtp() {
    // mock: "send" otp (no backend)
    alert("OTP sent to " + phone + " (mock)");
  }

  function verifyOtp() {
    // mock verify
    if (otp.trim() !== "") {
      const user = { role: "user", phone };
      localStorage.setItem("da_user", JSON.stringify(user));
      window.location.href = "/user/dashboard";
    } else {
      alert("Enter OTP (demo)");
    }
  }

  if (!open) return null;

  return (
    <div style={styles.overlay} onClick={close}>
      <div style={styles.modal} onClick={(e)=>e.stopPropagation()}>
        <button onClick={close} style={styles.closeBtn}>✕</button>

        {screen === "choose" && (
          <div style={{textAlign:"center", paddingTop:6}}>
            <h2 style={styles.title}>Choose Login Type</h2>

            <button style={styles.mainBtn} onClick={() => setScreen("userAuth")}>User Login</button>
            <button style={styles.mainBtn} onClick={() => setScreen("dealerAuth")}>Dealer Login</button>
            <button style={styles.mainBtn} onClick={() => setScreen("adminAuth")}>Admin Login</button>
          </div>
        )}

        {screen === "userAuth" && (
          <div>
            <h2 style={styles.title}>User — Sign In / Sign Up</h2>

            {/* Google (mock) */}
            <button style={styles.googleBtn} onClick={()=>{
              // mock google login
              localStorage.setItem("da_user", JSON.stringify({role:"user", method:"google"}));
              window.location.href="/user/dashboard";
            }}>Continue with Google</button>

            <div style={{marginTop:12}}>— OR —</div>

            {/* Email form */}
            <form onSubmit={loginAsUser} style={{marginTop:12}}>
              <input value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="Email" style={styles.input}/>
              <input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} placeholder="Password" style={styles.input}/>
              <button style={styles.actionBtn} type="submit">Sign In / Sign Up</button>
            </form>

            <div style={{marginTop:12}}>— Or phone OTP —</div>
            <div style={{display:"flex", gap:8, marginTop:8}}>
              <input value={phone} onChange={(e)=>setPhone(e.target.value)} placeholder="Phone" style={{...styles.input, flex:1}}/>
              <button style={styles.otpBtn} onClick={sendOtp}>Send OTP</button>
            </div>
            <div style={{marginTop:8, display:"flex", gap:8}}>
              <input value={otp} onChange={(e)=>setOtp(e.target.value)} placeholder="Enter OTP" style={{...styles.input, flex:1}}/>
              <button style={styles.otpBtn} onClick={verifyOtp}>Verify</button>
            </div>

            <div style={{textAlign:"center", marginTop:10}}>
              <button style={styles.backBtn} onClick={()=>setScreen("choose")}>Back</button>
            </div>
          </div>
        )}

        {screen === "dealerAuth" && (
          <div>
            <h2 style={styles.title}>Dealer — Sign In / Sign Up</h2>
            <form onSubmit={loginAsDealer} style={{marginTop:8}}>
              <input value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="Dealer Email" style={styles.input}/>
              <input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} placeholder="Password" style={styles.input}/>
              <button style={styles.actionBtn} type="submit">Sign In / Sign Up (Dealer)</button>
            </form>
            <div style={{textAlign:"center", marginTop:10}}>
              <button style={styles.backBtn} onClick={()=>setScreen("choose")}>Back</button>
            </div>
          </div>
        )}

        {screen === "adminAuth" && (
          <div style={{textAlign:"center"}}>
            <h2 style={styles.title}>Admin Login</h2>
            <p>Admin login opens a separate secure page.</p>
            <button style={styles.actionBtn} onClick={adminRedirect}>Go to Admin Login</button>
            <div style={{marginTop:10}}>
              <button style={styles.backBtn} onClick={()=>setScreen("choose")}>Back</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999, pointerEvents: "auto"
  },
  modal: {
    width: 480, maxWidth: "95%", background: "#fff", padding: 22, borderRadius: 12, position: "relative", boxShadow: "0 12px 50px rgba(0,0,0,0.35)", zIndex:10000, pointerEvents:"auto"
  },
  closeBtn: { position:"absolute", top:10, right:10, border:0, background:"transparent", fontSize:18, cursor:"pointer" },
  title: { marginBottom:12, fontSize:20, fontWeight:600, textAlign:"center" },
  mainBtn: { width:"100%", padding:"12px 16px", margin:"8px 0", borderRadius:8, fontSize:16, background:"#1e3a8a", color:"#fff", border:"none", cursor:"pointer" },
  googleBtn: { width:"100%", padding:"10px", background:"#db4437", color:"#fff", border:"none", borderRadius:8, cursor:"pointer"},
  input: { width:"100%", padding:"10px 12px", borderRadius:8, border:"1px solid #ddd", marginTop:8 },
  actionBtn: { width:"100%", padding:"10px", marginTop:10, borderRadius:8, background:"#4f46e5", color:"#fff", border:"none", cursor:"pointer" },
  otpBtn: { padding:"10px 12px", borderRadius:8, background:"#1e3a8a", color:"#fff", border:"none", cursor:"pointer" },
  backBtn: { padding:"8px 12px", borderRadius:8, border:"1px solid #ccc", background:"#fff", cursor:"pointer", marginTop:6 }
};
