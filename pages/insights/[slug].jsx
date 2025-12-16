import { useRouter } from "next/router";
import Head from "next/head";

export default function BlogDetail() {
  const router = useRouter();
  const { slug } = router.query;

  return (
    <>
      <Head>
        <title>{slug} – Divine Acrex Blog</title>
      </Head>

      <div style={{ padding: "50px 20px", maxWidth: 900, margin: "0 auto" }}>
        <h1 style={{ fontSize: 32, fontWeight: 800, textTransform: "capitalize" }}>
          {slug?.replace(/-/g, " ")}
        </h1>

        <p style={{ marginTop: 20 }}>
          Full article content will be written here later…
        </p>
      </div>
    </>
  );
}
