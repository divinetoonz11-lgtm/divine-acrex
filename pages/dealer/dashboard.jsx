import React, { useEffect, useState, useRef } from "react";
import { signOut, useSession } from "next-auth/react";

/* ===== EXISTING PAGES ===== */
import DealerOverview from "./overview";
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
  const [mobileMenu, setMobileMenu] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const fileRef = useRef(null);

  /* ===== MOBILE DETECT ===== */
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 900);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  /* ===== AUTH CHECK ===== */
  useEffect(() => {
    if (status === "loading") return;
    if (!session?.user || session.user.role !== "dealer") {
      window.location.replace("/");
    }
  }, [session, status]);

  if (status === "loading") return null;
  if (!session?.user || session.user.role !== "dealer") return null;

  /* ===== PROFILE PHOTO ===== */
  const handlePhotoClick = () => fileRef.current?.click();

  const handlePhotoSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("photo", file);

    const res = await fetch("/api/dealer/upload-photo", {
      method: "POST",
      body: formData,
    });

    if (res.ok) window.location.reload();
    else alert("Photo upload failed");
  };

  const supportMail = `mailto:divinetoonz11@gmail.com?subject=Divine%20Acres%20Dealer%20Support&body=Dealer:%20${session.user.email}`;

  const changeTab = (value) => {
    setTab(value);
    if (isMobile) setMobileMenu(false);
  };

  return (
    <div style={wrap}>

      {/* ===== MOBILE HEADER ===== */}
      {isMobile && (
        <div style={mobileHeader}>
          <div style={hamburger} onClick={() => setMobileMenu(true)}>☰</div>
          <div style={{ fontWeight: 800 }}>Dealer Dashboard</div>
        </div>
      )}

      {/* ===== OVERLAY ===== */}
      {isMobile && mobileMenu && (
        <div style={overlay} onClick={() => setMobileMenu(false)} />
      )}

      {/* ================= SIDEBAR ================= */}
      <aside
        style={{
          ...sidebar,
          ...(isMobile
            ? {
                position: "fixed",
                left: mobileMenu ? 0 : -260,
                top: 0,
                height: "100%",
                transition: "0.3s ease",
                zIndex: 1200,
              }
            : {}),
        }}
      >
        <Profile
          session={session}
          onClick={() => changeTab("profile")}
          onPhotoClick={handlePhotoClick}
        />

        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          style={{ display: "none" }}
          onChange={handlePhotoSelect}
        />

        <Nav label="Overview" active={tab==="overview"} onClick={()=>changeTab("overview")} />
        <Nav label="Insights" active={tab==="insights"} onClick={()=>changeTab("insights")} />
        <Nav label="Properties" active={tab==="properties"} onClick={()=>changeTab("properties")} />
        <Nav label="Leads" active={tab==="leads"} onClick={()=>changeTab("leads")} />
        <Nav label="Referral & Rewards" active={tab==="referral"} onClick={()=>changeTab("referral")} />
        <Nav label="Subscription" active={tab==="subscription"} onClick={()=>changeTab("subscription")} />
        <Nav label="Billing & Invoices" active={tab==="payments"} onClick={()=>changeTab("payments")} />
        <Nav label="Notifications" active={tab==="notifications"} onClick={()=>changeTab("notifications")} />
        <Nav label="Profile" active={tab==="profile"} onClick={()=>changeTab("profile")} />

        <Nav
          label="Support"
          active={false}
          onClick={()=>window.location.href = supportMail}
        />

        <button style={logout} onClick={() => signOut({ callbackUrl: "/" })}>
          Logout
        </button>
      </aside>

      {/* ================= MAIN ================= */}
      <main
        style={{
          ...main,
          marginTop: isMobile ? 60 : 0,
        }}
      >

        {tab === "overview" && <DealerOverview />}
        {tab === "insights" && <DealerInsights />}
        {tab === "leads" && <DealerLeads />}
        {tab === "referral" && <DealerReferral />}
        {tab === "subscription" && <DealerSubscription />}
        {tab === "payments" && <BillingInvoices />}
        {tab === "notifications" && <DealerNotifications />}
        {tab === "profile" && <DealerProfile />}

        {tab === "properties" && (
          <>
            <div style={subTabs}>
              <SubTab label="Post Property" active={propertyTab==="post"} onClick={()=>setPropertyTab("post")} />
              <SubTab label="My Properties" active={propertyTab==="my"} onClick={()=>setPropertyTab("my")} />
            </div>

            {propertyTab==="post" && (
              <a href="/post-property">
                <button style={postBtn}>Open Post Property</button>
              </a>
            )}

            {propertyTab==="my" && <DealerMyProperties />}
          </>
        )}

      </main>

    </div>
  );
}

/* ================= COMPONENTS ================= */

const Profile = ({ session, onClick, onPhotoClick }) => (
  <div style={profileBlock}>
    <img
      src={session.user.image || "/images/avatar.png"}
      style={avatar}
      onClick={(e) => { e.stopPropagation(); onPhotoClick(); }}
    />
    <div style={profileName} onClick={onClick}>{session.user.name}</div>
    <div style={profileEmail}>{session.user.email}</div>
  </div>
);

const Nav = ({ label, active, onClick }) => (
  <div
    onClick={onClick}
    style={{
      padding: 10,
      borderRadius: 10,
      marginBottom: 6,
      background: active ? "#1e40af" : "transparent",
      color: active ? "#fff" : "#c7d2fe",
      fontWeight: 700,
      cursor: "pointer",
      transition: "0.2s",
    }}
  >
    {label}
  </div>
);

const SubTab = ({ label, active, onClick }) => (
  <button
    onClick={onClick}
    style={{
      padding: "8px 16px",
      borderRadius: 20,
      background: active ? "#1e40af" : "#e5edff",
      color: active ? "#fff" : "#1e3a8a",
      border: "none",
      fontWeight: 700,
      cursor: "pointer",
    }}
  >
    {label}
  </button>
);

/* ================= STYLES ================= */

const wrap = {
  display: "flex",
  minHeight: "100vh",
  background: "#f1f5fb",
  width: "100%",
};

const sidebar = {
  width: 240,
  background: "#0a2a5e",
  color: "#fff",
  padding: 16,
};

const main = {
  flex: 1,
  padding: 24,
  width: "100%",
};

const profileBlock = {
  textAlign: "center",
  marginBottom: 20,
  cursor: "pointer",
};

const avatar = {
  width: 60,
  height: 60,
  borderRadius: "50%",
  border: "2px solid #fff",
};

const profileName = {
  marginTop: 6,
  fontWeight: 800,
};

const profileEmail = {
  fontSize: 11,
  opacity: 0.8,
};

const logout = {
  marginTop: 20,
  width: "100%",
  padding: 10,
  background: "#ef4444",
  color: "#fff",
  border: "none",
  borderRadius: 10,
  fontWeight: 700,
  cursor: "pointer",
};

const subTabs = {
  display: "flex",
  gap: 10,
  marginBottom: 16,
};

const postBtn = {
  padding: 14,
  background: "#1e40af",
  color: "#fff",
  border: "none",
  borderRadius: 12,
  fontWeight: 800,
  cursor: "pointer",
};

const mobileHeader = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: 60,
  background: "#0a2a5e",
  color: "#fff",
  display: "flex",
  alignItems: "center",
  padding: "0 16px",
  zIndex: 1300,
};

const hamburger = {
  fontSize: 24,
  marginRight: 16,
  cursor: "pointer",
};

const overlay = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  background: "rgba(0,0,0,0.4)",
  zIndex: 1100,
};