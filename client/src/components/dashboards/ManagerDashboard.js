import React, { useState, useEffect } from "react";
import api from "../../api/axiosConfig";
import toast from "react-hot-toast";
import "./Dashboard.css";

const ManagerDashboard = () => {
  const [pendingExpenses, setPendingExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPendingExpenses = async () => {
    setLoading(true);
    try {
      const res = await api.get("/expenses/team-expenses");
      setPendingExpenses(res.data);
    } catch (err) {
      console.error("Error fetching pending expenses:", err);
      toast.error("Could not fetch pending expenses.");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPendingExpenses();
  }, []);

  const handleUpdateStatus = async (expenseId, newStatus) => {
    const comments = newStatus === "Approved" ? "Approved by manager." : "Rejected by manager.";
    try {
      await api.put(`/expenses/${expenseId}/status`, { status: newStatus, comments });
      toast.success(`Expense has been ${newStatus.toLowerCase()}.`); // <-- KEPT: The toast
      fetchPendingExpenses();
    } catch (err) {
      console.error("Error updating expense status:", err);
      toast.error("Error: Could not update status."); // <-- KEPT: The error toast
    }
  };

  return (
    <div>
      <h1 style={{ fontSize: "2rem", fontWeight: "bold", marginBottom: "1rem" }}>
        Manager Dashboard
      </h1>
      <div className="dashboard-section">
        <h2>Pending Team Expenses</h2>
        {loading && <p>Loading team expenses...</p>}
        {!loading && (
          <table className="expenses-table">
            <thead>
              {/* <-- CORRECTED: Added missing headers for alignment --> */}
              <tr>
                <th>Date</th>
                <th>Submitted By</th>
                <th>Description</th>
                <th>Category</th>
                <th>Original Amount</th>
                <th>Amount ({pendingExpenses[0]?.companyCurrency || "Default"})</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {pendingExpenses.length > 0 ? (
                pendingExpenses.map((expense) => (
                  <tr key={expense._id}>
                    <td>{new Date(expense.date).toLocaleDateString()}</td>
                    <td>{expense.submittedBy.name}</td>
                    <td>{expense.description}</td>
                    <td>{expense.category}</td>
                    <td>{expense.amount} {expense.currency}</td>
                    <td>{expense.convertedAmount}</td>
                    <td>
                      <button onClick={() => handleUpdateStatus(expense._id, "Approved")} style={{ marginRight: "0.5rem", padding: "0.3rem 0.6rem", border: "none", borderRadius: "4px", backgroundColor: "#10b981", color: "white", cursor: "pointer" }}>
                        Approve
                      </button>
                      <button onClick={() => handleUpdateStatus(expense._id, "Rejected")} style={{ padding: "0.3rem 0.6rem", border: "none", borderRadius: "4px", backgroundColor: "#ef4444", color: "white", cursor: "pointer" }}>
                        Reject
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" style={{ textAlign: "center", padding: "2rem" }}>No pending expenses.</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default ManagerDashboard;