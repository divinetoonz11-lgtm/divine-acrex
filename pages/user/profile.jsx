import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

export default function UserProfile() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [f, setF] = useState({
    name: "",
    email: "",
    phone: "",
    dob: "",
    address: "",
    state: "",
    city: "",
    profileCompleted: false,
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  /* 🔐 AUTH + ROLE */
  useEffect(() => {
    if (status === "loading") return;
    if (!session) return router.replace("/");
    if (session.user.role !== "user")
      return router.replace("/dealer/dashboard");
  }, [status, session]);

  /* 📥 LOAD PROFILE (AUTO-FILL GOOGLE / MOBILE LOGIN DATA) */
  useEffect(() => {
    if (status !== "authenticated") return;

    (async () => {
      const r = await fetch("/api/user/profile");
      const j = r.ok ? await r.json() : {};

      setF({
        name: j.name || session.user.name || "",
        email: j.email || session.user.email || "",
        phone: j.phone || "",
        dob: j.dob || "",
        address: j.address || "",
        state: j.state || "",
        city: j.city || "",
        profileCompleted: !!j.profileCompleted,
      });

      setLoading(false);
    })();
  }, [status, session]);

  async function save() {
    if (saving) return;

    if (!f.phone || f.phone.length !== 10)
      return setMsg("Mobile number is compulsory");
    if (!f.name || f.name.length < 3)
      return setMsg("Full name required");
    if (!f.address || f.address.length < 5)
      return setMsg("Address required");
    if (!f.city) return setMsg("City required");
    if (!f.state) return setMsg("State required");
    if (!f.dob || f.dob.length !== 10)
      return setMsg("DOB must be DD/MM/YYYY");

    setSaving(true);
    setMsg("");

    const r = await fetch("/api/user/profile", {
      method: "PUT",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ ...f, profileCompleted: true }),
    });

    setSaving(false);

    if (!r.ok) return setMsg("Profile save failed. Try again.");

    setMsg("Profile saved successfully");
    setTimeout(() => router.push("/user/dashboard"), 800);
  }

  if (loading) return <div style={{ padding: 40 }}>Loading…</div>;

  return (
    <div className="page">
      <div className="card">
        <h2>User Profile</h2>
        <p className="sub">
          Your basic details (Google / Mobile login auto-filled)
        </p>

        <div className="grid">
          <Field label="Full Name">
            <input
              value={f.name}
              onChange={(e) => setF({ ...f, name: e.target.value })}
              placeholder="Your full name"
            />
          </Field>

          <Field label="Email ID">
            <input value={f.email} disabled />
          </Field>

          <Field label="Mobile Number *">
            <input
              value={f.phone}
              maxLength={10}
              onChange={(e) =>
                setF({
                  ...f,
                  phone: e.target.value.replace(/[^0-9]/g, ""),
                })
              }
              placeholder="10 digit mobile"
            />
          </Field>

          <Field label="Date of Birth">
            <input
              value={f.dob}
              placeholder="DD/MM/YYYY"
              maxLength={10}
              onChange={(e) => {
                let v = e.target.value.replace(/[^0-9]/g, "");
                if (v.length > 2) v = v.slice(0, 2) + "/" + v.slice(2);
                if (v.length > 5) v = v.slice(0, 5) + "/" + v.slice(5, 9);
                setF({ ...f, dob: v });
              }}
            />
          </Field>

          <Field label="City">
            <input
              value={f.city}
              onChange={(e) => setF({ ...f, city: e.target.value })}
            />
          </Field>

          <Field label="State">
            <input
              value={f.state}
              onChange={(e) => setF({ ...f, state: e.target.value })}
            />
          </Field>
        </div>

        <Field label="Full Address">
          <textarea
            value={f.address}
            onChange={(e) => setF({ ...f, address: e.target.value })}
            placeholder="House no, street, area"
          />
        </Field>

        {msg && (
          <div className={msg.includes("success") ? "ok" : "err"}>
            {msg}
          </div>
        )}

        <button onClick={save} disabled={saving}>
          {saving ? "Saving…" : "Save Profile"}
        </button>
      </div>

      <style jsx>{`
        .page {
          min-height: 100vh;
          background: linear-gradient(135deg, #eef2ff, #f8fafc);
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 20px;
        }
        .card {
          width: 100%;
          max-width: 640px;
          background: #fff;
          padding: 30px;
          border-radius: 20px;
          box-shadow: 0 20px 60px rgba(30, 64, 175, 0.2);
        }
        h2 {
          color: #0a2a5e;
          margin-bottom: 6px;
        }
        .sub {
          font-size: 13px;
          color: #64748b;
          margin-bottom: 22px;
        }
        .grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }
        textarea {
          width: 100%;
          min-height: 90px;
          resize: none;
        }
        input,
        textarea {
          padding: 12px 14px;
          border-radius: 12px;
          border: 1px solid #c7d2fe;
          font-size: 14px;
        }
        button {
          width: 100%;
          margin-top: 20px;
          padding: 15px;
          background: linear-gradient(135deg, #1e40af, #2563eb);
          color: #fff;
          border: none;
          border-radius: 16px;
          font-size: 15px;
          cursor: pointer;
        }
        .ok {
          margin-top: 12px;
          color: #16a34a;
          font-size: 13px;
        }
        .err {
          margin-top: 12px;
          color: #dc2626;
          font-size: 13px;
        }
        @media (max-width: 640px) {
          .grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}

/* ===== SMALL FIELD COMPONENT ===== */
function Field({ label, children }) {
  return (
    <div>
      <label style={{ fontSize: 13, fontWeight: 600, color: "#334155" }}>
        {label}
      </label>
      {children}
    </div>
  );
}
