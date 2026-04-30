import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function BoostListing() {
  const router = useRouter();
  const { propertyId } = router.query;

  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState(1);
  const [boosting, setBoosting] = useState(false);
  const [boostCredits, setBoostCredits] = useState(365);

  const [data, setData] = useState({
    propertyId: "",
    propertyCode: "",
    propertyTitle: "",
    locality: "",
    city: "",
    subscriptionName: "Free Dealer Plan",
    listingBalance: 10,
    creditBalance: 0,
    currentListingCredits: 0,
    agents: 0,
    listings: 0,
    avgBoost: 0,
    topBoostMin: 0,
    topBoostMax: 0,
    top25Avg: 0,
  });

  useEffect(() => {
    if (!router.isReady) return;

    const url = propertyId
      ? `/api/dealer/insights?propertyId=${propertyId}`
      : "/api/dealer/insights";

    fetch(url)
      .then((res) => res.json())
      .then((json) => {
        if (json?.ok) {
          setData({
            propertyId: json.propertyId || propertyId || "",
            propertyCode: json.propertyCode || "",
            propertyTitle: json.propertyTitle || "",
            locality: json.locality || "",
            city: json.city || "",
            subscriptionName: json.subscriptionName || "Free Dealer Plan",
            listingBalance: Number(json.listingBalance || 10),
            creditBalance: Number(json.creditBalance || json.credits || 0),
            currentListingCredits: Number(json.currentListingCredits || 0),
            agents: Number(json.agents || 0),
            listings: Number(json.listings || 0),
            avgBoost: Number(json.avgBoost || 0),
            topBoostMin: Number(json.topBoostMin || 0),
            topBoostMax: Number(json.topBoostMax || 0),
            top25Avg: Number(json.top25Avg || 0),
          });
        }
      })
      .catch(() => alert("Boost data load nahi hua"))
      .finally(() => setLoading(false));
  }, [router.isReady, propertyId]);

  function goToBoostPayment() {
    const credits = Number(boostCredits || 365);
    const pid = data.propertyId || propertyId || "";

    window.location.href = pid
      ? `/dealer/boost-payment?credits=${credits}&propertyId=${pid}`
      : `/dealer/boost-payment?credits=${credits}`;
  }

  async function confirmBoost() {
    const credits = Number(boostCredits || 0);

    if (!data.propertyId) return alert("No active property found.");
    if (credits <= 0) return alert("Enter valid credits.");

    if (credits > Number(data.creditBalance || 0)) {
      goToBoostPayment();
      return;
    }

    setBoosting(true);

    try {
      const res = await fetch("/api/dealer/boost", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ propertyId: data.propertyId, creditsToUse: credits }),
      });

      const json = await res.json();

      if (json?.ok) {
        alert(`Listing Boosted: ${data.propertyCode || "Listing"} successfully boosted.`);
        router.push("/dealer/my-properties");
      } else {
        alert(json?.message || "Boost failed");
      }
    } catch {
      alert("Boost failed");
    } finally {
      setBoosting(false);
    }
  }

  if (loading) return <div style={page}>Loading...</div>;

  const credits = Number(boostCredits || 0);
  const remainingCredits = Number(data.creditBalance || 0) - credits;
  const boostListingValue = credits / 365;
  const remainingListingBalance = Number(data.listingBalance || 0) - boostListingValue;

  return (
    <div style={page}>
      <div style={modal}>
        <div style={header}>
          <div>
            <h2 style={title}>Boost your listing</h2>
            <div style={code}>{data.propertyCode || "AI Listing"}</div>
          </div>

          <button style={closeBtn} onClick={() => router.push("/dealer/my-properties")}>
            ×
          </button>
        </div>

        {step === 1 && (
          <>
            <div style={body}>
              <h3 style={sectionTitle}>Choose Boost Credit Package</h3>

              <p style={desc}>
                Boost credits se aapki property selected locality me zyada visible hogi.
                More credits = better ranking chance.
              </p>

              <div style={selectedListing}>
                <div>
                  <small>Selected Listing</small>
                  <h3 style={{ margin: "6px 0" }}>
                    {data.propertyTitle || "Property Listing"}
                  </h3>
                  <p style={{ margin: 0, color: "#64748b" }}>
                    {data.locality || "Locality not found"}
                    {data.city ? `, ${data.city}` : ""}
                  </p>
                </div>

                <div style={creditPill}>{data.creditBalance} Credits Available</div>
              </div>

              <div style={plans}>
                {[
                  {
                    credits: 365,
                    title: "Basic Boost",
                    listing: "1 Listing",
                    benefit: "Better visibility",
                  },
                  {
                    credits: 1095,
                    title: "Standard Boost",
                    listing: "3 Listings",
                    benefit: "Stronger visibility",
                  },
                  {
                    credits: 1825,
                    title: "Premium Boost",
                    listing: "5 Listings",
                    benefit: "Higher priority visibility",
                  },
                ].map((p) => (
                  <button
                    key={p.credits}
                    style={Number(boostCredits) === p.credits ? activePlan : planCard}
                    onClick={() => setBoostCredits(p.credits)}
                  >
                    <h3 style={{ marginTop: 0 }}>{p.title}</h3>
                    <b>{p.credits} Credits</b>
                    <span style={{ display: "block", marginTop: 8 }}>{p.listing}</span>
                    <p style={{ color: "#64748b" }}>{p.benefit}</p>
                    <strong>Pay ₹{p.credits}</strong>
                  </button>
                ))}
              </div>

              <div style={customBox}>
                <label style={label}>Custom Credit Value</label>
                <input
                  type="number"
                  value={boostCredits}
                  onChange={(e) => setBoostCredits(e.target.value)}
                  style={input}
                />
                <small>Example: 365 credits = 1 listing boost value</small>
              </div>

              <div style={summaryBox}>
                <h3 style={{ marginTop: 0 }}>Selected Boost Summary</h3>
                <div style={row}>
                  <span>Credits Selected</span>
                  <b>{credits} Credits</b>
                </div>
                <div style={row}>
                  <span>Boost Value</span>
                  <b>{boostListingValue.toFixed(1)} Listings</b>
                </div>
                <div style={row}>
                  <span>Pay Amount</span>
                  <b>₹{credits}</b>
                </div>
              </div>
            </div>

            <div style={footer}>
              <span>Step 1 of 2</span>
              <button style={btn} onClick={() => setStep(2)}>
                Next
              </button>
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <div style={body}>
              <h3 style={headline}>
                Data shows {data.locality || "this locality"}
                {data.city ? `, ${data.city}` : ""} has competition!
              </h3>

              <div style={stats}>
                <div style={stat}>
                  <b>{data.agents}</b>
                  <span>Agents</span>
                </div>
                <div style={stat}>
                  <b>{data.listings}</b>
                  <span>Listings</span>
                </div>
                <div style={stat}>
                  <b>{data.avgBoost}</b>
                  <span>Avg. boost</span>
                </div>
                <div style={stat}>
                  <b>
                    {data.topBoostMin}-{data.topBoostMax}
                  </b>
                  <span>Top credits</span>
                </div>
              </div>

              <div style={infoBox}>
                <div style={row}>
                  <span>Your listing credits</span>
                  <b>{data.currentListingCredits} Credits</b>
                </div>
                <div style={row}>
                  <span>Top 5 listings boosted by</span>
                  <b>
                    {data.topBoostMin} - {data.topBoostMax} Credits
                  </b>
                </div>
                <div style={row}>
                  <span>Top 25 avg boost</span>
                  <b>{data.top25Avg} Credits</b>
                </div>
              </div>

              <div style={summaryBox}>
                <h3 style={{ marginTop: 0 }}>Confirm Boost Details</h3>
                <div style={row}>
                  <span>Subscription</span>
                  <b>{data.subscriptionName}</b>
                </div>
                <div style={row}>
                  <span>Boosting</span>
                  <b>
                    {boostListingValue.toFixed(1)} Listings ({credits} Credits)
                  </b>
                </div>
                <div style={row}>
                  <span>Remaining Balance</span>
                  <b style={{ color: remainingCredits < 0 ? "#dc2626" : "#166534" }}>
                    {remainingListingBalance.toFixed(1)} Listings ({remainingCredits} Credits)
                  </b>
                </div>
              </div>

              <small style={note}>
                Note: Boosting may increase visibility, but does not guarantee responses.
              </small>
            </div>

            <div style={footer}>
              <button style={outlineBtn} onClick={() => setStep(1)}>
                Previous
              </button>

              {remainingCredits < 0 ? (
                <button style={dangerBtn} onClick={goToBoostPayment}>
                  Buy {credits} Credits / Pay ₹{credits}
                </button>
              ) : (
                <button style={btn} onClick={confirmBoost} disabled={boosting}>
                  {boosting ? "Boosting..." : "Confirm Boost"}
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

const page = {
  minHeight: "100vh",
  background: "#eef2f7",
  padding: "50px 20px",
  fontFamily: "Arial, sans-serif",
  display: "flex",
  justifyContent: "center",
};

const modal = {
  width: "100%",
  maxWidth: 980,
  background: "#fff",
  borderRadius: 18,
  boxShadow: "0 18px 60px rgba(15,23,42,0.18)",
  overflow: "hidden",
};

const header = {
  padding: "24px 30px",
  borderBottom: "1px solid #e5e7eb",
  display: "flex",
  justifyContent: "space-between",
};

const title = { margin: 0, fontSize: 26, fontWeight: 900 };
const code = { marginTop: 6, color: "#64748b", fontWeight: 700 };

const closeBtn = {
  width: 36,
  height: 36,
  borderRadius: "50%",
  border: "1px solid #ddd",
  background: "#fff",
  fontSize: 22,
  cursor: "pointer",
};

const body = { padding: 30 };
const sectionTitle = { marginTop: 0, fontSize: 22, fontWeight: 900 };
const desc = { color: "#64748b", marginBottom: 20 };

const selectedListing = {
  display: "flex",
  justifyContent: "space-between",
  gap: 20,
  background: "#f8fafc",
  border: "1px solid #e5e7eb",
  borderRadius: 16,
  padding: 18,
  marginBottom: 20,
};

const creditPill = {
  background: "#eff6ff",
  color: "#1d4ed8",
  padding: "10px 14px",
  borderRadius: 20,
  fontWeight: 800,
  height: "fit-content",
};

const plans = {
  display: "grid",
  gridTemplateColumns: "repeat(3, 1fr)",
  gap: 16,
  marginBottom: 20,
};

const planCard = {
  textAlign: "left",
  background: "#fff",
  border: "1px solid #cbd5e1",
  borderRadius: 16,
  padding: 18,
  cursor: "pointer",
};

const activePlan = {
  ...planCard,
  border: "2px solid #2563eb",
  background: "#eff6ff",
};

const customBox = {
  background: "#fff",
  border: "1px solid #e5e7eb",
  borderRadius: 16,
  padding: 18,
  marginBottom: 20,
};

const label = { display: "block", fontWeight: 800, marginBottom: 8 };

const input = {
  width: "100%",
  padding: 14,
  border: "1px solid #cbd5e1",
  borderRadius: 12,
  fontSize: 16,
};

const stats = {
  display: "grid",
  gridTemplateColumns: "repeat(4,1fr)",
  gap: 14,
  marginBottom: 20,
};

const stat = {
  background: "#f8fafc",
  border: "1px solid #e5e7eb",
  borderRadius: 14,
  padding: 18,
  textAlign: "center",
  display: "grid",
  gap: 6,
};

const headline = { marginTop: 0, fontSize: 21, fontWeight: 900 };

const infoBox = {
  border: "1px solid #e5e7eb",
  borderRadius: 14,
  padding: "12px 18px",
  marginBottom: 18,
};

const summaryBox = {
  background: "#f0f9ff",
  border: "1px solid #bae6fd",
  borderRadius: 16,
  padding: 18,
};

const row = {
  display: "flex",
  justifyContent: "space-between",
  gap: 18,
  padding: "12px 0",
  borderBottom: "1px solid #e5e7eb",
  fontSize: 14,
};

const note = { display: "block", marginTop: 12, color: "#64748b" };

const footer = {
  borderTop: "1px solid #e5e7eb",
  padding: "18px 30px",
  display: "flex",
  justifyContent: "space-between",
};

const btn = {
  minWidth: 150,
  padding: "13px 20px",
  border: 0,
  borderRadius: 10,
  background: "#2563eb",
  color: "#fff",
  fontWeight: 900,
  cursor: "pointer",
};

const outlineBtn = {
  ...btn,
  background: "#fff",
  color: "#2563eb",
  border: "1px solid #2563eb",
};

const dangerBtn = { ...btn, background: "#dc2626" };