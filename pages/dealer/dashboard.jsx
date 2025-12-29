import React, { useEffect, useState } from "react";
import { signOut, useSession } from "next-auth/react";

/* ===== EXISTING PAGES (NO CHANGE) ===== */
import DealerInsights from "./insights";
import DealerLeads from "./leads";
import DealerReferral from "./referral";
import DealerProfile from "./profile";
import DealerSubscription from "./subscription";
import DealerNotifications from "./notifications";
import DealerMyProperties from "./my-properties";
import BillingInvoices from "./billing-invoices";

export default function DealerDashboard() {
  const { data: session, status } = useSession();

  const [tab, setTab] = useState("overview");
  const [propertyTab, setPropertyTab] = useState("post");
  const [dashboard, setDashboard] = useState(null);
  const [referralCode, setReferralCode] = useState("");
  const [mobileMenu, setMobileMenu] = useState(false);

  const isMobile =
    typeof window !== "undefined" && window.innerWidth < 900;

  /* ===== LOAD DASHBOARD ===== */
  useEffect(() => {
    if (!session?.user?.email) return;
    fetch("/api/dealer/dashboard")
      .then(r => r.json())
      .then(d => d?.ok && setDashboard(d));
  }, [session?.user?.email]);

  /* ===== LOAD REFERRAL ===== */
  useEffect(() => {
    if (!session?.user?.email) return;
    fetch("/api/dealer/referral")
      .then(r => r.json())
      .then(d => setReferralCode(d?.summary?.referralCode || ""));
  }, [session?.user?.email]);

  if (status === "loading") return null;

  if (!session?.user || session.user.role !== "dealer") {
    if (typeof window !== "undefined") window.location.replace("/");
    return null;
  }

  return (
    <div style={wrap}>
      {/* ================= SIDEBAR ================= */}
      {!isMobile && (
        <aside style={sidebar}>
          <Profile session={session} onClick={() => setTab("profile")} />

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
      )}

      {/* ================= MAIN ================= */}
      <main style={main}>
        {/* MOBILE TOP */}
        {isMobile && (
          <div style={mobileTop}>
            <b>Dealer Dashboard</b>
            <button style={dotsBtn} onClick={()=>setMobileMenu(true)}>☰</button>
          </div>
        )}

        {/* ================= OVERVIEW ================= */}
        {tab === "overview" && (
          <>
            {/* ===== PAGE TITLE ===== */}
            <h2 style={pageTitle}>Dashboard</h2>

            {/* ===== KPI GRID (6 = 3x2) ===== */}
            <div style={kpiGrid}>
              <Kpi title="Total Listings" value={dashboard?.totalListings||0} onClick={()=>setTab("properties")} />
              <Kpi title="Active Listings" value={dashboard?.activeListings||0} onClick={()=>setTab("properties")} />
              <Kpi title="Total Leads" value={dashboard?.totalLeads||0} onClick={()=>setTab("leads")} />
              <Kpi title="Active Leads" value={dashboard?.activeLeads||0} onClick={()=>setTab("leads")} />
              <Kpi title="Subscription" value={dashboard?.subscription?.plan || "—"} onClick={()=>setTab("subscription")} />
              <Kpi title="Profile Status" value={dashboard?.profileCompleted?"Completed":"Pending"} onClick={()=>setTab("profile")} />
            </div>

            {/* ===== REFERRAL ===== */}
            <ReferralBox code={referralCode} />

            {/* ===== GRAPHS (DESKTOP ONLY) ===== */}
            {!isMobile && (
              <div style={graphGrid}>
                <Graph title="Listings Performance" data={dashboard?.performance || [2,4,3,5]} />
                <Graph title="Leads Conversion" data={dashboard?.leadConversion || [1,3,4,2]} />
                <Graph title="Referral Growth" data={dashboard?.referral?.monthly || [0,1,2,3]} />
              </div>
            )}
          </>
        )}

        {tab==="insights" && <DealerInsights />}
        {tab==="leads" && <DealerLeads />}
        {tab==="referral" && <DealerReferral />}
        {tab==="subscription" && <DealerSubscription />}
        {tab==="payments" && <BillingInvoices />}
        {tab==="notifications" && <DealerNotifications />}
        {tab==="profile" && <DealerProfile />}

        {/* ===== PROPERTIES ===== */}
        {tab==="properties" && (
          <>
            <div style={subTabs}>
              <SubTab label="Post Property" active={propertyTab==="post"} onClick={()=>setPropertyTab("post")} />
              <SubTab label="My Properties" active={propertyTab==="my"} onClick={()=>setPropertyTab("my")} />
            </div>
            {propertyTab==="post" && <a href="/post-property"><button style={postBtn}>Open Post Property</button></a>}
            {propertyTab==="my" && <DealerMyProperties />}
          </>
        )}
      </main>

      {/* ================= MOBILE MENU ================= */}
      {isMobile && mobileMenu && (
        <div style={mobileOverlay} onClick={()=>setMobileMenu(false)}>
          <div style={mobileMenuBox} onClick={e=>e.stopPropagation()}>
            <MobileItem onClick={()=>setTab("overview")}>Dashboard</MobileItem>
            <MobileItem onClick={()=>setTab("properties")}>Properties</MobileItem>
            <MobileItem onClick={()=>setTab("leads")}>Leads</MobileItem>
            <MobileItem onClick={()=>setTab("referral")}>Referral</MobileItem>
            <MobileItem onClick={()=>setTab("subscription")}>Subscription</MobileItem>
            <MobileItem onClick={()=>setTab("profile")}>Profile</MobileItem>
            <MobileItem danger onClick={()=>signOut({callbackUrl:"/"})}>Logout</MobileItem>
          </div>
        </div>
      )}
    </div>
  );
}

/* ================= COMPONENTS ================= */

const ReferralBox = ({ code }) => {
  if (!code) return null;
  const text = `Join Divine Acres using my referral code: ${code}`;

  return (
    <div style={refBox}>
      <div>
        <div style={refLabel}>Your Referral Code</div>
        <div style={refCode}>{code}</div>
        <button style={copyBtn} onClick={()=>navigator.clipboard.writeText(code)}>📋 Copy</button>
      </div>
      <div style={shareRow}>
        <Share bg="#25D366" link={`https://wa.me/?text=${encodeURIComponent(text)}`}>WhatsApp</Share>
        <Share bg="#1877F2" link={`https://facebook.com/sharer/sharer.php?quote=${encodeURIComponent(text)}`}>Facebook</Share>
        <Share bg="#E1306C" link={`https://instagram.com/?caption=${encodeURIComponent(text)}`}>Instagram</Share>
      </div>
    </div>
  );
};

const Graph = ({ title, data }) => {
  const max = Math.max(...data, 5);
  return (
    <div style={graphCard}>
      <b>{title}</b>
      <div style={barWrap}>
        {data.map((v,i)=>(
          <div key={i} style={barCol}>
            <div style={{...bar,height:(v/max)*120+20}} />
            <div style={barLabel}>{v}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ================= SMALL ================= */

const Profile = ({ session, onClick }) => (
  <div style={profileBlock} onClick={onClick}>
    <img src={session.user.image||"/images/avatar.png"} style={avatar}/>
    <div style={profileName}>{session.user.name}</div>
    <div style={profileEmail}>{session.user.email}</div>
  </div>
);

const Nav = ({ label, active, onClick }) => (
  <div onClick={onClick} style={{
    padding:10,borderRadius:10,marginBottom:6,
    background:active?"#1e40af":"transparent",
    color:active?"#fff":"#c7d2fe",fontWeight:700,cursor:"pointer"
  }}>{label}</div>
);

const Kpi = ({ title, value, onClick }) => (
  <div onClick={onClick} style={kpi}>
    <div style={{fontSize:12}}>{title}</div>
    <div style={{fontSize:22,fontWeight:900}}>{value}</div>
  </div>
);

const SubTab = ({ label, active, onClick }) => (
  <button onClick={onClick} style={{
    padding:"8px 16px",borderRadius:20,
    background:active?"#1e40af":"#e5edff",
    color:active?"#fff":"#1e3a8a",border:"none",fontWeight:700
  }}>{label}</button>
);

const Share = ({ bg, link, children }) => (
  <a href={link} target="_blank">
    <button style={{...shareBtn,background:bg}}>{children}</button>
  </a>
);

const MobileItem = ({ children, onClick, danger }) => (
  <div onClick={onClick} style={{
    padding:14,fontWeight:700,color:danger?"#dc2626":"#1e40af"
  }}>{children}</div>
);

/* ================= STYLES ================= */

const wrap={display:"flex",minHeight:"100vh",background:"#f1f5fb"};
const sidebar={width:240,background:"#0a2a5e",color:"#fff",padding:16};
const main={flex:1,padding:16};

const pageTitle={margin:"0 0 12px",fontWeight:900};

const profileBlock={textAlign:"center",marginBottom:20,cursor:"pointer"};
const avatar={width:56,height:56,borderRadius:"50%"};
const profileName={marginTop:6,fontWeight:800};
const profileEmail={fontSize:11,opacity:.8};

const logout={marginTop:20,width:"100%",padding:10,background:"#ef4444",color:"#fff",border:"none",borderRadius:10};

const kpiGrid={display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))",gap:12};
const kpi={background:"#1e40af",color:"#fff",padding:16,borderRadius:14,cursor:"pointer"};

const refBox={background:"#fff",borderRadius:14,padding:14,marginTop:16,display:"flex",justifyContent:"space-between",gap:12,flexWrap:"wrap"};
const refLabel={fontSize:12,color:"#64748b"};
const refCode={fontSize:22,fontWeight:900,color:"#1e40af"};
const copyBtn={marginTop:6,padding:"6px 12px",borderRadius:8,border:"1px solid #c7d2fe",background:"#eef2ff",fontWeight:700};
const shareRow={display:"flex",gap:8,alignItems:"center",flexWrap:"wrap"};
const shareBtn={padding:"8px 14px",borderRadius:10,color:"#fff",fontWeight:800,border:"none"};

const graphGrid={display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:16,marginTop:20};
const graphCard={background:"#fff",padding:16,borderRadius:14};
const barWrap={display:"flex",gap:16,alignItems:"flex-end",height:140};
const barCol={textAlign:"center"};
const bar={width:16,background:"#2563eb",borderRadius:6};
const barLabel={fontSize:10};

const subTabs={display:"flex",gap:10,marginBottom:16};
const postBtn={padding:14,background:"#1e40af",color:"#fff",border:"none",borderRadius:12,fontWeight:800};

const mobileTop={display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12};
const dotsBtn={fontSize:22,background:"none",border:"none"};

const mobileOverlay={position:"fixed",inset:0,background:"rgba(0,0,0,.4)",zIndex:9999};
const mobileMenuBox={background:"#fff",borderRadius:14,margin:20,overflow:"hidden"};
