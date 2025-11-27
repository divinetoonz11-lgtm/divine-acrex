// components/Header.jsx
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import styles from "./Header.module.css";

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const router = useRouter();

  const mainMenu = [
    { label: "Home", href: "/" },
    { label: "Listings", href: "/listings" },
    { label: "Contact", href: "/contact" },
  ];

  const smallLinks = [
    { label: "For Buyers", href: "/buyers" },
    { label: "For Tenants", href: "/tenants" },
    { label: "For Owners", href: "/owners" },
    { label: "For Dealers / Builders", href: "/dealers-builders" },
    { label: "Insights", href: "/insights" },
  ];

  function navigate(href, e) {
    if (e && (e.metaKey || e.ctrlKey || e.shiftKey || e.button === 1)) return;
    if (e) e.preventDefault();
    try { console.log("Header navigate ->", href); } catch (err) {}
    router.push(href);
  }

  function openLoginModal() {
    const ev = new CustomEvent("openLogin", { detail: { source: "header" } });
    window.dispatchEvent(ev);
    console.log("openLogin event dispatched");
  }

  return (
    <header className={styles.headerWrap} role="banner" style={{ zIndex: 99999 }}>
      <div className={styles.headerInner}>

        {/* LEFT */}
        <div className={styles.left}>
          <a href="/" onClick={(e) => navigate("/", e)} aria-label="Home">
            <img
              src="/images/A_digital_graphic_design_features_a_logo_consistin.png"
              alt="DivineAcrex Logo"
              className={styles.logoBox}
            />
          </a>
          <a href="/" onClick={(e) => navigate("/", e)} className={styles.brandText}>
            DivineAcrex
          </a>
        </div>

        {/* CENTER */}
        <div className={styles.bluePill}>
          <nav className={styles.mainNav}>
            {mainMenu.map((m) => (
              <a
                key={m.href}
                href={m.href}
                className={styles.navLink}
                onClick={(e) => navigate(m.href, e)}
              >
                {m.label}
              </a>
            ))}
          </nav>

          <div className={styles.sep} />

          <div className={styles.smallLinks}>
            {smallLinks.map((s) => (
              <a
                key={s.href}
                href={s.href}
                className={styles.smallLink}
                onClick={(e) => navigate(s.href, e)}
              >
                {s.label}
              </a>
            ))}

            <a
              href="/post-property"
              className={styles.postLink}
              onClick={(e) => navigate("/post-property", e)}
            >
              Post property <span className={styles.freeBadge}>FREE</span>
            </a>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className={styles.right}>
          <button
            className={styles.iconBtn}
            title="Notifications"
            aria-label="Notifications"
            onClick={() => console.log("Notifications clicked")}
          >
            🔔
          </button>

          <button
            className={styles.iconBtn}
            title="Saved"
            aria-label="Saved items"
            onClick={() => console.log("Saved clicked")}
          >
            ♡
          </button>

          {/* ⭐ UPDATED LOGIN ICON (using login-1.png) */}
          <button
            onClick={openLoginModal}
            aria-label="Open login"
            style={{
              width: 34,
              height: 34,
              borderRadius: "50%",
              background: "#0ea5a4",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "none",
              cursor: "pointer",
              boxShadow: "0 2px 6px rgba(0,0,0,0.12)",
              padding: 0
            }}
          >
            <img
              src="/images/login-1.png"
              alt="login"
              style={{
                width: 18,
                height: 18,
                display: "block",
              }}
            />
          </button>

          <button
            className={styles.menuBtn}
            aria-label="Open menu"
            onClick={() => setMobileOpen((s) => !s)}
          >
            ☰
          </button>
        </div>

      </div>

      {mobileOpen && (
        <div className={styles.mobileMenu}>
          <nav>
            {[...mainMenu, ...smallLinks].map((m) => (
              <a
                key={m.href}
                href={m.href}
                className={styles.mobileNavLink}
                onClick={(e) => { navigate(m.href, e); setMobileOpen(false); }}
              >
                {m.label}
              </a>
            ))}

            <a
              href="/post-property"
              className={styles.mobileNavLink}
              onClick={(e) => { navigate("/post-property", e); setMobileOpen(false); }}
            >
              Post property <span className={styles.freeBadge}>FREE</span>
            </a>

            <button
              className={styles.mobileLogin}
              onClick={() => { openLoginModal(); setMobileOpen(false); }}
            >
              Login
            </button>
          </nav>
        </div>
      )}
    </header>
  );
}
