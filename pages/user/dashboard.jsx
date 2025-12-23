import dynamic from "next/dynamic";
import React, { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/router";

function UserDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  /* ===== ROLE GUARD ===== */
  useEffect(() => {
    if (status !== "authenticated") return;
    if (session?.user?.role === "dealer") {
      router.replace("/dealer/dashboard");
    }
  }, [status, session]);

  const [tab, setTab] = useState("overview");
  const [loading, setLoading] = useState(true);

  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    dob: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    profileCompleted: false,
  });

  const [myListings, setMyListings] = useState([]);
  const [saved, setSaved] = useState([]);
  const [referral, setReferral] = useState({ code: "" });

  /* ===== LOAD DATA ===== */
  useEffect(() => {
    if (status !== "authenticated") return;

    (async () => {
      try {
        const pr = await fetch("/api/user/profile");
        const pj = pr.ok ? await pr.json() : {};
        setProfile({
          name: pj.name || session.user.name || "",
          email: pj.email || session.user.email || "",
          phone: pj.phone || "",
          dob: pj.dob || "",
          address: pj.address || "",
          city: pj.city || "",
          state: pj.state || "",
          pincode: pj.pincode || "",
          profileCompleted: !!pj.profileCompleted,
        });

        const lr = await fetch("/api/user/listings");
        const ljson = lr.ok ? await lr.json() : [];
        setMyListings(Array.isArray(ljson) ? ljson : ljson.listings || []);

        const sr = await fetch("/api/user/saved");
        const sjson = sr.ok ? await sr.json() : [];
        setSaved(Array.isArray(sjson) ? sjson : sjson.saved || []);

        const rr = await fetch("/api/user/referral");
        const rj = rr.ok ? await rr.json() : {};
        setReferral({ code: rj.referralCode || "" });
      } catch {}
      setLoading(false);
    })();
  }, [status, session]);

  /* ===== ACTIONS ===== */
  async function saveProfile() {
    if (!profile.phone || profile.phone.length !== 10)
      return alert("Mobile number is required");

    await fetch("/api/user/profile", {
      method: "PUT",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ ...profile, profileCompleted: true }),
    });

    alert("Profile saved successfully");
    setProfile(p => ({ ...p, profileCompleted: true }));
  }

  function editProperty(id) {
    router.push(`/post-property?edit=${id}`);
  }

  async function deleteProperty(id) {
    if (!confirm("Delete this property?")) return;
    await fetch(`/api/user/listings?id=${id}`, { method: "DELETE" });
    setMyListings(prev => prev.filter(p => p._id !== id));
  }

  if (loading) return <div style={{ padding: 40 }}>Loading…</div>;

  return (
    <div className="wrap">
      {/* ===== SIDEBAR ===== */}
      <aside className="sidebar">
        <div className="name">{profile.name || "User"}</div>
        <div className="email">{profile.email}</div>

        <Nav a={tab==="overview"} onClick={()=>setTab("overview")}>Overview</Nav>
        <Nav a={tab==="free"} onClick={()=>setTab("free")}>Free Listing</Nav>
        <Nav a={tab==="status"} onClick={()=>setTab("status")}>My Properties</Nav>
        <Nav a={tab==="saved"} onClick={()=>setTab("saved")}>Saved Properties</Nav>
        <Nav a={tab==="profile"} onClick={()=>setTab("profile")}>Profile</Nav>

        <button className="logout" onClick={() => signOut({ callbackUrl:"/" })}>
          Logout
        </button>
      </aside>

      {/* ===== MAIN ===== */}
      <main className="main">

        {/* ===== OVERVIEW ===== */}
        {tab==="overview" && (
          <>
            <h2>Dashboard Overview</h2>

            <div className="overviewGrid">

              <div className="ovCard">
                <div className="ovTitle">My Properties</div>
                <div className="ovValue">{myListings.length}</div>
                <div className="ovDesc">
                  {myListings.length === 0
                    ? "You haven’t listed any property yet"
                    : "Properties you have posted"}
                </div>
                {myListings.length === 0 && (
                  <button className="ovBtn" onClick={()=>setTab("free")}>
                    Add your first property
                  </button>
                )}
              </div>

              <div className="ovCard">
                <div className="ovTitle">Saved Properties</div>
                <div className="ovValue">{saved.length}</div>
                <div className="ovDesc">
                  {saved.length === 0
                    ? "You haven’t saved any property yet"
                    : "Properties you liked & saved"}
                </div>
              </div>

              <div className="ovCard">
                <div className="ovTitle">Profile Status</div>
                <div className={`ovStatus ${profile.profileCompleted ? "done":"pending"}`}>
                  {profile.profileCompleted ? "Completed" : "Action Required"}
                </div>
                <div className="ovDesc">
                  {profile.profileCompleted
                    ? "Your profile is complete"
                    : "Complete your profile to post properties"}
                </div>
                {!profile.profileCompleted && (
                  <button className="ovBtn" onClick={()=>setTab("profile")}>
                    Complete Profile
                  </button>
                )}
              </div>

            </div>

            <div className="refBox">
              <div className="refHead">Earn with Referrals</div>
              {referral.code ? (
                <>
                  <div className="refCode">{referral.code}</div>
                  <div className="refMeta">
                    Share this code with friends and earn rewards when they join.
                  </div>
                </>
              ) : (
                <>
                  <div className="refEmpty">Invite friends & start earning</div>
                  <div className="refMeta">
                    Refer people to Divine Acres and unlock future benefits.
                  </div>
                </>
              )}
            </div>
          </>
        )}

        {/* ===== FREE LISTING ===== */}
        {tab==="free" && (
          <div>
            <h2>Free Listing</h2>
            <button onClick={()=>router.push("/post-property")}>
              Add Free Property
            </button>
          </div>
        )}

        {/* ===== MY PROPERTIES ===== */}
        {tab==="status" && (
          <div>
            <h2>My Properties</h2>
            {myListings.length === 0 ? (
              <p>No properties listed yet.</p>
            ) : (
              <div className="grid">
                {myListings.map(p => (
                  <PropertyCard
                    key={p._id}
                    p={p}
                    showActions
                    onEdit={editProperty}
                    onDelete={deleteProperty}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* ===== SAVED ===== */}
        {tab==="saved" && (
          <div>
            <h2>Saved Properties</h2>
            {saved.length === 0 ? (
              <p>No saved properties yet.</p>
            ) : (
              <div className="grid">
                {saved.map(p => (
                  <PropertyCard key={p._id} p={p} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* ===== PROFILE ===== */}
        {tab==="profile" && (
          <div className="profileBox">
            <h2>My Profile</h2>

            <input value={profile.name} placeholder="Full Name"
              onChange={e=>setProfile({...profile,name:e.target.value})}/>
            <input value={profile.email} disabled />
            <input value={profile.phone} placeholder="Mobile"
              maxLength={10}
              onChange={e=>setProfile({...profile,phone:e.target.value.replace(/[^0-9]/g,"")})}/>
            <input value={profile.dob} placeholder="Date of Birth"
              onChange={e=>setProfile({...profile,dob:e.target.value})}/>
            <textarea value={profile.address} placeholder="Address"
              onChange={e=>setProfile({...profile,address:e.target.value})}/>
            <input value={profile.city} placeholder="City"
              onChange={e=>setProfile({...profile,city:e.target.value})}/>
            <input value={profile.state} placeholder="State"
              onChange={e=>setProfile({...profile,state:e.target.value})}/>
            <input value={profile.pincode} placeholder="Pincode"
              maxLength={6}
              onChange={e=>setProfile({...profile,pincode:e.target.value.replace(/[^0-9]/g,"")})}/>

            <button onClick={saveProfile}>Save Profile</button>
          </div>
        )}

      </main>

      <style jsx>{`
        .wrap{display:flex;min-height:100vh;background:#f1f5fb}
        .sidebar{width:260px;background:#0a2a5e;color:#fff;padding:18px}
        .name{font-weight:600}
        .email{font-size:12px;opacity:.8;margin-bottom:12px}
        .main{flex:1;padding:20px}
        .logout{margin-top:16px;width:100%;padding:10px;background:#ef4444;border:none;border-radius:8px;color:#fff}

        .overviewGrid{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:16px;margin-bottom:20px}
        .ovCard{background:#fff;padding:18px;border-radius:14px;box-shadow:0 10px 24px rgba(30,64,175,.12)}
        .ovTitle{font-size:13px;color:#64748b}
        .ovValue{font-size:26px;font-weight:700;color:#1e40af;margin-top:6px}
        .ovDesc{font-size:13px;color:#475569;margin-top:4px}
        .ovBtn{margin-top:10px;padding:8px 12px;background:#e0e7ff;color:#1e40af;border:none;border-radius:8px;font-size:13px;cursor:pointer}
        .ovStatus{font-size:18px;font-weight:700;margin-top:6px}
        .ovStatus.done{color:#16a34a}
        .ovStatus.pending{color:#dc2626}

        .refBox{background:#eef2ff;padding:20px;border-radius:16px}
        .refHead{font-size:16px;font-weight:700;color:#1e3a8a}
        .refCode{font-size:22px;font-weight:800;color:#1e40af;margin-top:6px}
        .refEmpty{font-size:18px;font-weight:700;color:#1e40af;margin-top:6px}
        .refMeta{font-size:13px;color:#475569;margin-top:4px}

        .grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:14px}
        .profileBox{max-width:520px;background:#fff;padding:20px;border-radius:14px}
        input,textarea{width:100%;margin-bottom:10px;padding:10px;border-radius:8px;border:1px solid #c7d2fe}
        button{padding:12px 16px;background:#1e4ed8;color:#fff;border:none;border-radius:8px}
      `}</style>
    </div>
  );
}

const Nav = ({a, children, onClick}) => (
  <div onClick={onClick}
    style={{padding:10,cursor:"pointer",borderRadius:8,background:a?"rgba(255,255,255,.18)":""}}>
    {children}
  </div>
);

function PropertyCard({ p, showActions, onEdit, onDelete }) {
  return (
    <div className="card">
      <img src={p.image || "/images/no-photo.png"} />
      <div>
        <b>{p.title}</b>
        <div>{p.price}</div>
        {p.status && <div>{p.status}</div>}
        {showActions && (
          <div style={{marginTop:6}}>
            <button onClick={()=>onEdit(p._id)}>Edit</button>{" "}
            <button onClick={()=>onDelete(p._id)}>Delete</button>
          </div>
        )}
      </div>
      <style jsx>{`
        .card{background:#fff;border-radius:10px;padding:10px;display:flex;gap:10px}
        img{width:120px;height:90px;border-radius:8px;object-fit:cover}
      `}</style>
    </div>
  );
}

export default dynamic(() => Promise.resolve(UserDashboard), { ssr:false });
