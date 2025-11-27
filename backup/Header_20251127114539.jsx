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
    // allow ctrl/cmd/middle-click to open in new tab
    if (e && (e.metaKey || e.ctrlKey || e.shiftKey || e.button === 1)) return;
    if (e) e.preventDefault();
    // log and navigate
    try { console.log("Header navigate ->", href); } catch (err) {}
    router.push(href);
  }

  function openLoginModal() {
    // dispatch a CustomEvent so your app can listen and open a modal
    const ev = new CustomEvent("openLogin", { detail: { source: "header" } });
    window.dispatchEvent(ev);
    console.log("openLogin event dispatched");
  }

  return (
    <header className={styles.headerWrap} role="banner" style={{ zIndex: 99999 }}>
      <div className={styles.headerInner}>

        {/* LEFT: Logo + Brand */}
        <div className={styles.left}>
          <a href="/" onClick={(e) => navigate("/", e)} aria-label="DivineAcrex Home">
            <img
              src="/images/A_digital_graphic_design_features_a_logo_consistin.png"
              alt="DivineAcrex Logo"
              className={styles.logoBox}
            />
          </a>
          <a href="/" onClick={(e) => navigate("/", e)} className={styles.brandText}>DivineAcrex</a>
        </div>

        {/* CENTER BLUE PILL */}
        <div className={styles.bluePill}>
          <nav className={styles.mainNav} aria-label="Primary navigation">
            {mainMenu.map((m) => (
              <a
                key={m.href}
                href={m.href}
                className={styles.navLink}
                onClick={(e) => navigate(m.href, e)}
                role="link"
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
            onClick={() => console.log("Notifications clicked")}
            aria-label="Notifications"
          >
            🔔
          </button>

          <button
            className={styles.iconBtn}
            title="Saved"
            onClick={() => console.log("Saved clicked")}
            aria-label="Saved items"
          >
            ♡
          </button>

          {/* LOGIN BUTTON — opens modal via CustomEvent */}
          <button
            className={styles.loginBtn}
            onClick={openLoginModal}
            aria-haspopup="dialog"
            aria-label="Open login"
          >
            Login
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

      {/* optional mobile nav expanded view (simple) */}
      {mobileOpen && (
        <div className={styles.mobileMenu}>
          <nav>
            {mainMenu.concat(smallLinks).map((m) => (
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
            <button className={styles.mobileLogin} onClick={() => { openLoginModal(); setMobileOpen(false); }}>
              Login
            </button>
          </nav>
        </div>
      )}
    </header>
  );
}
