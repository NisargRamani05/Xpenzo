import React, { useState, useEffect } from "react";
import api from "../../api/axiosConfig";
import toast from "react-hot-toast";
import "../../pages/AuthForm.css";
import "./Dashboard.css";

const EmployeeDashboard = () => {
  const [expenses, setExpenses] = useState([]);
  const [formData, setFormData] = useState({
    amount: "",
    category: "Other",
    description: "",
    currency: "INR",
  });
  const [loading, setLoading] = useState(true);
  const [receiptFile, setReceiptFile] = useState(null);
  const [isScanning, setIsScanning] = useState(false);

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

  const handleFileChange = (e) => {
    setReceiptFile(e.target.files[0]);
  };

  const handleScanReceipt = async () => {
    if (!receiptFile) {
      return toast.error("Please select a receipt file first.");
    }
    setIsScanning(true);
    const uploadData = new FormData();
    uploadData.append('receipt', receiptFile);
    try {
      const res = await api.post('/expenses/scan', uploadData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setFormData({
        ...formData,
        description: res.data.fullText,
        amount: res.data.extractedAmount || ''
      });
      toast.success("Receipt scanned successfully!");
    } catch (err) {
      console.error("Error scanning receipt:", err);
      toast.error("Could not scan receipt. Please enter details manually.");
    }
    setIsScanning(false);
  };
  
  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const { amount, category, description, currency } = formData;

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/expenses", formData);
      toast.success("Expense submitted successfully!");
      setFormData({ amount: "", category: "Other", description: "", currency: "INR" });
      fetchExpenses();
    } catch (err) {
      console.error("Error submitting expense:", err.response.data);
      toast.error("Error: Could not submit expense.");
    }
  };

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-gray-800">Employee Dashboard</h1>

      {/* --- SUBMIT NEW EXPENSE SECTION (RESTORED) --- */}
      <div className="bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Submit New Expense</h2>

        <div className="border border-dashed border-gray-300 p-4 rounded-md mb-6">
            <label className="block text-sm font-medium text-gray-700">Scan a Receipt (Optional)</label>
            <p className="text-xs text-gray-500 mt-1">Upload an image to auto-fill the form.</p>
            <input type="file" onChange={handleFileChange} accept="image/*" className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 mt-4"/>
            <button type="button" onClick={handleScanReceipt} disabled={isScanning} className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gray-600 hover:bg-gray-700 focus:outline-none">
                {isScanning ? 'Scanning...' : 'Scan & Auto-fill'}
            </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700">Amount</label>
                <input type="number" name="amount" value={amount} onChange={onChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"/>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">Currency (3-letter code, e.g., USD)</label>
                <input type="text" name="currency" value={currency} onChange={onChange} required maxLength="3" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"/>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">Category</label>
                <select name="category" value={category} onChange={onChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                    <option value="Travel">Travel</option>
                    <option value="Food">Food</option>
                    <option value="Supplies">Office Supplies</option>
                    <option value="Other">Other</option>
                </select>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea name="description" value={description} onChange={onChange} required rows="3" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"></textarea>
            </div>
            <button type="submit" className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none">
                Submit Expense
            </button>
        </form>
      </div>

      {/* --- MY EXPENSES HISTORY SECTION --- */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">My Expenses</h2>
        {loading ? <p>Loading expenses...</p> : (
            <div className="overflow-x-auto relative">
            <table className="w-full text-sm text-left text-gray-500">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                    <tr>
                        <th scope="col" className="py-3 px-6">Date</th>
                        <th scope="col" className="py-3 px-6">Description</th>
                        <th scope="col" className="py-3 px-6">Original Amount</th>
                        <th scope="col" className="py-3 px-6">Status</th>
                        <th scope="col" className="py-3 px-6">Reviewer's Comments</th>
                    </tr>
                </thead>
                <tbody>
                    {expenses.map((expense) => {
                        let statusDisplay;
                        if (expense.status === 'Pending') {
                            const currentApprover = expense.approvalPath[expense.currentApproverIndex]?.approver;
                            statusDisplay = `Pending (${currentApprover ? currentApprover.name : 'N/A'})`;
                        } else {
                            statusDisplay = expense.status;
                        }

                        return (
                            <tr key={expense._id} className="bg-white border-b hover:bg-gray-50">
                                <td className="py-4 px-6">{new Date(expense.date).toLocaleDateString()}</td>
                                <td className="py-4 px-6">{expense.description}</td>
                                <td className="py-4 px-6">{expense.amount} {expense.currency}</td>
                                <td className="py-4 px-6">
                                    <span className={`status-badge status-${expense.status}`}>
                                        {statusDisplay}
                                    </span>
                                </td>
                                <td className="py-4 px-6 italic text-gray-500">{expense.approvalPath.slice().reverse().find(step => step.comments)?.comments}</td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
            </div>
        )}
      </div>
    </div>
  );
};

export default EmployeeDashboard;