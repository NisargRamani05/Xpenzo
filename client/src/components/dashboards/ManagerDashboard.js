import React, { useState, useEffect } from "react";
import api from "../../api/axiosConfig";
import toast from "react-hot-toast";
import HistoryModal from "../HistoryModal";

const ManagerDashboard = () => {
  const [pendingExpenses, setPendingExpenses] = useState([]);
  const [completedExpenses, setCompletedExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState({ subordinateCount: 0 });
  const [historyModalExpense, setHistoryModalExpense] = useState(null);
  const [activeView, setActiveView] = useState("pending"); // 'overview', 'pending', 'completed'

  const fetchData = async () => {
    setLoading(true);
    try {
      const [expensesRes, summaryRes, completedRes] = await Promise.all([
        api.get("/expenses/pending-for-me"),
        api.get("/analytics/manager"),
        api.get("/expenses/completed"),
      ]);
      setPendingExpenses(expensesRes.data);
      setSummary(summaryRes.data);
      setCompletedExpenses(completedRes.data);
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
    const comments =
      newStatus === "Approved"
        ? "Approved by manager."
        : "Rejected by manager.";
    try {
      await api.put(`/expenses/${expenseId}/status`, { status: newStatus, comments });
      toast.success(`Expense has been ${newStatus.toLowerCase()}.`);
      fetchData();
    } catch (err) {
      toast.error("Error: Could not update status.");
    }
  };

  const getStatusBadgeClasses = (status) => {
    const base = "px-2.5 py-1 text-xs font-semibold rounded-full inline-block";
    if (status === "Approved") return `${base} bg-emerald-100 text-emerald-800`;
    if (status === "Rejected") return `${base} bg-red-100 text-red-800`;
    return `${base} bg-amber-100 text-amber-800`;
  };

  return (
    <div className="p-8 bg-[#073737] h-[91.4vh]">
      <HistoryModal
        expense={historyModalExpense}
        onClose={() => setHistoryModalExpense(null)}
      />

      <h1 className="text-3xl font-bold text-[#FDFFD4] mb-8">
        Manager Dashboard
      </h1>

      <div className="flex flex-col md:flex-row gap-8 items-start">
        {/* Sidebar Navigation */}
        <aside className="w-full md:w-64 bg-[#FDFFD4] p-4 rounded-lg shadow-md border border-gray-200 flex-shrink-0">
          <nav className="space-y-0">
            
            <button
              onClick={() => setActiveView("pending")}
              className={`w-full text-left p-3 font-semibold border-b border-gray-300 transition-colors duration-200 ${
                activeView === "pending"
                  ? "bg-teal-50 text-[#073737]"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              Pending Approvals
            </button>
            <button
              onClick={() => setActiveView("completed")}
              className={`w-full text-left p-3 font-semibold border-b border-gray-300 transition-colors duration-200 ${
                activeView === "completed"
                  ? "bg-teal-50 text-[#073737]"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              Completed History
            </button>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 w-full">
          {/* --- Overview --- */}
          {activeView === "overview" && (
            <div className="bg-[#FDFFD4] p-8 rounded-lg shadow-md border border-gray-200 h-[72vh] flex flex-col items-center justify-center">
              <h2 className="text-2xl font-bold text-[#073737] mb-4">
                Employees Reporting to You
              </h2>
              <p className="text-6xl font-bold text-[#073737]">
                {summary.subordinateCount}
              </p>
            </div>
          )}

          {/* --- Pending Approvals --- */}
          {activeView === "pending" && (
            <div className="bg-[#FDFFD4] rounded-lg shadow-md border border-gray-200 h-[72vh] overflow-y-auto">
              <div className="p-8">
                <h2 className="text-2xl font-bold text-[#073737]">
                  Expenses Awaiting Your Approval
                </h2>
              </div>
              {loading ? (
                <p className="text-gray-600 px-8">Loading expenses...</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left text-gray-500">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 sticky top-0">
                      <tr>
                        <th className="py-3 px-6 whitespace-nowrap">Date</th>
                        <th className="py-3 px-6">Submitted By</th>
                        <th className="py-3 px-6">Description</th>
                        <th className="py-3 px-6">Original Amount</th>
                        <th className="py-3 px-6">
                          Amount ({pendingExpenses[0]?.companyCurrency || "Default"})
                        </th>
                        <th className="py-3 px-6">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-[#FDFFD4]">
                      {pendingExpenses.length > 0 ? (
                        pendingExpenses.map((expense) => (
                          <tr
                            key={expense._id}
                            className="border-b hover:bg-gray-50"
                          >
                            <td className="py-4 px-6 whitespace-nowrap text-gray-800">
                              {new Date(expense.date).toLocaleDateString()}
                            </td>
                            <td className="py-4 px-6 font-medium text-gray-900">
                              {expense.submittedBy.name}
                            </td>
                            <td className="py-4 px-6 text-gray-800">
                              {expense.description}
                            </td>
                            <td className="py-4 px-6 text-gray-800 whitespace-nowrap">
                              {expense.amount} {expense.currency}
                            </td>
                            <td className="py-4 px-6 text-gray-800">
                              {expense.convertedAmount}
                            </td>
                            <td className="py-4 px-6 flex items-center gap-2">
                              <button
                                onClick={() =>
                                  handleUpdateStatus(expense._id, "Approved")
                                }
                                className="px-3 py-1 text-xs font-medium text-white bg-green-600 rounded-lg hover:bg-green-700"
                              >
                                Approve
                              </button>
                              <button
                                onClick={() =>
                                  handleUpdateStatus(expense._id, "Rejected")
                                }
                                className="px-3 py-1 text-xs font-medium text-white bg-red-600 rounded-lg hover:bg-red-700"
                              >
                                Reject
                              </button>
                              <button
                                onClick={() => setHistoryModalExpense(expense)}
                                className="px-3 py-1 text-xs font-medium text-gray-900 bg-gray-200 rounded-lg hover:bg-gray-300"
                              >
                                History
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td
                            colSpan="6"
                            className="py-10 text-center text-gray-500"
                          >
                            No expenses are awaiting your approval.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* --- Completed History --- */}
          {activeView === "completed" && (
            <div className="bg-[#FDFFD4] rounded-lg shadow-md border border-gray-200 h-[72vh] overflow-y-auto">
              <div className="p-8">
                <h2 className="text-2xl font-bold text-[#073737]">
                  Completed Expense History
                </h2>
              </div>
              {loading ? (
                <p className="text-gray-600 px-8">Loading history...</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left text-gray-500">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 sticky top-0">
                      <tr>
                        <th className="py-3 px-6">Submitted By</th>
                        <th className="py-3 px-6">Amount</th>
                        <th className="py-3 px-6">Final Status</th>
                        <th className="py-3 px-6">View</th>
                      </tr>
                    </thead>
                    <tbody className="bg-[#FDFFD4]">
                      {completedExpenses.length > 0 ? (
                        completedExpenses.map((expense) => (
                          <tr
                            key={expense._id}
                            className="border-b hover:bg-gray-50"
                          >
                            <td className="py-4 px-6 font-medium text-gray-900">
                              {expense.submittedBy.name}
                            </td>
                            <td className="py-4 px-6 text-gray-800 whitespace-nowrap">
                              {expense.amount} {expense.currency}
                            </td>
                            <td className="py-4 px-6">
                              <span className={getStatusBadgeClasses(expense.status)}>
                                {expense.status}
                              </span>
                            </td>
                            <td className="py-4 px-6">
                              <button
                                onClick={() => setHistoryModalExpense(expense)}
                                className="px-3 py-1 text-xs font-medium text-gray-900 bg-gray-200 rounded-lg hover:bg-gray-300"
                              >
                                History
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td
                            colSpan="4"
                            className="py-10 text-center text-gray-500"
                          >
                            No completed expenses available.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default ManagerDashboard;
