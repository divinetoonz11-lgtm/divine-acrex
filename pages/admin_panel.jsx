// pages/admin_panel.jsx
import React, { useEffect, useState } from "react";
import DashboardLayout from "../components/DashboardLayout";
import StatsCard from "../components/StatsCard";
import { auth, db } from "../firebase/clientApp";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useRouter } from "next/router";

export default function AdminPanel() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [checking, setChecking] = useState(true);
  const [users, setUsers] = useState([
    { id: 1, name: "Ramesh", role: "dealer", email: "ramesh@example.com" },
    { id: 2, name: "Suman", role: "user", email: "suman@example.com" },
  ]);

  useEffect(() => {
    // protect route: require firebase auth + admin role in users/{uid}
    let unsub;
    try {
      unsub = onAuthStateChanged(auth, async (u) => {
        if (!u) {
          // not logged in -> redirect to login
          router.push("/login");
          return;
        }
        setUser(u);

        // check Firestore user doc for role
        try {
          const ref = doc(db, "users", u.uid);
          const snap = await getDoc(ref);
          const role = snap.exists() ? snap.data().role : null;
          if (role !== "admin") {
            // not admin -> redirect to login (or unauthorized page)
            console.warn("User is not admin, redirecting");
            router.push("/login");
            return;
          }
          // OK: admin
        } catch (err) {
          console.error("Error checking user role:", err);
          // on error: safer to redirect or show message
          router.push("/login");
          return;
        } finally {
          setChecking(false);
        }
      });
    } catch (err) {
      console.error("Auth check failed:", err);
      router.push("/login");
    }

    return () => {
      if (unsub) unsub();
    };
  }, []);

  if (checking) {
    return (
      <div style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div>Checking permissions — please wait...</div>
      </div>
    );
  }

  return (
    <DashboardLayout title="Admin Panel">
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, marginBottom: 12 }}>
        <StatsCard title="Total Users" value={users.length} delta="+5" />
        <StatsCard title="Active Dealers" value="24" delta="+1" />
        <StatsCard title="Pending Listings" value="8" delta="-2" />
        <StatsCard title="Revenue (est.)" value="₹1.2L" delta="+12%" />
      </div>

      <section style={{ marginTop: 12 }}>
        <h3 style={{ marginBottom: 12 }}>Recent Users</h3>
        <div style={{ background: "#fff", padding: 12, borderRadius: 10, boxShadow: "0 6px 18px rgba(2,6,23,0.06)" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ textAlign: "left", borderBottom: "1px solid #eef2f7" }}>
                <th style={{ padding: 8 }}>Name</th>
                <th style={{ padding: 8 }}>Email</th>
                <th style={{ padding: 8 }}>Role</th>
                <th style={{ padding: 8 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id}>
                  <td style={{ padding: 8 }}>{u.name}</td>
                  <td style={{ padding: 8 }}>{u.email}</td>
                  <td style={{ padding: 8 }}>{u.role}</td>
                  <td style={{ padding: 8 }}>
                    <button style={smallBtn}>Edit</button>{" "}
                    <button style={{ ...smallBtn, background: "#ef4444", color: "#fff" }}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </DashboardLayout>
  );
}

const smallBtn = { padding: "6px 8px", borderRadius: 6, border: "none", background: "#2563eb", color: "#fff", fontWeight: 700 };
