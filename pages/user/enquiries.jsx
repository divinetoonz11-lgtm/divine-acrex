// pages/user/enquiries.jsx
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function UserEnquiries() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔒 Login guard
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status]);

  // 📩 Load enquiries
  useEffect(() => {
    if (status !== "authenticated") return;

    (async () => {
      try {
        const res = await fetch("/api/user/enquiries");
        const data = res.ok ? await res.json() : [];
        setEnquiries(data || []);
      } finally {
        setLoading(false);
      }
    })();
  }, [status]);

  if (loading) {
    return <div style={{ padding: 30 }}>Loading enquiries…</div>;
  }

  return (
    <div style={{ minHeight: "100vh", background: "#f1f5fb", padding: 20 }}>
      <h2 style={{ marginBottom: 20 }}>My Enquiries</h2>

      {enquiries.length === 0 ? (
        <div
          style={{
            background: "#fff",
            padding: 20,
            borderRadius: 12,
          }}
        >
          You have not made any enquiries yet.
        </div>
      ) : (
        <div style={{ display: "grid", gap: 14 }}>
          {enquiries.map((e) => (
            <div
              key={e._id}
              style={{
                background: "#fff",
                padding: 16,
                borderRadius: 12,
              }}
            >
              <div style={{ fontWeight: 700 }}>
                {e.propertyTitle || "Property Enquiry"}
              </div>

              <div style={{ fontSize: 13, color: "#555", marginTop: 4 }}>
                {e.city || ""} {e.state || ""}
              </div>

              <div style={{ marginTop: 6, fontSize: 13 }}>
                Message: {e.message || "—"}
              </div>

              <div style={{ marginTop: 6, fontSize: 12, color: "#64748b" }}>
                Date:{" "}
                {e.createdAt
                  ? new Date(e.createdAt).toLocaleDateString()
                  : "—"}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
