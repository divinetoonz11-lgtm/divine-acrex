// pages/dealer_dashboard.jsx
import React, { useEffect, useState } from "react";
import DashboardLayout from "../components/DashboardLayout";
import PropertyCard from "../components/PropertyCard";
import { auth, db } from "../firebase/clientApp";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useRouter } from "next/router";

export default function DealerDashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [checking, setChecking] = useState(true);

  // Dummy listings for now
  const [listings, setListings] = useState([
    {
      id: 1,
      title: "2 BHK Apartment in Noida",
      subtitle: "Sector 75, Noida",
      price: "₹56 Lac",
      image: "/placeholder.png",
      status: "For Sale",
      beds: "2 Beds",
      nearby: "Metro • Mall • ATM",
      verified: true,
    },
    {
      id: 2,
      title: "3 BHK Luxury Flat",
      subtitle: "Sector 150, Noida",
      price: "₹96 Lac",
      image: "/placeholder.png",
      status: "Ready to Move",
      beds: "3 Beds",
      nearby: "Park • School",
      verified: false,
    }
  ]);

  // ⚡ Dealer Protection
  useEffect(() => {
    let unsub;
    try {
      unsub = onAuthStateChanged(auth, async (u) => {
        if (!u) {
          router.push("/login/dealer");
          return;
        }
        setUser(u);

        try {
          const ref = doc(db, "users", u.uid);
          const snap = await getDoc(ref);
          const role = snap.exists() ? snap.data().role : null;

          if (role !== "dealer") {
            console.warn("Not dealer, redirecting...");
            router.push("/login/dealer");
            return;
          }
        } catch (e) {
          console.error("Dealer role check failed:", e);
          router.push("/login/dealer");
          return;
        } finally {
          setChecking(false);
        }
      });
    } catch (err) {
      console.error(err);
      router.push("/login/dealer");
    }

    return () => unsub && unsub();
  }, []);

  if (checking) {
    return (
      <div style={{ minHeight: "60vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
        <div>Checking dealer permissions...</div>
      </div>
    );
  }

  return (
    <DashboardLayout title="Dealer Dashboard">
      <h2 style={{ marginBottom: 12 }}>My Listings</h2>

      {listings.length === 0 ? (
        <div style={{ padding: 20, borderRadius: 10, background: "#fff", boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }}>
          No listings added yet.
        </div>
      ) : (
        <div style={{ display: "grid", gap: 16 }}>
          {listings.map((item) => (
            <PropertyCard key={item.id} item={item} />
          ))}
        </div>
      )}

      <div style={{ marginTop: 16 }}>
        <button
          onClick={() => router.push("/post-property")}
          style={{
            padding: "10px 16px",
            background: "#2563eb",
            color: "#fff",
            borderRadius: 8,
            fontWeight: 700,
            border: "none",
            cursor: "pointer"
          }}
        >
          + Add New Property
        </button>
      </div>
    </DashboardLayout>
  );
}
