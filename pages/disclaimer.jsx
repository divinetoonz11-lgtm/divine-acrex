import Head from "next/head";

export default function DisclaimerPage() {
  return (
    <>
      <Head>
        <title>Disclaimer | Divine Acres</title>
        <meta
          name="description"
          content="Legal disclaimer for Divine Acres real estate platform"
        />
      </Head>

      <main style={{ maxWidth: "900px", margin: "40px auto", padding: "0 16px" }}>
        <h1>Disclaimer</h1>

        <p>
          Divine Acres (A unit of Sai Helimak TDI Solutions) is a digital real
          estate listing and information platform. The website acts solely as a
          technology-based intermediary for property listings and related
          information.
        </p>

        <p>
          Divine Acres does <strong>NOT</strong> act as a real estate broker,
          builder, developer, channel partner, or agent. All property details,
          prices, availability, images, and descriptions are provided by
          property owners, developers, or authorized dealers.
        </p>

        <p>
          Users are advised to independently verify all information, including
          property details, approvals, ownership, legal compliance, and RERA
          registration (if applicable), before entering into any transaction.
        </p>

        <p>
          Divine Acres shall not be responsible or liable for any loss, damage,
          dispute, or legal issue arising out of reliance on the information
          available on this platform.
        </p>

        <p>
          By using this website, you acknowledge and agree that Divine Acres is
          only a facilitation platform and bears no responsibility for property
          transactions, negotiations, or outcomes.
        </p>
      </main>
    </>
  );
}
