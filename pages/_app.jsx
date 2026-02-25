import "../styles/globals.css";
import "../styles/admin.css";

import Header from "../components/Header";
import Footer from "../components/Footer";

import Head from "next/head";

import { SessionProvider, useSession, signOut } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";

import Script from "next/script";
import * as ga from "../lib/ga";

import { LanguageProvider } from "../context/LanguageContext";

/* ======================================================
   🔒 ROLE SYNC GUARD (UNCHANGED)
====================================================== */
function RoleSyncGuard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status !== "authenticated") return;

    // ❌ login/auth flow me kabhi run na ho
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
          signOut({ callbackUrl: "/" });
        }
      })
      .catch(() => {});
  }, [status, router.pathname]);

  return null;
}

/* ======================================================
   ✅ DASHBOARD REDIRECT (FINAL FIX)
====================================================== */
function DashboardRedirect() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status !== "authenticated") return;
    if (router.pathname !== "/") return;

    const role = session?.user?.role;

    if (role === "admin") router.replace("/admin/dashboard");
    else if (role === "dealer") router.replace("/dealer/dashboard");
    else if (role === "user") router.replace("/user/dashboard");
  }, [status, session, router.pathname]);

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

  // ✅ TAWK.TO CHAT
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
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <LanguageProvider>
        {/* 🔒 Existing logic */}
        <RoleSyncGuard />

        {/* ✅ LOGIN → DASHBOARD FIX */}
        <DashboardRedirect />

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
