import "../styles/globals.css";
import "../styles/admin.css";

import Header from "../components/Header";
import Footer from "../components/Footer";

import { SessionProvider, useSession, signOut } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";

import Script from "next/script";
import * as ga from "../lib/ga";

// ✅ KEEP (safe, no UI impact)
import { LanguageProvider } from "../context/LanguageContext";

/* ======================================================
   🔒 ROLE SYNC GUARD (SAFE VERSION)
   ------------------------------------------------------
   ❌ LOGIN TIME PE DISABLED
   ✅ ONLY DASHBOARD KE ANDAR KAAM KAREGA
====================================================== */
function RoleSyncGuard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status !== "authenticated") return;

    // ❌ LOGIN / AUTH FLOW ME KABHI RUN NA HO
    if (
      router.pathname.startsWith("/login") ||
      router.pathname.startsWith("/auth")
    ) {
      return;
    }

    fetch("/api/auth/sync-role")
      .then((r) => r.json())
      .then((j) => {
        if (j?.forceLogout) {
          signOut({ callbackUrl: "/login" });
        }
      })
      .catch(() => {});
  }, [status, router.pathname]);

  return null;
}

export default function MyApp({ Component, pageProps }) {
  const router = useRouter();

  const hideLayout =
    router.pathname.startsWith("/user") ||
    router.pathname.startsWith("/dealer") ||
    router.pathname.startsWith("/admin");

  useEffect(() => {
    const handleRouteChange = (url) => {
      ga.pageview(url);
    };

    router.events.on("routeChangeComplete", handleRouteChange);
    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, [router.events]);

  // ✅ TAWK.TO CHAT (CLIENT SIDE – SAFE)
  useEffect(() => {
    if (typeof window === "undefined") return;

    var Tawk_API = window.Tawk_API || {};
    var Tawk_LoadStart = new Date();

    (function () {
      var s1 = document.createElement("script");
      var s0 = document.getElementsByTagName("script")[0];
      s1.async = true;
      s1.src = "https://embed.tawk.to/69448bebc73adf1980aabd20/1jds4gnk2";
      s1.charset = "UTF-8";
      s1.setAttribute("crossorigin", "*");
      s0.parentNode.insertBefore(s1, s0);
    })();
  }, []);

  return (
    <SessionProvider session={pageProps.session}>
      <LanguageProvider>
        {/* 🔒 SAFE ROLE SYNC */}
        <RoleSyncGuard />

        {ga.GA_ID && (
          <>
            <Script
              strategy="afterInteractive"
              src={`https://www.googletagmanager.com/gtag/js?id=${ga.GA_ID}`}
            />
            <Script id="ga-init" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${ga.GA_ID}', { anonymize_ip: true });
              `}
            </Script>
          </>
        )}

        {!hideLayout && <Header />}

        <main style={{ minHeight: "70vh" }}>
          <Component {...pageProps} />
        </main>

        {!hideLayout && <Footer />}
      </LanguageProvider>
    </SessionProvider>
  );
}
