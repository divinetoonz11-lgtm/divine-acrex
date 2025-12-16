import dynamic from "next/dynamic";
import React, { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/router";

/*
FINAL USER DASHBOARD
✔ Profile compulsory (first time only)
✔ After save → no repeat force
✔ Desktop UI unchanged
✔ Mobile sidebar ~30%
✔ USER ROLE GUARD
*/

function UserDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  /* ================= ROLE GUARD ================= */
  useEffect(() => {
    if (status === "loading") return;

    if (!session) {
      router.replace("/");
      return;
    }

    if (session.user.role !== "user") {
      router.replace("/dealer/dashboard");
    }
  }, [session, status]);

  const [tab, setTab] = useState("overview");
  const [loading, setLoading] = useState(true);
  const [profileDone, setProfileDone] = useState(true);

  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    photo: "",
    address: "",
    dob: "",
  });

  const [myListings, setMyListings] = useState([]);
  const [saved, setSaved] = useState([]);

  /* ---------- DUMMY DATA ---------- */
  const dummyListings = [
    {
      id: "d1",
      title: "Premium 2 BHK Apartment",
      price: "₹1.15 Cr",
      image: "/images/listing-example-1.png",
      status: "APPROVED",
    },
  ];

  const dummySaved = [
    {
      id: "s1",
      title: "Modern Studio Apartment",
      price: "₹78 Lacs",
      image: "/images/listing-example-2.png",
    },
  ];

  /* ---------- LOAD DATA ---------- */
  useEffect(() => {
    if (!session) return;

    (async () => {
      try {
        const pr = await fetch("/api/user/profile");
        const pj = pr.ok ? await pr.json() : {};

        setProfile({
          name: pj.name || session.user.name || "",
          email: pj.email || session.user.email || "",
          phone: pj.phone || "",
          photo: pj.photo || "",
          address: pj.address || "",
          dob: pj.dob || "",
        });

        setProfileDone(!!pj.profileCompleted);

        const lr = await fetch("/api/user/listings");
        const lj = lr.ok ? await lr.json() : [];
        setMyListings(lj?.length ? lj : dummyListings);

        const sr = await fetch("/api/user/saved");
        const sj = sr.ok ? await sr.json() : [];
        setSaved(sj?.length ? sj : dummySaved);
      } catch {
        setMyListings(dummyListings);
        setSaved(dummySaved);
        setProfileDone(false);
      }

      if (!profileDone) setTab("profile");
      setLoading(false);
    })();
  }, [session]);

  function safeTab(t) {
    if (!profileDone && t !== "profile") {
      alert("Please complete your profile first");
      setTab("profile");
      return;
    }
    setTab(t);
  }

  if (status === "loading" || loading) {
    return <div style={{ padding: 40 }}>Loading…</div>;
  }

  return (
    <div className="wrap">
      {/* ================= SIDEBAR ================= */}
      <aside className="sidebar">
        <label className="avatar">
          <img src={profile.photo || "/images/avatar.png"} />
          <input
            type="file"
            hidden
            accept="image/*"
            onChange={(e) => {
              const f = e.target.files[0];
              if (!f) return;
              const r = new FileReader();
              r.onload = () => setProfile({ ...profile, photo: r.result });
              r.readAsDataURL(f);
            }}
          />
        </label>

        <div className="name">{profile.name || "User"}</div>
        <div className="email">{profile.email}</div>

        <Nav a={tab==="overview"} onClick={()=>safeTab("overview")}>Overview</Nav>
        <Nav a={tab==="free"} onClick={()=>safeTab("free")}>Free Listing</Nav>
        <Nav a={tab==="status"} onClick={()=>safeTab("status")}>My Property Status</Nav>
        <Nav a={tab==="saved"} onClick={()=>safeTab("saved")}>Saved Properties</Nav>
        <Nav a={tab==="profile"} onClick={()=>safeTab("profile")}>Profile</Nav>

        <button className="logout" onClick={() => signOut({ callbackUrl:"/" })}>
          Logout
        </button>
      </aside>

      {/* ================= MAIN ================= */}
      <main className="main">
        {tab === "overview" && (
          <div className="grid">
            <Box t="My Listings" v={myListings.length} />
            <Box t="Saved Properties" v={saved.length} />
          </div>
        )}

        {tab === "free" && (
          <div>
            <h2>Free Listing</h2>
            <p>Admin approval ke baad property live hogi.</p>
            <a href="/post-property">
              <button className="cta">Add Free Listing</button>
            </a>
          </div>
        )}

        {tab === "status" && (
          <div className="list">
            {myListings.map(p => (
              <Card key={p.id} title={p.title} price={p.price} image={p.image} badge={p.status} />
            ))}
          </div>
        )}

        {tab === "saved" && (
          <div className="list">
            {saved.map(p => (
              <Card key={p.id} title={p.title} price={p.price} image={p.image} />
            ))}
          </div>
        )}

        {tab === "profile" && (
          <Profile
            profile={profile}
            setProfile={setProfile}
            onDone={() => setProfileDone(true)}
          />
        )}
      </main>

      {/* ================= STYLES ================= */}
      <style jsx>{`
        .wrap{display:flex;min-height:100vh;background:#f1f5fb}
        .sidebar{width:260px;background:#0a2a5e;color:#fff;padding:18px}
        .avatar img{width:72px;height:72px;border-radius:50%;border:2px solid #1e4ed8}
        .name{margin-top:8px;font-weight:600}
        .email{font-size:12px;opacity:.8;margin-bottom:12px}
        .main{flex:1;padding:20px}
        .grid{display:flex;gap:16px;flex-wrap:wrap}
        .list{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:14px}
        .cta{padding:12px 16px;background:#1e4ed8;color:#fff;border:none;border-radius:8px}
        .logout{margin-top:16px;width:100%;padding:10px;background:#ef4444;border:none;border-radius:8px;color:#fff}

        @media(max-width:768px){
          .sidebar{width:30vw;min-width:100px;max-width:140px}
          .name,.email{display:none}
          .avatar img{width:48px;height:48px}
        }
      `}</style>
    </div>
  );
}

/* ================= COMPONENTS ================= */

const Nav = ({a, children, onClick}) => (
  <div onClick={onClick} className={a?"nav active":"nav"}>
    {children}
    <style jsx>{`
      .nav{padding:10px;border-radius:8px;cursor:pointer;margin-bottom:4px}
      .active{background:rgba(255,255,255,.18)}
    `}</style>
  </div>
);

const Box = ({t,v}) => (
  <div style={{background:"#fff",padding:16,borderRadius:10,minWidth:160}}>
    <div style={{fontSize:13,color:"#64748b"}}>{t}</div>
    <div style={{fontSize:22,fontWeight:700}}>{v}</div>
  </div>
);

const Card = ({title,price,image,badge}) => (
  <div className="card">
    <img src={image}/>
    <div>
      <b>{title}</b>
      <div className="price">{price}</div>
      {badge && <span className="badge">{badge}</span>}
    </div>
    <style jsx>{`
      .card{background:#fff;border-radius:10px;padding:10px;display:flex;gap:10px}
      img{width:120px;height:90px;border-radius:8px;object-fit:cover}
      .price{color:#1e4ed8;font-weight:700}
      .badge{font-size:12px;padding:2px 6px;border-radius:6px;background:#e5edff}
    `}</style>
  </div>
);

/* ================= PROFILE (LIGHT NAVY BLUE) ================= */

function Profile({ profile, setProfile, onDone }) {
  const [f, setF] = useState(profile);
  useEffect(()=>setF(profile),[profile]);

  async function save(){
    await fetch("/api/user/profile",{
      method:"PUT",
      headers:{ "content-type":"application/json" },
      body:JSON.stringify({ ...f, profileCompleted:true })
    });
    onDone();
    alert("Profile saved");
  }

  return (
    <div style={wrapBox}>
      <h3 style={{color:"#0a2a5e"}}>Complete Your Profile</h3>

      <input style={inp} placeholder="Full Name" value={f.name}
        onChange={e=>setF({...f,name:e.target.value})}/>

      <input style={{...inp,background:"#e8eefc"}} value={f.email} disabled/>

      <input style={inp} placeholder="Mobile Number" value={f.phone}
        onChange={e=>setF({...f,phone:e.target.value})}/>

      <textarea style={{...inp,height:80}} placeholder="Address"
        value={f.address} onChange={e=>setF({...f,address:e.target.value})}/>

      <label style={{fontSize:13,color:"#334155"}}>Date of Birth</label>
      <input type="date" style={inp} value={f.dob}
        onChange={e=>setF({...f,dob:e.target.value})}/>

      <button style={btn} onClick={save}>Save Profile</button>
    </div>
  );
}

const wrapBox = {
  maxWidth:460,
  background:"#f0f5ff",
  padding:20,
  borderRadius:14,
  boxShadow:"0 10px 30px rgba(30,78,216,.15)"
};

const inp = {
  width:"100%",
  padding:"12px 14px",
  marginBottom:12,
  borderRadius:10,
  border:"1px solid #c7d2fe",
  fontSize:14
};

const btn = {
  width:"100%",
  padding:14,
  background:"linear-gradient(135deg,#1e4ed8,#2563eb)",
  color:"#fff",
  border:"none",
  borderRadius:12,
  fontWeight:800,
  cursor:"pointer"
};

export default dynamic(() => Promise.resolve(UserDashboard), { ssr:false });
