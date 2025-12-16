import Head from "next/head";

export default function CareersPage() {
  return (
    <>
      <Head>
        <title>Careers – Divine Acrex Housing</title>
        <meta
          name="description"
          content="Work with Divine Acrex Housing. Join our Mumbai team for sales, marketing, real estate management, design and tech roles."
        />
      </Head>

      <div style={{ padding: "50px 20px", maxWidth: 900, margin: "0 auto" }}>
        <h1 style={{ fontSize: 32, fontWeight: 800 }}>Careers at Divine Acrex</h1>

        <p style={{ fontSize: 16, marginTop: 10 }}>
          Join the fastest-growing real estate platform. Work with a passionate team building the next generation of property solutions.
        </p>

        <h2 style={{ marginTop: 40 }}>Open Positions</h2>

        <div style={{ marginTop: 20, background: "#fff", padding: 20, borderRadius: 12 }}>
          <h3>📌 Sales Executive – Mumbai</h3>
          <p>Freshers and experienced both can apply. Good communication required.</p>
        </div>

        <div style={{ marginTop: 20, background: "#fff", padding: 20, borderRadius: 12 }}>
          <h3>📌 Digital Marketing Specialist</h3>
          <p>SEO, Social Media, Google Ads experience preferred.</p>
        </div>

        <div style={{ marginTop: 20, background: "#fff", padding: 20, borderRadius: 12 }}>
          <h3>📌 Customer Support</h3>
          <p>Handle customer queries and assist clients on call/WhatsApp.</p>
        </div>

        <div style={{ marginTop: 40 }}>
          <h3>📩 Apply Now</h3>
          <p>
            Send your resume to <b>divinetoonz11@gmail.com</b>  
            <br />
            Subject line: <b>"Applying for [Position Name]"</b>
          </p>
        </div>
      </div>
    </>
  );
}
