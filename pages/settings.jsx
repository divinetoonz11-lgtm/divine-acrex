// pages/settings.jsx
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function SettingsPage(){
  const router = useRouter();
  const [user, setUser] = useState({ email:"", phone:"", role:"user" });
  const [saving, setSaving] = useState(false);

  useEffect(()=>{
    try{
      const data = JSON.parse(localStorage.getItem("da_user") || "null");
      if(data) setUser({ email:data.email||"", phone:data.phone||"", role:data.role||"user" });
    }catch(e){}
  },[]);

  function save(){
    setSaving(true);
    setTimeout(()=>{
      const u = { ...user };
      localStorage.setItem("da_user", JSON.stringify(u));
      setSaving(false);
      alert("Profile saved (demo)");
    },600);
  }

  function changePassword(){
    alert("Change password flow requires backend. This is a demo placeholder.");
  }

  function logout(){
    localStorage.removeItem("da_user");
    router.push("/");
  }

  return (
    <div style={{ padding:28 }}>
      <h2>Account Settings</h2>

      <div style={{ maxWidth:680, marginTop:18 }}>
        <label style={{ display:"block", marginBottom:8, fontWeight:600 }}>Email</label>
        <input value={user.email} onChange={(e)=>setUser({...user,email:e.target.value})} style={inputStyle} />

        <label style={{ display:"block", marginTop:12, marginBottom:8, fontWeight:600 }}>Phone</label>
        <input value={user.phone} onChange={(e)=>setUser({...user,phone:e.target.value})} style={inputStyle} inputMode="tel" />

        <label style={{ display:"block", marginTop:12, marginBottom:8, fontWeight:600 }}>Role</label>
        <select value={user.role} onChange={(e)=>setUser({...user,role:e.target.value})} style={{ ...inputStyle, padding:10 }}>
          <option value="user">User</option>
          <option value="dealer">Dealer</option>
        </select>

        <div style={{ marginTop:16, display:"flex", gap:8 }}>
          <button onClick={save} style={btn}>{saving ? "Saving..." : "Save Profile"}</button>
          <button onClick={changePassword} style={{ ...btn, background:"#fff", border:"1px solid #e5e7eb", color:"#111" }}>Change Password</button>
          <button onClick={logout} style={{ ...btn, background:"#ef4444" }}>Logout</button>
        </div>
      </div>
    </div>
  );
}

const inputStyle = {
  width:"100%", padding:"10px 12px", borderRadius:8, border:"1px solid #e5e7eb", fontSize:14
};

const btn = {
  padding:"10px 12px", borderRadius:8, border:"none", background:"#4f46e5", color:"#fff", cursor:"pointer"
};
