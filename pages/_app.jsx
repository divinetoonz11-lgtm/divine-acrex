// pages/_app.jsx
import "../styles/globals.css";
import "../styles/admin.css";

import Header from "../components/Header";
import Footer from "../components/Footer";

import { SessionProvider } from "next-auth/react";
import { useRouter } from "next/router";

export default function MyApp({ Component, pageProps }) {
  const router = useRouter();

  // Dashboards par header / footer hide
  const hideLayout =
    router.pathname.startsWith("/user") ||
    router.pathname.startsWith("/dealer") ||
    router.pathname.startsWith("/admin");

  return (
    <SessionProvider session={pageProps.session}>
      {/* SINGLE HEADER (desktop + mobile both handled here) */}
      {!hideLayout && <Header />}

      {/* PAGE CONTENT */}
      <main style={{ minHeight: "70vh" }}>
        <Component {...pageProps} />
      </main>

      {/* FOOTER */}
      {!hideLayout && <Footer />}
    </SessionProvider>
  );
}
