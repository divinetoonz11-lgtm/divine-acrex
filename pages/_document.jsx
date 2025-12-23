import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* ================= Google Analytics GA4 ================= */}
        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-PJN4N754GC"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-PJN4N754GC', {
                page_path: window.location.pathname,
              });
            `,
          }}
        />
        {/* ======================================================== */}
      </Head>

      <body>
        <Main />
        <NextScript />

        {/* ================= Tawk.to Chatbot ================= */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
var Tawk_API=Tawk_API||{}, Tawk_LoadStart=new Date();
(function(){
var s1=document.createElement("script"),s0=document.getElementsByTagName("script")[0];
s1.async=true;
s1.src='https://embed.tawk.to/REPLACE_WITH_YOUR_ID/1abcdef';
s1.charset='UTF-8';
s1.setAttribute('crossorigin','*');
s0.parentNode.insertBefore(s1,s0);
})();
            `,
          }}
        />
        {/* =================================================== */}
      </body>
    </Html>
  );
}
