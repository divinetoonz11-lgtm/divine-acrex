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
              <div className={styles.dah}>DA</div>
              <div className={styles.company}>Divine Acres</div>
            </div>

            <div className={styles.contact}>
              <div className={styles.contactLine}>
                📍 Malad West, Mumbai, Maharashtra
              </div>
              <div className={styles.contactLine}>
                📞 +91 98674 02515
              </div>
              <div className={styles.contactLine}>
                ✉️ divinetoonz11@gmail.com
              </div>
            </div>
          </div>

          {/* MIDDLE: Quick Links (10 links, 5 + 5 balanced) */}
          <div className={styles.col}>
            <div className={styles.sectionTitle}>Quick Links</div>

            <div className={styles.linksGrid}>
              {/* LEFT COLUMN */}
              <ul className={styles.linkCol}>
                <li><a href="/">Home</a></li>
                <li><a href="/listings">Listings</a></li>
                <li><a href="/post-property">Free Listing</a></li>
                <li><a href="/for-buyers">For Buyers</a></li>
                <li><a href="/disclaimer">Disclaimer</a></li>
              </ul>

              {/* RIGHT COLUMN */}
              <ul className={styles.linkCol}>
                <li><a href="/for-dealers">For Dealers</a></li>
                <li><a href="/contact">Contact</a></li>
                <li><a href="/terms">Terms of Use</a></li>
                <li><a href="/privacy-policy">Privacy Policy</a></li>
                <li><a href="/faq">FAQ</a></li>
              </ul>
            </div>
          </div>

          {/* RIGHT: Subscribe */}
          <div className={styles.col}>
            <div className={styles.sectionTitle}>Subscribe</div>
            <div className={styles.subText}>
              Get market updates & property alerts.
            </div>

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
              >
                {loading ? "Subscribing..." : "Subscribe"}
              </button>
            </form>
          </div>
        </div>

        {/* FOOTER BOTTOM */}
        <div className={styles.footRow}>
          <div className={styles.copy}>
            © {year} Divine Acres. All rights reserved.
            <div className={styles.unitLine}>
              A unit of Sai Helimak TDI Solutions
            </div>
          </div>

          <div className={styles.footLinks}>
            <a href="/terms">Terms of Use</a>
            <a href="/privacy-policy">Privacy Policy</a>
            <a href="/disclaimer">Disclaimer</a>
            <a href="/faq">FAQ</a>
            <a href="/sitemap">Sitemap</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
