import { useEffect, useState } from "react";
import AdminLayout from "../../components/admin/AdminLayout";

export default function OwnerContactPlans() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);

  const [form, setForm] = useState({
    name: "",
    contacts: "",
    price: "",
    validityMonths: "",
    active: true,
  });

  /* ================= FETCH PLANS ================= */
  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const res = await fetch("/api/admin/owner-contact-plans");
      const data = await res.json();
      setPlans(data.plans || []);
    } catch (err) {
      console.log("Fetch error");
    }
    setLoading(false);
  };

  /* ================= SAVE PLAN ================= */
  const handleSave = async () => {
    const method = editingPlan ? "PUT" : "POST";

    await fetch("/api/admin/owner-contact-plans", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(
        editingPlan ? { ...form, id: editingPlan._id } : form
      ),
    });

    setShowModal(false);
    setEditingPlan(null);
    setForm({
      name: "",
      contacts: "",
      price: "",
      validityMonths: "",
      active: true,
    });

    fetchPlans();
  };

  /* ================= DELETE ================= */
  const handleDelete = async (id) => {
    if (!confirm("Delete this plan?")) return;

    await fetch(`/api/admin/owner-contact-plans?id=${id}`, {
      method: "DELETE",
    });

    fetchPlans();
  };

  /* ================= TOGGLE ACTIVE ================= */
  const toggleActive = async (plan) => {
    await fetch("/api/admin/owner-contact-plans", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: plan._id,
        ...plan,
        active: !plan.active,
      }),
    });

    fetchPlans();
  };

  return (
    <AdminLayout>
      <div style={wrapper}>
        <div style={headerRow}>
          <h1 style={title}>Owner Contact Plans</h1>
          <button
            style={addBtn}
            onClick={() => {
              setEditingPlan(null);
              setShowModal(true);
            }}
          >
            + Add New Plan
          </button>
        </div>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <div style={grid}>
            {plans.map((plan) => (
              <div key={plan._id} style={card}>
                <div style={cardHeader}>
                  <h3>{plan.name}</h3>
                  <span
                    style={{
                      ...badge,
                      background: plan.active
                        ? "#dcfce7"
                        : "#fee2e2",
                      color: plan.active
                        ? "#166534"
                        : "#991b1b",
                    }}
                  >
                    {plan.active ? "ACTIVE" : "INACTIVE"}
                  </span>
                </div>

                <div style={price}>
                  ₹{plan.price.toLocaleString("en-IN")}
                </div>

                <div style={gst}>Including GST (18%)</div>

                <div style={info}>
                  {plan.contacts} Contacts • {plan.validityMonths} Month Validity
                </div>

                <div style={btnRow}>
                  <button
                    style={editBtn}
                    onClick={() => {
                      setEditingPlan(plan);
                      setForm(plan);
                      setShowModal(true);
                    }}
                  >
                    Edit
                  </button>

                  <button
                    style={toggleBtn}
                    onClick={() => toggleActive(plan)}
                  >
                    {plan.active ? "Deactivate" : "Activate"}
                  </button>

                  <button
                    style={deleteBtn}
                    onClick={() => handleDelete(plan._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ================= MODAL ================= */}
        {showModal && (
          <div style={overlay}>
            <div style={modal}>
              <h3>{editingPlan ? "Edit Plan" : "Create Plan"}</h3>

              <input
                style={input}
                placeholder="Plan Name"
                value={form.name}
                onChange={(e) =>
                  setForm({ ...form, name: e.target.value })
                }
              />

              <input
                style={input}
                type="number"
                placeholder="Contacts"
                value={form.contacts}
                onChange={(e) =>
                  setForm({ ...form, contacts: e.target.value })
                }
              />

              <input
                style={input}
                type="number"
                placeholder="Price"
                value={form.price}
                onChange={(e) =>
                  setForm({ ...form, price: e.target.value })
                }
              />

              <input
                style={input}
                type="number"
                placeholder="Validity (Months)"
                value={form.validityMonths}
                onChange={(e) =>
                  setForm({
                    ...form,
                    validityMonths: e.target.value,
                  })
                }
              />

              <button style={saveBtn} onClick={handleSave}>
                Save Plan
              </button>

              <button
                style={cancelBtn}
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

/* ================= STYLES ================= */

const wrapper = { padding: 10 };
const headerRow = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
};
const title = { fontSize: 28, fontWeight: 900 };

const addBtn = {
  padding: "10px 16px",
  background: "linear-gradient(135deg,#2563eb,#1e3a8a)",
  color: "#fff",
  border: "none",
  borderRadius: 8,
  cursor: "pointer",
  fontWeight: 700,
};

const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))",
  gap: 20,
  marginTop: 20,
};

const card = {
  background: "#fff",
  padding: 20,
  borderRadius: 16,
  boxShadow: "0 10px 30px rgba(0,0,0,.08)",
};

const cardHeader = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
};

const badge = {
  padding: "4px 10px",
  borderRadius: 999,
  fontSize: 12,
  fontWeight: 800,
};

const price = {
  fontSize: 22,
  fontWeight: 900,
  marginTop: 10,
};

const gst = {
  fontSize: 12,
  color: "#64748b",
};

const info = {
  marginTop: 6,
  fontSize: 13,
  color: "#475569",
};

const btnRow = {
  marginTop: 14,
  display: "flex",
  gap: 8,
};

const editBtn = {
  flex: 1,
  padding: "6px",
  background: "#1e40af",
  color: "#fff",
  border: "none",
  borderRadius: 6,
  cursor: "pointer",
};

const toggleBtn = {
  flex: 1,
  padding: "6px",
  background: "#f59e0b",
  color: "#fff",
  border: "none",
  borderRadius: 6,
  cursor: "pointer",
};

const deleteBtn = {
  flex: 1,
  padding: "6px",
  background: "#ef4444",
  color: "#fff",
  border: "none",
  borderRadius: 6,
  cursor: "pointer",
};

const overlay = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,.5)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const modal = {
  background: "#fff",
  padding: 24,
  borderRadius: 16,
  width: 400,
};

const input = {
  width: "100%",
  padding: 10,
  marginTop: 10,
  borderRadius: 8,
  border: "1px solid #ddd",
};

const saveBtn = {
  width: "100%",
  padding: 10,
  marginTop: 14,
  background: "#16a34a",
  color: "#fff",
  border: "none",
  borderRadius: 8,
  fontWeight: 700,
};

const cancelBtn = {
  width: "100%",
  padding: 10,
  marginTop: 8,
  background: "#f1f5f9",
  border: "none",
  borderRadius: 8,
};
