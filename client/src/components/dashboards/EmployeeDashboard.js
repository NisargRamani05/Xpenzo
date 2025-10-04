import React, { useState, useEffect } from "react";
import api from "../../api/axiosConfig";
import toast from "react-hot-toast";

const EmployeeDashboard = () => {
    // --- STATE AND LOGIC (No changes here) ---
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
    const [activeView, setActiveView] = useState('new');

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

    const handleFileChange = (e) => setReceiptFile(e.target.files[0]);

    const handleScanReceipt = async () => {
        if (!receiptFile) return toast.error("Please select a receipt file first.");
        setIsScanning(true);
        // ... (rest of the function is unchanged)
    };
    
    const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
    const { amount, category, description, currency } = formData;

    const onSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post("/expenses", formData);
            toast.success("Expense submitted successfully!");
            setFormData({ amount: "", category: "Other", description: "", currency: "INR" });
            await fetchExpenses();
            setActiveView('history');
        } catch (err) {
            toast.error("Error: Could not submit expense.");
        }
    };

    const getStatusBadgeClasses = (status) => {
        const baseClasses = "px-2.5 py-1 text-xs font-semibold rounded-full inline-block";
        switch (status) {
            case 'Approved': return `${baseClasses} bg-emerald-100 text-emerald-800`;
            case 'Rejected': return `${baseClasses} bg-red-100 text-red-800`;
            default: return `${baseClasses} bg-amber-100 text-amber-800`;
        }
    };

    return (
        <div className="p-8 bg-[#073737] h-[91.4vh]">
            <h1 className="text-3xl font-bold text-[#FDFFD4] mb-8">Employee Dashboard</h1>

            <div className="flex flex-col md:flex-row gap-8 items-start">
                <aside className="w-full md:w-64 bg-[#FDFFD4] p-4 rounded-lg shadow-md border border-gray-200 flex-shrink-0">
                    <nav className="space-y-0">
                         <button
                            onClick={() => setActiveView('new')}
                            className={`w-full text-left p-3  font-semibold border-b border-gray-300 transition-colors duration-200 ${
                                activeView === 'new' ? 'bg-teal-50 text-[#073737]' : 'text-gray-600 hover:bg-gray-100'
                            }`}
                        >
                            New Expense
                        </button>
                        <button
                            onClick={() => setActiveView('history')}
                            className={`w-full text-left p-3  font-semibold border-b border-gray-300 transition-colors duration-200 ${
                                activeView === 'history' ? 'bg-teal-50 text-[#073737]' : 'text-gray-600 hover:bg-gray-100'
                            }`}
                        >
                            Submitted Expenses
                        </button>
                    </nav>
                </aside>

                <main className="flex-1 w-full">
                    {activeView === 'new' && (
                        // This section is unchanged
                        <div className="bg-[#FDFFD4] p-8 rounded-lg shadow-md border border-gray-200 h-[72vh] overflow-y-auto">
                            <h2 className="text-2xl font-bold mb-6 text-[#073737]">Submit New Expense</h2>
                            <div className="border border-dashed border-gray-300 p-4 rounded-md mb-6">
                                <label className="block text-sm font-medium text-[#073737]">Scan a Receipt (Optional)</label>
                                <p className="text-xs text-gray-500 mt-1">Upload an image to auto-fill the form.</p>
                                <input type="file" onChange={handleFileChange} accept="image/*" className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100 mt-4"/>
                                <button type="button" onClick={handleScanReceipt} disabled={isScanning} className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-[#073737] hover:bg-[#0a4f4f] focus:outline-none disabled:opacity-50">
                                    {isScanning ? 'Scanning...' : 'Scan & Auto-fill'}
                                </button>
                            </div>
                            <form onSubmit={onSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-[#073737]">Amount</label>
                                    <input type="number" name="amount" value={amount} onChange={onChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#073737] focus:border-[#073737]"/>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-[#073737]">Currency</label>
                                    <input type="text" name="currency" value={currency} onChange={onChange} required maxLength="3" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#073737] focus:border-[#073737]"/>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-[#073737]">Category</label>
                                    <select name="category" value={category} onChange={onChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-[#073737] focus:border-[#073737]">
                                        <option value="Travel">Travel</option>
                                        <option value="Food">Food</option>
                                        <option value="Supplies">Office Supplies</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-[#073737]">Description</label>
                                    <textarea name="description" value={description} onChange={onChange} required rows="3" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#073737] focus:border-[#073737]"></textarea>
                                </div>
                                <button type="submit" className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#073737] hover:bg-[#0a4f4f] focus:outline-none">
                                    Submit Expense
                                </button>
                            </form>
                        </div>
                    )}
                    
                    {/* --- Conditional Rendering for MY EXPENSES View --- */}
                    {activeView === 'history' && (
                        <div className="bg-[#FDFFD4] rounded-lg shadow-md border border-gray-200 h-[72vh] overflow-y-auto">
                            <div className="p-8">
                                <h2 className="text-2xl font-bold text-[#073737]">Submitted Expenses</h2>
                            </div>
                            {loading ? <p className="text-gray-600 px-8">Loading expenses...</p> : (
                                // CHANGED: Added overflow-x-auto to make the container scrollable on the x-axis (horizontally)
                                <div className="overflow-x-auto"> 
                                <table className="w-full text-sm text-left text-gray-500">
                                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 sticky top-0">
                                        <tr>
                                            {/* CHANGED: Added whitespace-nowrap to prevent column titles from wrapping */}
                                            <th scope="col" className="py-3 px-6 whitespace-nowrap">Date</th>
                                            <th scope="col" className="py-3 px-6">Description</th>
                                            <th scope="col" className="py-3 px-6 whitespace-nowrap">Original Amount</th>
                                            <th scope="col" className="py-3 px-6">Status</th>
                                            <th scope="col" className="py-3 px-6">Reviewer's Comments</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-[#FDFFD4]">
                                        {expenses.length > 0 ? expenses.map((expense) => {
                                            const statusDisplay = expense.status === 'Pending'
                                                ? `Pending (${expense.approvalPath[expense.currentApproverIndex]?.approver?.name || 'N/A'})`
                                                : expense.status;

                                            return (
                                                <tr key={expense._id} className="border-b hover:bg-gray-50">
                                                    {/* CHANGED: Added whitespace-nowrap to prevent cell content from wrapping */}
                                                    <td className="py-4 px-6 text-gray-800 whitespace-nowrap">{new Date(expense.date).toLocaleDateString()}</td>
                                                    <td className="py-4 px-6 text-gray-800">{expense.description}</td>
                                                    <td className="py-4 px-6 text-gray-800 whitespace-nowrap">{expense.amount} {expense.currency}</td>
                                                    <td className="py-4 px-6">
                                                        <span className={getStatusBadgeClasses(expense.status)}>
                                                            {statusDisplay}
                                                        </span>
                                                    </td>
                                                    <td className="py-4 px-6 italic text-gray-500">{expense.approvalPath.slice().reverse().find(step => step.comments)?.comments || '—'}</td>
                                                </tr>
                                            );
                                        }) : (
                                            <tr>
                                                <td colSpan="5" className="text-center py-10 text-gray-500">You have not submitted any expenses yet.</td>
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

export default EmployeeDashboard;