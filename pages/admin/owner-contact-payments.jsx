import { useEffect, useState } from "react";
import AdminLayout from "../../components/admin/AdminLayout";

export default function OwnerContactPayments() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPayments = async () => {
    try {
      const res = await fetch("/api/admin/get-owner-contact-payments");
      const data = await res.json();
      setPayments(data.payments || []);
    } catch {
      setPayments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const approvePayment = async (id) => {
    if (!confirm("Approve this payment?")) return;

    await fetch("/api/admin/approve-owner-contact-payment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ paymentId: id }),
    });

    fetchPayments();
  };

  const rejectPayment = async (id) => {
    if (!confirm("Reject this payment?")) return;

    await fetch("/api/admin/reject-owner-contact-payment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ paymentId: id }),
    });

    fetchPayments();
  };

  return (
    <AdminLayout>
      <div className="card">
        <h2>Owner Contact Payments</h2>

        {loading ? (
          <p>Loading...</p>
        ) : payments.length === 0 ? (
          <p>No pending payments</p>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>User ID</th>
                <th>Plan</th>
                <th>Credits</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((p) => (
                <tr key={p._id}>
                  <td>{p.userId}</td>
                  <td>{p.plan}</td>
                  <td>{p.credits}</td>
                  <td>₹{p.amount}</td>
                  <td>{p.status}</td>
                  <td>
                    {p.status === "PENDING" && (
                      <>
                        <button
                          className="approve"
                          onClick={() => approvePayment(p._id)}
                        >
                          Approve
                        </button>

                        <button
                          className="reject"
                          onClick={() => rejectPayment(p._id)}
                        >
                          Reject
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <style jsx>{`
        .card {
          background: #fff;
          padding: 30px;
          border-radius: 12px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
        }

        h2 {
          margin-bottom: 20px;
        }

        .table {
          width: 100%;
          border-collapse: collapse;
        }

        .table th,
        .table td {
          padding: 12px;
          border-bottom: 1px solid #e5e7eb;
          text-align: left;
        }

        .approve {
          background: #16a34a;
          color: #fff;
          border: none;
          padding: 6px 12px;
          border-radius: 6px;
          margin-right: 8px;
          cursor: pointer;
        }

        .reject {
          background: #dc2626;
          color: #fff;
          border: none;
          padding: 6px 12px;
          border-radius: 6px;
          cursor: pointer;
        }
      `}</style>
    </AdminLayout>
  );
}
