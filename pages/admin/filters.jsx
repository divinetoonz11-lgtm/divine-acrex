// pages/admin/filters.jsx
import { useState, useEffect, useRef } from "react";
import AdminGuard from "../../components/AdminGuard";

function FiltersPage() {
  const [filters, setFilters] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editData, setEditData] = useState(null);
  const [deleteItem, setDeleteItem] = useState(null);
  const [showDelete, setShowDelete] = useState(false);
  const [loading, setLoading] = useState(false);
  const nameRef = useRef(null);

  useEffect(() => { loadFilters(); }, []);

  async function loadFilters() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/filters/get", {
        headers: { "x-admin-key": sessionStorage.getItem("admin_key") || process.env.NEXT_PUBLIC_ADMIN_KEY },
      });
      const data = await res.json();
      if (res.ok) setFilters(data.filters || []);
      else {
        setFilters([]);
        console.warn("Load filters error:", data.error);
      }
    } catch (err) {
      console.warn("Failed to load filters:", err);
      setFilters([]);
    } finally {
      setLoading(false);
    }
  }

  const openAdd = () => { setEditData(null); setShowForm(true); };
  const openEdit = (item) => { setEditData(item); setShowForm(true); };
  const askDelete = (item) => { setDeleteItem(item); setShowDelete(true); };

  const doDelete = async () => {
    if (!deleteItem) return;
    try {
      const res = await fetch("/api/admin/filters/delete", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "x-admin-key": sessionStorage.getItem("admin_key") || process.env.NEXT_PUBLIC_ADMIN_KEY,
        },
        body: JSON.stringify({ id: deleteItem._id }),
      });
      const data = await res.json();
      if (res.ok) {
        setFilters(prev => prev.filter(f => f._id !== deleteItem._id));
      } else {
        alert(data.error || "Delete failed");
      }
    } catch (err) {
      alert("Delete failed: " + err.message);
    } finally {
      setShowDelete(false);
      setDeleteItem(null);
    }
  };

  return (
    <div style={{ padding: 18, maxWidth: 1100, margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, marginBottom: 18 }}>
        <h2 style={{ margin: 0 }}>Filters</h2>
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={openAdd} style={btnPrimary}>+ Add Filter</button>
          <button onClick={loadFilters} style={btnSecondary}>{loading ? "Refreshing..." : "Refresh"}</button>
        </div>
      </div>

      <div style={{ overflowX: "auto", background: "#fff", borderRadius: 8, boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 680 }}>
          <thead style={{ background: "#f8fafc" }}>
            <tr>
              <th style={th}>Name</th>
              <th style={th}>Type</th>
              <th style={th}>Values</th>
              <th style={th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filters.map(f => (
              <tr key={f._id} style={{ borderBottom: "1px solid #eef2f6" }}>
                <td style={td}>{f.name}</td>
                <td style={td}>{f.type}</td>
                <td style={td}>{(f.values || []).join(", ")}</td>
                <td style={td}>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button onClick={() => openEdit(f)} style={btnEdit}>Edit</button>
                    <button onClick={() => askDelete(f)} style={btnDanger}>Delete</button>
                  </div>
                </td>
              </tr>
            ))}
            {filters.length === 0 && (
              <tr>
                <td colSpan={4} style={{ textAlign: "center", padding: 20 }}>{loading ? "Loading..." : "No filters yet."}</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add / Edit Modal */}
      {showForm && (
        <Modal onClose={() => setShowForm(false)}>
          <FilterForm
            initial={editData}
            onClose={() => setShowForm(false)}
            onSaved={(saved) => {
              if (editData) {
                setFilters(prev => prev.map(p => (p._id === saved._id ? saved : p)));
              } else {
                const id = saved._id || Date.now().toString();
                setFilters(prev => [{ _id: id, ...saved }, ...prev]);
              }
            }}
            inputRef={nameRef}
          />
        </Modal>
      )}

      {/* Delete Confirm Modal */}
      {showDelete && (
        <Modal onClose={() => setShowDelete(false)}>
          <div style={{ padding: 18 }}>
            <h3 style={{ marginTop: 0 }}>Confirm Delete</h3>
            <p>Are you sure you want to delete <strong>{deleteItem?.name}</strong>?</p>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 12 }}>
              <button onClick={() => setShowDelete(false)} style={btnCancel}>Cancel</button>
              <button onClick={doDelete} style={btnDanger}>Delete</button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

/* FilterForm with API calls */
function FilterForm({ initial, onClose, onSaved, inputRef }) {
  const [name, setName] = useState(initial?.name || "");
  const [type, setType] = useState(initial?.type || "text");
  const [values, setValues] = useState((initial?.values || []).join(", "));
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setTimeout(() => inputRef?.current?.focus && inputRef.current.focus(), 80);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    const payload = { name: name.trim(), type, values: values.split(",").map(v => v.trim()).filter(Boolean) };

    try {
      if (initial && initial._id) {
        const res = await fetch("/api/admin/filters/edit", {
          method: "PUT",
          headers: { "Content-Type": "application/json", "x-admin-key": sessionStorage.getItem("admin_key") || process.env.NEXT_PUBLIC_ADMIN_KEY },
          body: JSON.stringify({ id: initial._id, ...payload }),
        });
        const data = await res.json();
        if (res.ok) onSaved(data.filter || { _id: initial._id, ...payload });
        else alert(data.error || "Update failed");
      } else {
        const res = await fetch("/api/admin/filters/add", {
          method: "POST",
          headers: { "Content-Type": "application/json", "x-admin-key": sessionStorage.getItem("admin_key") || process.env.NEXT_PUBLIC_ADMIN_KEY },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (res.ok) onSaved(data.filter || payload);
        else alert(data.error || "Add failed");
      }
    } catch (err) {
      alert("Save failed: " + err.message);
    } finally {
      setSaving(false);
      onClose();
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: "grid", gap: 10, width: "100%" }}>
      <label style={label}>Filter Name</label>
      <input ref={inputRef} value={name} onChange={e => setName(e.target.value)} required style={input} />

      <label style={label}>Type</label>
      <select value={type} onChange={e => setType(e.target.value)} style={input}>
        <option value="text">Text</option>
        <option value="select">Select</option>
        <option value="range">Range</option>
        <option value="boolean">Boolean</option>
      </select>

      <label style={label}>Values (comma separated)</label>
      <input value={values} onChange={e => setValues(e.target.value)} placeholder="e.g. 1,2,3 or Furnished,Unfurnished" style={input} />

      <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 8 }}>
        <button type="button" onClick={onClose} style={btnCancel}>Cancel</button>
        <button type="submit" style={btnPrimary} disabled={saving}>{saving ? "Saving..." : "Save"}</button>
      </div>
    </form>
  );
}

/* Modal component with click outside to close */
function Modal({ children, onClose }) {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  return (
    <div style={modalOuter} onMouseDown={(e) => { if (e.target === e.currentTarget) onClose && onClose(); }}>
      <div style={modalBox} role="dialog" aria-modal="true">{children}</div>
    </div>
  );
}

/* wrap with AdminGuard */
export default function FiltersWithGuard(props) {
  return (
    <AdminGuard>
      <FiltersPage {...props} />
    </AdminGuard>
  );
}

/* Styles */
const th = { textAlign: "left", padding: "12px 14px", fontSize: 13, color: "#374151" };
const td = { padding: "12px 14px", fontSize: 14, color: "#111827" };

const btnPrimary = { padding: "8px 14px", background: "#27457a", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer" };
const btnSecondary = { padding: "8px 12px", background: "#f3f4f6", color: "#111827", border: "1px solid #e5e7eb", borderRadius: 6, cursor: "pointer" };
const btnEdit = { padding: "6px 10px", background: "#0b1c33", color: "#fff", borderRadius: 6, border: "none", cursor: "pointer" };
const btnDanger = { padding: "6px 10px", background: "#ef4444", color: "#fff", borderRadius: 6, border: "none", cursor: "pointer" };
const btnCancel = { padding: "6px 10px", background: "#e5e7eb", color: "#111827", borderRadius: 6, border: "none", cursor: "pointer" };

const input = { padding: "8px 10px", borderRadius: 6, border: "1px solid #d1d5db", width: "100%", boxSizing: "border-box" };
const label = { fontSize: 13, color: "#374151" };

const modalOuter = { position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1200, padding: 16 };
const modalBox = { width: "min(520px, 98%)", background: "#fff", borderRadius: 10, padding: 18, boxShadow: "0 6px 32px rgba(16,24,40,0.18)" };
