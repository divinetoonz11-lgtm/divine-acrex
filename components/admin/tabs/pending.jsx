import { useEffect, useState } from "react";

export default function PendingTab() {
  const [data, setData] = useState({
    dealers: [],
    properties: [],
    subscriptions: [],
  });

  useEffect(() => {
    Promise.all([
      fetch("/api/admin/dealers?status=PENDING").then(r => r.json()),
      fetch("/api/admin/properties?status=PENDING").then(r => r.json()),
      fetch("/api/admin/subscriptions?status=PENDING").then(r => r.json()),
    ]).then(([d1, d2, d3]) => {
      setData({
        dealers: d1.dealers || [],
        properties: d2.properties || d2.data || [],
        subscriptions: d3.subscriptions || [],
      });
    });
  }, []);

  return (
    <div className="admin-card">
      <h3>Pending Approvals</h3>

      <Section title="Pending Dealers" rows={data.dealers} cols={["name","email","mobile"]} />
      <Section title="Pending Properties" rows={data.properties} cols={["title","city","price"]} />
      <Section title="Pending Subscriptions" rows={data.subscriptions} cols={["plan","amount","status"]} />
    </div>
  );
}

function Section({ title, rows, cols }) {
  if (!rows.length) return null;

  return (
    <>
      <h4 style={{ marginTop: 20 }}>{title}</h4>
      <table className="admin-table" width="100%">
        <thead>
          <tr>{cols.map(c => <th key={c}>{c}</th>)}</tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i}>
              {cols.map(c => <td key={c}>{r[c]}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
