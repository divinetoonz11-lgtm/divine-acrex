// components/DashboardLayout.jsx
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";

export default function DashboardLayout({ title, children }) {

  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [notifications, setNotifications] = useState(3);
  const [showQuick, setShowQuick] = useState(false);
  const [showAI, setShowAI] = useState(false);

  const isActive = (path) => router.pathname.startsWith(path);

  /* Simulated real-time notification update */
  useEffect(() => {
    const interval = setInterval(() => {
      setNotifications((prev) => prev); 
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const menuItem = (href, label, icon) => (
    <Link href={href} key={href}>
      <div style={{
        display: "flex",
        alignItems: "center",
        padding: "10px 14px",
        marginBottom: 6,
        cursor: "pointer",
        borderRadius: 8,
        fontSize: 14,
        transition: "0.2s",
        background: isActive(href) ? "#1d3c70" : "transparent",
        color: isActive(href) ? "#fff" : "#333",
        borderLeft: isActive(href) ? "4px solid #00c896" : "4px solid transparent"
      }}>
        <span style={{ marginRight: collapsed ? 0 : 10 }}>{icon}</span>
        {!collapsed && label}
      </div>
    </Link>
  );

  const sectionTitle = (text) => (
    !collapsed && (
      <div style={{
        fontSize: 12,
        fontWeight: 700,
        margin: "15px 0 8px",
        color: "#888"
      }}>
        {text}
      </div>
    )
  );

  return (
    <div style={{ display: "flex", background: "#f4f6fa", minHeight: "100vh" }}>

      {/* SIDEBAR */}
      <div style={{
        width: collapsed ? 70 : 270,
        background: "#ffffff",
        transition: "0.3s ease",
        padding: 15,
        boxShadow: "2px 0 12px rgba(0,0,0,0.05)",
        overflowY: "auto",
        height: "100vh"
      }}>

        <div style={{ textAlign: collapsed ? "center" : "right", marginBottom: 20 }}>
          <button
            onClick={() => setCollapsed(!collapsed)}
            style={{
              background: "#1d3c70",
              color: "#fff",
              border: "none",
              padding: "6px 10px",
              borderRadius: 6,
              cursor: "pointer"
            }}
          >
            {collapsed ? "➤" : "◀"}
          </button>
        </div>

        {sectionTitle("OVERVIEW")}
        {menuItem("/admin/dashboard", "Dashboard", "📊")}
        {menuItem("/admin/profile", "Admin Profile", "👤")}

        {sectionTitle("USER MANAGEMENT")}
        {menuItem("/admin/users", "Users", "👥")}
        {menuItem("/admin/sub-admins", "Sub Admins", "🛡")}
        {menuItem("/admin/roles", "Roles & Permissions", "🔐")}

        {sectionTitle("DEALER MANAGEMENT")}
        {menuItem("/admin/dealers", "Dealers", "🏢")}
        {menuItem("/admin/dealer-promotions", "Dealer Promotions", "📢")}

        {sectionTitle("PROPERTY MANAGEMENT")}
        {menuItem("/admin/property-overview", "Overview", "🏠")}
        {menuItem("/admin/properties", "All Properties", "📋")}
        {menuItem("/admin/property-control", "Property Control", "⚙")}
        {menuItem("/admin/insights_reports", "Insights & Reports", "📈")}
        {menuItem("/admin/spam-abuse", "Abuse & Spam", "🚨")}

        {sectionTitle("REVENUE MANAGEMENT")}
        {menuItem("/admin/subscriptions", "Subscriptions", "💳")}
        {menuItem("/admin/payments", "Payments", "💰")}
        {menuItem("/admin/payouts", "Payouts", "🏦")}
        {menuItem("/admin/revenue", "Revenue Analytics", "📊")}
        {menuItem("/admin/dealer-promotions", "Ads & Promotions", "🎯")}

        {sectionTitle("OWNER CONTACT MANAGEMENT")}
        {menuItem("/admin/owner-contact-plans", "Plans", "📦")}
        {menuItem("/admin/owner-contact-payments", "Payments", "💸")}
        {menuItem("/admin/owner-contact-logs", "Usage Logs", "📜")}

        {sectionTitle("SYSTEM MANAGEMENT")}
        {menuItem("/admin/analytics", "Analytics", "📊")}
        {menuItem("/admin/audit-log", "Audit Logs", "📝")}
        {menuItem("/admin/notifications", "Notifications", "🔔")}
        {menuItem("/admin/settings", "Settings", "⚙")}

        {sectionTitle("AUTOMATION ENGINE")}
        {menuItem("/admin/automation-overview", "Overview", "🤖")}
        {menuItem("/admin/automation-rules", "Rule Engine", "📐")}
        {menuItem("/admin/automation-triggers", "Event Triggers", "⚡")}
        {menuItem("/admin/automation-logs", "Automation Logs", "📂")}

        {menuItem("/admin/login", "Logout", "🚪")}

      </div>

      {/* MAIN CONTENT */}
      <div style={{ flex: 1, padding: 30 }}>

        {/* TOP BAR */}
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 20
        }}>
          <div style={{
            background: "#1d3c70",
            color: "#fff",
            padding: "12px 20px",
            borderRadius: 10,
            fontSize: 20,
            fontWeight: 600
          }}>
            {title}
          </div>

          {/* 🔔 Notification Bell */}
          <div style={{ position: "relative", cursor: "pointer" }}>
            <span style={{ fontSize: 22 }}>🔔</span>
            {notifications > 0 && (
              <span style={{
                position: "absolute",
                top: -5,
                right: -8,
                background: "red",
                color: "#fff",
                fontSize: 12,
                borderRadius: "50%",
                padding: "3px 6px"
              }}>
                {notifications}
              </span>
            )}
          </div>
        </div>

        <div style={{
          background: "#ffffff",
          padding: 20,
          borderRadius: 12,
          boxShadow: "0 4px 15px rgba(0,0,0,0.05)"
        }}>
          {children}
        </div>

      </div>

      {/* ⚡ Floating Quick Actions */}
      <div style={{
        position: "fixed",
        bottom: 25,
        right: 25
      }}>
        <button
          onClick={() => setShowQuick(!showQuick)}
          style={{
            background: "#00c896",
            color: "#fff",
            border: "none",
            padding: 15,
            borderRadius: "50%",
            fontSize: 18,
            cursor: "pointer",
            boxShadow: "0 4px 15px rgba(0,0,0,0.2)"
          }}
        >
          ⚡
        </button>

        {showQuick && (
          <div style={{
            background: "#fff",
            padding: 15,
            borderRadius: 10,
            marginTop: 10,
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
          }}>
            <div style={{ marginBottom: 8 }}>+ Add Property</div>
            <div style={{ marginBottom: 8 }}>+ Add Dealer</div>
            <div>+ Send Notification</div>
          </div>
        )}
      </div>

      {/* 🤖 AI Assistant */}
      <div style={{
        position: "fixed",
        bottom: 25,
        left: 25
      }}>
        <button
          onClick={() => setShowAI(!showAI)}
          style={{
            background: "#1d3c70",
            color: "#fff",
            border: "none",
            padding: 15,
            borderRadius: "50%",
            fontSize: 18,
            cursor: "pointer",
            boxShadow: "0 4px 15px rgba(0,0,0,0.2)"
          }}
        >
          🤖
        </button>

        {showAI && (
          <div style={{
            background: "#fff",
            width: 260,
            padding: 15,
            borderRadius: 12,
            marginTop: 10,
            boxShadow: "0 4px 15px rgba(0,0,0,0.15)"
          }}>
            <div style={{ fontWeight: 600, marginBottom: 8 }}>AI Assistant</div>
            <div style={{ fontSize: 13, color: "#555" }}>
              Ask about revenue, listings, spam alerts or analytics.
            </div>
          </div>
        )}
      </div>

    </div>
  );
}