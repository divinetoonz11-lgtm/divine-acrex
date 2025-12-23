import React, { useEffect, useState } from "react";
import { signOut, useSession } from "next-auth/react";

/* ===== EXISTING PAGES ===== */
import DealerInsights from "./insights";
import DealerLeads from "./leads";
import DealerReferral from "./referral";
import DealerProfile from "./profile";
import DealerSubscription from "./subscription";
import DealerNotifications from "./notifications";
import DealerMyProperties from "./my-properties";
import BillingInvoices from "./billing-invoices";

export default function DealerDashboard() {
  const { data: session } = useSession();
  const [tab, setTab] = useState("overview");
  const [propertyTab, setPropertyTab] = useState("post");

  /* ===== REFERRAL ===== */
  const [referralCode, setReferralCode] = useState("");

  /* ===== PROFILE STATUS ===== */
  const profileCompleted = !!session?.user?.name && !!session?.user?.email;

  useEffect(() => {
    fetch("/api/dealer/referral")
      .then(r => r.json())
      .then(j => {
        if (j?.ok && j?.summary?.referralCode) {
          setReferralCode(j.summary.referralCode);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <div style={wrap}>
      {/* ================= SIDEBAR ================= */}
      <aside style={sidebar}>
        <div style={profileBlock}>
          <img
            src={session?.user?.image || "/images/avatar.png"}
            alt="Profile"
            style={avatar}
            onClick={() => setTab("profile")}
          />
          <div style={profileName}>{session?.user?.name || "Dealer"}</div>
          <div style={profileEmail}>{session?.user?.email || ""}</div>
        </div>

        <Nav label="Dashboard" active={tab==="overview"} onClick={()=>setTab("overview")} />
        <Nav label="Insights" active={tab==="insights"} onClick={()=>setTab("insights")} />
        <Nav label="Properties" active={tab==="properties"} onClick={()=>setTab("properties")} />
        <Nav label="Leads" active={tab==="leads"} onClick={()=>setTab("leads")} />
        <Nav label="Referral & Rewards" active={tab==="referral"} onClick={()=>setTab("referral")} />
        <Nav label="Subscription" active={tab==="subscription"} onClick={()=>setTab("subscription")} />
        <Nav label="Billing & Invoices" active={tab==="payments"} onClick={()=>setTab("payments")} />
        <Nav label="Notifications" active={tab==="notifications"} onClick={()=>setTab("notifications")} />
        <Nav label="Profile" active={tab==="profile"} onClick={()=>setTab("profile")} />

        <button style={logout} onClick={() => signOut({ callbackUrl: "/" })}>
          Logout
        </button>
      </aside>

      {/* ================= MAIN ================= */}
      <main style={main}>
        {tab === "overview" && (
          <>
            {/* ===== REFERRAL ===== */}
            <div style={referralCard}>
              <div style={refLabel}>Your Referral Code</div>
              <div style={refCode}>{referralCode || "—"}</div>

              {referralCode && (
                <a
                  href={`https://wa.me/?text=${encodeURIComponent(
                    `Join Divine Acres using my referral code ${referralCode}`
                  )}`}
                  target="_blank"
                >
                  <button style={whatsappBtn}>Share on WhatsApp</button>
                </a>
              )}
            </div>

            {/* ===== 8 CLICKABLE OVERVIEW BOXES ===== */}
            <div style={grid}>
              <DashCard title="Total Properties" desc="Listed by you"
                action={{ label:"View", onClick:()=>setTab("properties") }} />

              <DashCard title="Active Leads" desc="Buyer enquiries"
                action={{ label:"Open", onClick:()=>setTab("leads") }} />

              <DashCard title="Profile Status"
                value={profileCompleted ? "Completed" : "Pending"}
                desc="Dealer profile"
                status={profileCompleted}
                action={{ label:"Edit", onClick:()=>setTab("profile") }} />

              <DashCard title="Post Property" value="+"
                desc="Add new listing"
                action={{ label:"Post", onClick:()=>setTab("properties") }} />

              <DashCard title="My Properties" desc="Manage listings"
                action={{ label:"Open", onClick:()=>setTab("properties") }} />

              <DashCard title="Subscription" desc="Your plan"
                action={{ label:"View", onClick:()=>setTab("subscription") }} />

              <DashCard title="Referral & Rewards" desc="Invite & earn"
                action={{ label:"Open", onClick:()=>setTab("referral") }} />

              <DashCard title="Notifications" desc="Latest updates"
                action={{ label:"View", onClick:()=>setTab("notifications") }} />
            </div>
          </>
        )}

        {tab === "insights" && <DealerInsights />}
        {tab === "properties" && (
          <>
            <div style={subTabs}>
              <SubTab label="Post Property" active={propertyTab==="post"} onClick={()=>setPropertyTab("post")} />
              <SubTab label="My Properties" active={propertyTab==="my"} onClick={()=>setPropertyTab("my")} />
            </div>

            {propertyTab === "post" && (
              <a href="/post-property">
                <button style={goBtn}>Open Post Property Form</button>
              </a>
            )}
            {propertyTab === "my" && <DealerMyProperties />}
          </>
        )}

        {tab === "leads" && <DealerLeads />}
        {tab === "referral" && <DealerReferral />}
        {tab === "subscription" && <DealerSubscription />}
        {tab === "payments" && <BillingInvoices />}
        {tab === "notifications" && <DealerNotifications />}
        {tab === "profile" && <DealerProfile />}
      </main>
    </div>
  );
}

/* ================= COMPONENTS ================= */

const Nav = ({ label, active, onClick }) => (
  <div onClick={onClick} style={{
    padding:"10px 14px", marginBottom:6, borderRadius:10, cursor:"pointer",
    background: active ? "#1e40af" : "transparent",
    color: active ? "#fff" : "#c7d2fe", fontWeight:700
  }}>{label}</div>
);

const SubTab = ({ label, active, onClick }) => (
  <button onClick={onClick} style={{
    padding:"8px 16px", borderRadius:20, border:"none",
    fontWeight:700, cursor:"pointer",
    background: active ? "#1e40af" : "#e5edff",
    color: active ? "#fff" : "#1e3a8a"
  }}>{label}</button>
);

const DashCard = ({ title, value="—", desc, status, action }) => (
  <div style={{
    background:"#fff",
    padding:16,
    minHeight:110,
    borderRadius:14,
    boxShadow:"0 6px 18px rgba(0,0,0,0.08)",
    display:"flex",
    flexDirection:"column",
    justifyContent:"space-between"
  }}>
    <div>
      <div style={{ fontSize:12, color:"#475569", fontWeight:700 }}>{title}</div>
      <div style={{
        marginTop:6,
        fontSize:22,
        fontWeight:900,
        color: status === false ? "#dc2626" : "#1e3a8a"
      }}>{value}</div>
      <div style={{ marginTop:4, fontSize:12, color:"#64748b" }}>{desc}</div>
    </div>

    {action && (
      <button onClick={action.onClick} style={{
        marginTop:8,
        padding:"6px 10px",
        fontSize:12,
        borderRadius:8,
        border:"none",
        background:"#e0e7ff",
        color:"#1e40af",
        fontWeight:700,
        cursor:"pointer"
      }}>{action.label}</button>
    )}
  </div>
);

/* ================= STYLES ================= */

const wrap = { display:"flex", height:"100vh", background:"#f1f5fb" };
const sidebar = { width:240, background:"#0a2a5e", color:"#fff", padding:16, overflowY:"auto" };
const main = { flex:1, padding:20, overflowY:"auto" };

const profileBlock = { display:"flex", flexDirection:"column", alignItems:"center", marginBottom:20 };
const avatar = { width:56, height:56, borderRadius:"50%", border:"2px solid #2563eb", cursor:"pointer" };
const profileName = { marginTop:8, fontWeight:800, fontSize:14 };
const profileEmail = { fontSize:12, opacity:.8, textAlign:"center", wordBreak:"break-all" };
const logout = { marginTop:20, width:"100%", padding:10, background:"#ef4444", color:"#fff", border:"none", borderRadius:10, fontWeight:700 };

const referralCard = { background:"#eef2ff", padding:18, borderRadius:16, marginBottom:20 };
const refLabel = { fontSize:13, color:"#475569" };
const refCode = { fontSize:22, fontWeight:900, marginTop:4 };
const whatsappBtn = { marginTop:10, padding:"8px 14px", background:"#22c55e", color:"#fff", border:"none", borderRadius:10, fontWeight:800 };

const grid = { display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))", gap:14 };
const subTabs = { display:"flex", gap:10, marginBottom:20 };
const goBtn = { padding:"14px 18px", background:"#1e40af", color:"#fff", border:"none", borderRadius:12, fontWeight:800 };
