import "../styles/globals.css";
import "../styles/admin.css";

import Header from "../components/Header";
import Footer from "../components/Footer";

import { SessionProvider } from "next-auth/react";
import { useRouter } from "next/router";

export default function MyApp({ Component, pageProps }) {
  const router = useRouter();

  const hideLayout =
    router.pathname.startsWith("/user") ||
    router.pathname.startsWith("/dealer") ||
    router.pathname.startsWith("/admin");

  return (
    <SessionProvider session={pageProps.session}>
      {!hideLayout && <Header />}

      <main style={{ minHeight: "70vh" }}>
        <Component {...pageProps} />
      </main>

      {!hideLayout && <Footer />}
    </SessionProvider>
  );
}
