// components/Footer.jsx
import React from "react";

export default function Footer() {
  return (
    <footer style={styles.footer}>
      <div style={styles.container}>

        {/* COLUMN 1 */}
        <div style={styles.column}>
          <h3 style={styles.heading}>DivineAcrex</h3>
          <p style={styles.text}>Email: divinetoonz11@gmail.com</p>
          <p style={styles.text}>Mobile: 9867402515</p>
          <p style={styles.text}>Head Office: Mumbai, Maharashtra</p>
        </div>

        {/* COLUMN 2 */}
        <div style={styles.column}>
          <h4 style={styles.subHeading}>Company</h4>
          <p style={styles.link}>About Us</p>
          <p style={styles.link}>Contact Us</p>
          <p style={styles.link}>Careers</p>
          <p style={styles.link}>Terms & Conditions</p>
        </div>

        {/* COLUMN 3 */}
        <div style={styles.column}>
          <h4 style={styles.subHeading}>Explore</h4>
          <p style={styles.link}>Buy Property</p>
          <p style={styles.link}>Rent Property</p>
          <p style={styles.link}>Commercial Spaces</p>
          <p style={styles.link}>Post Property</p>
        </div>

      </div>

      <div style={styles.copyRight}>
        © 2025 DivineAcrex. All rights reserved.
      </div>
    </footer>
  );
}

const styles = {
  footer: {
    background: "#0d1b2a",
    color: "#fff",
    padding: "30px 0 10px 0",
    marginTop: "40px",
  },
  container: {
    display: "flex",
    flexWrap: "wrap",
    maxWidth: "1200px",
    margin: "0 auto",
    gap: "30px",
    padding: "0 20px",
  },
  column: {
    flex: "1",
    minWidth: "220px",
  },
  heading: {
    fontSize: "20px",
    marginBottom: "10px",
    fontWeight: "700",
  },
  subHeading: {
    fontSize: "16px",
    marginBottom: "10px",
    fontWeight: "600",
  },
  text: {
    margin: "4px 0",
    fontSize: "14px",
    opacity: 0.9,
  },
  link: {
    margin: "4px 0",
    fontSize: "14px",
    cursor: "pointer",
    opacity: "0.85",
  },
  copyRight: {
    textAlign: "center",
    marginTop: "25px",
    paddingTop: "10px",
    borderTop: "1px solid #233142",
    fontSize: "13px",
    opacity: 0.8,
  },
};
