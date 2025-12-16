// components/Footer.jsx
import React, { useState } from "react";
import styles from "./Footer.module.css";

export default function Footer() {
  const year = new Date().getFullYear();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  async function subscribe(e) {
    e?.preventDefault();
    if (!email || !email.includes("@")) {
      return alert("कृपया सही ईमेल डालें।");
    }
    try {
      setLoading(true);
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const j = await res.json();
      alert(j.message || (j.ok ? "Subscribed" : "Error"));
      if (j.ok) setEmail("");
    } catch (err) {
      console.error(err);
      alert("Server error. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <footer className={styles.root}>
      <div className={styles.bar}>
        <div className={styles.container}>

          {/* LEFT: Brand + Contact */}
          <div className={styles.col}>
            <div className={styles.brandWrap}>
              <div className={styles.dah}>DAH</div>
              <div className={styles.company}>Divine Acrex Housing</div>
            </div>

            <div className={styles.contact}>
              <div className={styles.contactLine}>📍 Malad West, Mumbai</div>
              <div className={styles.contactLine}>📞 +91 98674 02515</div>
              <div className={styles.contactLine}>✉️ divinetoonz11@gmail.com</div>
            </div>
          </div>

          {/* MIDDLE: Quick Links (2 columns) */}
          <div className={styles.col}>
            <div className={styles.sectionTitle}>Quick Links</div>

            <div className={styles.linksGrid}>
              <ul className={styles.linkCol}>
                <li><a href="/">Home</a></li>
                <li><a href="/listings">Listings</a></li>
                <li><a href="/post-property">Free Listing</a></li>
                <li><a href="/for-buyers">For Buyers</a></li>
              </ul>

              <ul className={styles.linkCol}>
                <li><a href="/for-dealers">For Dealers</a></li>
                <li><a href="/contact">Contact</a></li>
                <li><a href="/careers">💼 Careers</a></li>
                <li><a href="/insights">📰 Blog / Insights</a></li>
              </ul>
            </div>
          </div>

          {/* RIGHT: Subscribe + Socials */}
          <div className={styles.col}>
            <div className={styles.sectionTitle}>Subscribe</div>
            <div className={styles.subText}>Get market updates & property alerts.</div>

            <form className={styles.subscribeBox} onSubmit={subscribe}>
              <input
                aria-label="email"
                type="email"
                placeholder="Your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className={styles.emailInput}
              />
              <button
                type="submit"
                className={styles.subBtn}
                disabled={loading}
                aria-disabled={loading}
              >
                {loading ? "Subscribing..." : "Subscribe"}
              </button>
            </form>

            <div className={styles.sectionTitle} style={{ marginTop: 18 }}>Follow</div>
            <div className={styles.socialRow}>

              {/* X (Twitter) */}
              <a className={styles.social} href="#" aria-label="X (Twitter)">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path d="M22 5.92c-.61.27-1.27.45-1.96.53.71-.43 1.26-1.1 1.52-1.9-.66.39-1.4.68-2.19.84C18.7 4.3 17.78 4 16.79 4c-1.5 0-2.72.98-3.17 2.33-.52-.1-1.02-.28-1.47-.53-.36.98-.02 2.02.74 2.6-.53 0-1.02-.16-1.45-.4v.04c0 1.28.9 2.36 2.09 2.61-.44.12-.9.14-1.36.05.38 1.2 1.48 2.07 2.78 2.1C13 16.1 11.98 16.6 10.86 16.6c-.29 0-.58-.02-.86-.07C9.64 17.61 10.7 18.5 12 18.5c-1.16.9-2.64 1.44-4.25 1.44-.28 0-.56-.01-.83-.05C7.1 20.65 9.01 21.5 11.12 21.5c7.34 0 11.35-6.27 11.35-11.71v-.53A8.3 8.3 0 0 0 22 5.92z" fill="currentColor"/>
                </svg>
              </a>

              {/* WhatsApp */}
              <a className={styles.social} href="#" aria-label="WhatsApp">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path d="M20.52 3.48A11.9 11.9 0 0 0 12 0C5.37 0 .09 5.38.09 12c0 2.12.55 4.16 1.59 5.98L0 24l6.33-1.65A11.94 11.94 0 0 0 12 24c6.63 0 11.91-5.38 11.91-12 0-1.99-.45-3.85-1.39-5.52zM12 21.5c-1.5 0-2.95-.4-4.2-1.13l-.3-.18-3.75.98.98-3.66-.19-.3A9.41 9.41 0 0 1 2.5 12c0-5.23 4.26-9.5 9.5-9.5S21.5 6.77 21.5 12 17.24 21.5 12 21.5z" fill="currentColor"/>
                  <path d="M17.2 14.3c-.3-.15-1.77-.87-2.05-.97-.28-.1-.48-.15-.69.15-.2.3-.8.97-.98 1.17-.18.2-.35.23-.65.08-.3-.15-1.22-.45-2.32-1.43-.86-.76-1.44-1.7-1.61-2-.17-.3-.02-.46.13-.61.13-.12.3-.33.45-.5.15-.16.2-.28.3-.48.1-.2.05-.37-.03-.52-.08-.15-.69-1.66-.95-2.28-.25-.6-.5-.5-.69-.5-.18 0-.37-.02-.56-.02-.18 0-.48.07-.73.34-.24.28-.93.9-.93 2.2s.95 2.56 1.08 2.74c.12.18 1.86 2.85 4.5 3.88 1.8.75 2.65.86 3.59.71.58-.1 1.77-.72 2.02-1.41.24-.68.24-1.27.17-1.41-.06-.14-.24-.23-.54-.39z" fill="currentColor"/>
                </svg>
              </a>

              {/* YouTube */}
              <a className={styles.social} href="#" aria-label="YouTube">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path d="M10 15l5.2-3L10 9v6z" fill="currentColor"/>
                  <path d="M21.8 7.2s-.2-1.6-.8-2.3c-.8-1.1-1.7-1.1-2.1-1.2C15.9 3.4 12 3.4 12 3.4s-3.9 0-6.9.3c-.4.1-1.3.1-2.1 1.2-.6.7-.8 2.3-.8 2.3S1.9 9 1.9 10.8v2.4c0 1.8.5 3.6.5 3.6s.2 1.6.8 2.3c.8 1.1 1.9 1.1 2.4 1.2 1.8.1 7.4.3 7.4.3s3.9 0 6.9-.3c.4-.1 1.3-.1 2.1-1.2.6-.7.8-2.3.8-2.3s.5-1.8.5-3.6v-2.4c0-1.8-.5-3.6-.5-3.6z" fill="currentColor"/>
                </svg>
              </a>

              {/* Instagram */}
              <a className={styles.social} href="#" aria-label="Instagram">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path d="M7 2h10a5 5 0 015 5v10a5 5 0 01-5 5H7a5 5 0 01-5-5V7a5 5 0 015-5zm5 6.5A4.5 4.5 0 1016.5 13 4.5 4.5 0 0012 8.5zM18.5 6a1 1 0 11-1 1 1 1 0 011-1z" fill="currentColor"/>
                </svg>
              </a>

              {/* LinkedIn */}
              <a className={styles.social} href="#" aria-label="LinkedIn">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path d="M4.98 3.5a2.5 2.5 0 110 5 2.5 2.5 0 010-5zM3 8.98h4v12H3v-12zM9 8.98h3.8v1.7h.1c.5-.9 1.8-1.9 3.7-1.9 4 0 4.7 2.6 4.7 6v6.2h-4v-5.5c0-1.3 0-3-1.8-3-1.8 0-2 1.4-2 2.9v5.6H9v-12z" fill="currentColor"/>
                </svg>
              </a>

            </div>
          </div>
        </div>

        {/* COPYRIGHT + LINKS */}
        <div className={styles.footRow}>
          <div className={styles.copy}>© {year} Divine Acrex Housing. All rights reserved.</div>
          <div className={styles.footLinks}>
            <a href="/terms">Terms</a>
            <a href="/privacy">Privacy</a>
            <a href="/sitemap">Sitemap</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
