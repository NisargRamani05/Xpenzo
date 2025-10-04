import React, { useState, useEffect } from "react";
import api from "../../api/axiosConfig";
import toast from "react-hot-toast";
import "../../pages/AuthForm.css"; // Reuse form styles
import "./Dashboard.css"; // Import dashboard styles

const EmployeeDashboard = () => {
  const [expenses, setExpenses] = useState([]);
  const [formData, setFormData] = useState({
    amount: "",
    category: "Other",
    description: "",
    currency: "INR",
  });
  const [loading, setLoading] = useState(true);

  const fetchExpenses = async () => {
    setLoading(true);
    try {
      const res = await api.get("/expenses/my-expenses");
      setExpenses(res.data);
    } catch (err) {
      console.error("Error fetching expenses:", err);
      toast.error("Could not fetch expenses.");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  const { amount, category, description, currency } = formData;
  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/expenses", formData);
      toast.success("Expense submitted successfully!"); // <-- KEPT: The toast notification
      setFormData({
        amount: "",
        category: "Other",
        description: "",
        currency: "INR",
      });
      fetchExpenses();
    } catch (err) {
      console.error("Error submitting expense:", err.response.data);
      toast.error("Error: Could not submit expense."); // <-- KEPT: The error toast
    }
  };

  return (
    <div>
      <h1 style={{ fontSize: "2rem", fontWeight: "bold", marginBottom: "1rem" }}>
        Employee Dashboard
      </h1>

      <div className="dashboard-section">
        <h2>Submit New Expense</h2>
        <div className="auth-form" style={{ maxWidth: "100%", boxShadow: "none", padding: 0 }}>
          <form onSubmit={onSubmit}>
            <div className="form-group">
              <label>Amount</label>
              <input type="number" name="amount" value={amount} onChange={onChange} required />
            </div>
            <div className="form-group">
              <label>Currency (3-letter code, e.g., USD)</label>
              <input type="text" name="currency" value={currency} onChange={onChange} required maxLength="3" />
            </div>
            <div className="form-group">
              <label>Category</label>
              <select name="category" value={category} onChange={onChange}>
                <option value="Travel">Travel</option>
                <option value="Food">Food</option>
                <option value="Supplies">Office Supplies</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea name="description" value={description} onChange={onChange} required rows="3" style={{ width: "100%", padding: "0.75rem", border: "1px solid #ddd", borderRadius: "4px" }}></textarea>
            </div>
            <button type="submit" className="submit-btn">
              Submit Expense
            </button>
          </form>
          {/* <-- REMOVED: The old {message && ...} paragraph is gone */}
        </div>
      </div>

      <div className="dashboard-section">
        <h2>My Expenses</h2>
        {loading && <p>Loading expenses...</p>}
        {!loading && (
          <table className="expenses-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Description</th>
                <th>Original Amount</th>
                <th>Status</th>
                <th>Manager's Comments</th>
              </tr>
            </thead>
            <tbody>
              {expenses.map((expense) => (
                <tr key={expense._id}>
                  <td>{new Date(expense.date).toLocaleDateString()}</td>
                  <td>{expense.description}</td>
                  <td>{expense.amount} {expense.currency}</td>
                  <td>
                    <span className={`status-badge status-${expense.status}`}>
                      {expense.status}
                    </span>
                  </td>
                  <td>{expense.comments}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default EmployeeDashboard;