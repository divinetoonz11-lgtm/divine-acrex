import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function OwnerContactStatus() {
  const router = useRouter();
  const { id } = router.query;

  const [status, setStatus] = useState("PENDING");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    (async () => {
      try {
        const res = await fetch(`/api/user/check-owner-contact-status?id=${id}`);
        const data = await res.json();

        if (data?.active) {
          setStatus("ACTIVE");
        } else {
          setStatus("PENDING");
        }
      } catch {
        setStatus("PENDING");
      }

      setLoading(false);
    })();
  }, [id]);

  if (loading) {
    return (
      <div style={{ padding: 40 }}>
        Checking payment status…
      </div>
    );
  }

  return (
    <div style={wrap}>
      <div style={card}>
        {status === "PENDING" && (
          <>
            <h2>Payment Received</h2>

            <p style={muted}>
              Your payment is under verification.
            </p>

            <div style={badgePending}>
              PENDING VERIFICATION
            </div>

            <p style={small}>
              Contact will unlock after admin approval.
            </p>
          </>
        )}

        {status === "ACTIVE" && (
          <>
            <h2>Contact Unlocked 🎉</h2>

            <div style={badgeActive}>
              ACTIVE
            </div>

            <p style={small}>
              You can now view owner contact details.
            </p>
          </>
        )}

        <button
          style={btn}
          onClick={() => router.push(`/property/${id}`)}
        >
          Back to Property
        </button>
      </div>
    </div>
  );
}

/* ================= STYLES ================= */

const wrap = {
  minHeight: "100vh",
  background: "#f6f8fb",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const card = {
  maxWidth: 420,
  background: "#fff",
  padding: 28,
  borderRadius: 18,
  textAlign: "center",
  boxShadow: "0 12px 30px rgba(0,0,0,.1)",
};

const muted = {
  fontSize: 14,
  color: "#475569",
};

const small = {
  fontSize: 13,
  color: "#64748b",
  marginTop: 8,
};

const badgePending = {
  margin: "14px auto",
  padding: "8px 16px",
  borderRadius: 999,
  background: "#fef9c3",
  color: "#854d0e",
  fontWeight: 900,
  display: "inline-block",
};

const badgeActive = {
  margin: "14px auto",
  padding: "8px 16px",
  borderRadius: 999,
  background: "#dcfce7",
  color: "#166534",
  fontWeight: 900,
  display: "inline-block",
};

const btn = {
  width: "100%",
  padding: 14,
  marginTop: 16,
  background: "#1e40af",
  color: "#fff",
  border: "none",
  borderRadius: 12,
  fontWeight: 800,
  cursor: "pointer",
};
