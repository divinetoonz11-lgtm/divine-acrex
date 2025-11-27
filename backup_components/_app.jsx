// pages/_app.jsx
import React, { useEffect } from "react";
import { useRouter } from "next/router";
import Header from "../components/Header";
import Footer from "../components/Footer";   // ⭐ ADD FOOTER

// ⭐ Global CSS imports
import "../styles/globals.css";
import "../styles/header.css";
import "../styles/listings.css";
import "../styles/property-card.css";

export default function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const isAdminRoute = router.pathname.startsWith("/admin");

  useEffect(() => {
    // handler which responds to CustomEvent "openLogin"
    function handleOpenLogin(e) {
      try {
        // mark as handled so Header fallback won't trigger navigation again
        window.__openLoginHandled = true;
      } catch (err) {}

      // optional: if event provides a role or redirect, you can read it
      const role = e?.detail?.role || null;

      if (role === "dealer") {
        router.push("/login/dealer");
      } else if (role === "admin") {
        router.push("/login/admin");
      } else {
        router.push("/login");
      }
    }

    // Listen for event dispatched by Header (or any other component)
    window.addEventListener("openLogin", handleOpenLogin);

    // convenience function: window.openLogin({ role: 'dealer' })
    if (!window.openLogin) {
      window.openLogin = (opts = {}) => {
        const ev = new CustomEvent("openLogin", { detail: opts });
        window.dispatchEvent(ev);
      };
    }

    return () => {
      window.removeEventListener("openLogin", handleOpenLogin);
      // optional: cleanup window.openLogin if you want
      // delete window.openLogin;
    };
  }, [router]);

  return (
    <>
      {/* NORMAL WEBSITE PAGES */}
      {!isAdminRoute && (
        <>
          <Header />
          <Component {...pageProps} />
          <Footer />       {/* ⭐ FOOTER ALWAYS VISIBLE */}
        </>
      )}

      {/* ADMIN PANEL PAGES */}
      {isAdminRoute && (
        <div style={{ padding: 20 }}>
          <Component {...pageProps} />
        </div>
      )}
    </>
  );
}
