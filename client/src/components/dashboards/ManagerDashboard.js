import React, { useState, useEffect } from "react";
import api from "../../api/axiosConfig";
import toast from "react-hot-toast";
import "./Dashboard.css";

const ManagerDashboard = () => {
  const [pendingExpenses, setPendingExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState({ subordinateCount: 0 });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [expensesRes, summaryRes] = await Promise.all([
        api.get('/expenses/pending-for-me'), // <-- UPDATED ROUTE
        api.get('/analytics/manager')
      ]);
      setPendingExpenses(expensesRes.data);
      setSummary(summaryRes.data);
    } catch (err) {
      console.error("Error fetching manager data:", err);
      toast.error("Could not fetch dashboard data.");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleUpdateStatus = async (expenseId, newStatus) => {
    const comments = newStatus === "Approved" ? "Approved by manager." : "Rejected by manager.";
    try {
      await api.put(`/expenses/${expenseId}/status`, { status: newStatus, comments });
      toast.success(`Expense has been ${newStatus.toLowerCase()}.`);
      fetchData(); // Refetch all data after an action
    } catch (err) {
      toast.error("Error: Could not update status.");
    }
  };

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-gray-800">Manager Dashboard</h1>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-lg font-semibold text-gray-600">Employees Reporting to You</h2>
        <p className="text-4xl font-bold text-gray-800 mt-2">{summary.subordinateCount}</p>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Expenses Awaiting Your Approval</h2>
        {loading ? <p>Loading expenses...</p> : (
            <div className="overflow-x-auto relative">
                <table className="w-full text-sm text-left text-gray-500">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                        <tr>
                            <th scope="col" className="py-3 px-6">Date</th>
                            <th scope="col" className="py-3 px-6">Submitted By</th>
                            <th scope="col" className="py-3 px-6">Description</th>
                            <th scope="col" className="py-3 px-6">Original Amount</th>
                            <th scope="col" className="py-3 px-6">Amount ({pendingExpenses[0]?.companyCurrency || 'Default'})</th>
                            <th scope="col" className="py-3 px-6">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pendingExpenses.length > 0 ? (
                            pendingExpenses.map((expense) => (
                                <tr key={expense._id} className="bg-white border-b hover:bg-gray-50">
                                    <td className="py-4 px-6">{new Date(expense.date).toLocaleDateString()}</td>
                                    <td className="py-4 px-6 font-medium text-gray-900">{expense.submittedBy.name}</td>
                                    <td className="py-4 px-6">{expense.description}</td>
                                    <td className="py-4 px-6">{expense.amount} {expense.currency}</td>
                                    <td className="py-4 px-6">{expense.convertedAmount}</td>
                                    <td className="py-4 px-6 flex items-center gap-2">
                                        <button onClick={() => handleUpdateStatus(expense._id, "Approved")} className="px-3 py-1 text-xs font-medium text-center text-white bg-green-600 rounded-lg hover:bg-green-700">Approve</button>
                                        <button onClick={() => handleUpdateStatus(expense._id, "Rejected")} className="px-3 py-1 text-xs font-medium text-center text-white bg-red-600 rounded-lg hover:bg-red-700">Reject</button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr className="bg-white border-b">
                                <td colSpan="6" className="py-4 px-6 text-center text-gray-500">No expenses are awaiting your approval.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        )}
      </div>
    </div>
  );
};

export default ManagerDashboard;