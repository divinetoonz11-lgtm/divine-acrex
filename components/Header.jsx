// components/Header.jsx
import React, { useState } from "react";
import Link from "next/link";
import LoginModal from "./LoginModal";
import MobileMenu from "./MobileMenu";
import styles from "./Header.module.css";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);

  /* POST PROPERTY */
  function openPostProperty(e) {
    e.preventDefault();
    setMenuOpen(false);
    window.open("/post-property", "_blank");
  }

  return (
    <>
      {/* ================= HEADER ================= */}
      <header className={styles.headerWrap}>
        <div className={styles.headerInner}>

          {/* LEFT */}
          <div className={styles.left}>
            <Link href="/" className={styles.logoLink}>
              <span className={styles.logoBox}>
                <img
                  src="/images/logo.png"
                  alt="Divine Acres"
                  className={styles.logoImg}
                />
              </span>
              <span className={styles.logoText}>Divine Acres</span>
            </Link>
          </div>

          {/* CENTER */}
          <div className={styles.center}>
            <nav className={styles.navBox}>
              <ul className={styles.navList}>
                <li><Link className={styles.navLink} href="/">Home</Link></li>

                {/* ✅ NEW: ABOUT US */}
                <li><Link className={styles.navLink} href="/about-us">About Us</Link></li>

                <li><Link className={styles.navLink} href="/listings">Listings</Link></li>
                <li><Link className={styles.navLink} href="/contact">Contact</Link></li>
                <li><Link className={styles.navLink} href="/for-buyers">For Buyers</Link></li>
                <li><Link className={styles.navLink} href="/for-tenants">For Tenants</Link></li>
                <li><Link className={styles.navLink} href="/for-owners">For Owners</Link></li>
                <li><Link className={styles.navLink} href="/for-dealers">For Dealers / Builders</Link></li>

                {/* ✅ ONLY FIXED LINE (browser-safe) */}
                <li>
                  <button
                    className={styles.navLink}
                    onClick={() => {
                      window.location.href = "/dealer/register";
                    }}
                    style={{
                      background: "none",
                      border: "none",
                      padding: 0,
                      cursor: "pointer",
                      font: "inherit",
                    }}
                  >
                    Become a Dealer
                  </button>
                </li>

                <li><Link className={styles.navLink} href="/insights">Insights</Link></li>
                <li>
                  <a
                    href="/post-property"
                    className={styles.postPill}
                    onClick={openPostProperty}
                  >
                    Post Property <span className={styles.freeChip}>FREE</span>
                  </a>
                </li>
              </ul>
            </nav>
          </div>

          {/* RIGHT */}
          <div className={styles.right}>
            {/* Login */}
            <button
              className={`${styles.iconBtnWhite} ${styles.iconAvatar}`}
              type="button"
              onClick={() => setLoginOpen(true)}
            >
              <svg viewBox="0 0 24 24" className={styles.avatarSvg}>
                <circle cx="12" cy="8" r="3" />
                <path d="M4 20c0-3.5 4-6 8-6s8 2.5 8 6" />
              </svg>
            </button>

            {/* Mobile Menu */}
            <button
              className={styles.mobileMenuBtn}
              type="button"
              onClick={() => setMenuOpen(true)}
            >
              ☰
            </button>
          </div>

        </div>
      </header>

      {/* ================= MOBILE SIDEBAR ================= */}
      <MobileMenu
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        onPost={openPostProperty}
      />

      {/* ================= LOGIN MODAL ================= */}
      <LoginModal
        open={loginOpen}
        onClose={() => setLoginOpen(false)}
      />
    </>
  );
}
