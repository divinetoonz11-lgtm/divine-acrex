export default function DealerTerms() {
  return (
    <div style={wrap}>
      <h1 style={title}>Dealer Terms & Conditions</h1>
      <p style={updated}>Last updated: {new Date().toDateString()}</p>

      <section style={section}>
        <h3>1. Dealer Registration</h3>
        <p>
          Dealer registration on Divine Acres is subject to verification and
          approval by the platform administration. Submission of the dealer
          registration form does not guarantee approval.
        </p>
      </section>

      <section style={section}>
        <h3>2. Accuracy of Information</h3>
        <p>
          The dealer confirms that all information provided during registration,
          including personal, business, and contact details, is true, complete,
          and accurate. Any false or misleading information may result in
          rejection or termination of the dealer account.
        </p>
      </section>

      <section style={section}>
        <h3>3. Verification Rights</h3>
        <p>
          Divine Acres reserves the right to verify dealer information through
          calls, emails, document checks, or any other lawful means. Dealers
          agree to cooperate fully during the verification process.
        </p>
      </section>

      <section style={section}>
        <h3>4. Approval & Access</h3>
        <p>
          Until approval is granted, the applicant will not have access to the
          dealer dashboard, listings, leads, or other business-related features
          of the platform.
        </p>
      </section>

      <section style={section}>
        <h3>5. Conduct & Usage</h3>
        <p>
          Dealers must use the platform ethically and lawfully. Any fraudulent
          activity, misuse of data, spam, or behavior harmful to users or the
          platform may lead to immediate suspension or permanent termination.
        </p>
      </section>

      <section style={section}>
        <h3>6. Business Responsibility</h3>
        <p>
          Divine Acres acts only as a technology platform. The company shall not
          be responsible for disputes, losses, or liabilities arising from
          transactions or interactions between dealers and their clients.
        </p>
      </section>

      <section style={section}>
        <h3>7. Modification of Terms</h3>
        <p>
          Divine Acres reserves the right to modify these terms at any time.
          Continued use of the platform after changes implies acceptance of the
          updated terms.
        </p>
      </section>

      <section style={section}>
        <h3>8. Governing Law & Jurisdiction</h3>
        <p>
          These terms shall be governed by and construed in accordance with the
          laws of India. Any dispute, claim, or controversy arising out of or
          relating to dealer registration or use of the platform shall be
          subject to the exclusive jurisdiction of the Hon’ble Bombay High Court
          and courts subordinate thereto at Mumbai.
        </p>
      </section>

      <section style={section}>
        <h3>9. Acceptance</h3>
        <p>
          By applying for dealer registration or using the dealer services,
          you acknowledge that you have read, understood, and agreed to these
          Terms & Conditions in full.
        </p>
      </section>
    </div>
  );
}

/* ================= STYLES ================= */

const wrap = {
  maxWidth: 900,
  margin: "40px auto",
  padding: 24,
  background: "#ffffff",
  borderRadius: 16,
  boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
};

const title = {
  fontSize: 26,
  fontWeight: 800,
  marginBottom: 6,
  color: "#0f172a",
};

const updated = {
  fontSize: 13,
  color: "#64748b",
  marginBottom: 20,
};

const section = {
  marginBottom: 18,
  fontSize: 15,
  lineHeight: 1.6,
  color: "#1f2937",
};
