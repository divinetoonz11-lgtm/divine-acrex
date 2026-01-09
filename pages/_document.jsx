import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* Keep document clean – no viewport here */}
        <meta charSet="UTF-8" />
      </Head>

      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
