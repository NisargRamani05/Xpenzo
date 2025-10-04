import React, { useState, useEffect } from 'react';
import api from '../../api/axiosConfig';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
    const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'Employee', manager: '' });
    const [managers, setManagers] = useState([]);
    const [summary, setSummary] = useState({ employeeCount: 0, managerCount: 0 });
    const [pendingExpenses, setPendingExpenses] = useState([]);
    const [allPendingExpenses, setAllPendingExpenses] = useState([]);
    const [loading, setLoading] = useState(true);

    // This single function fetches ALL data needed for the admin dashboard
    const fetchData = async () => {
        setLoading(true);
        try {
            const [managersRes, summaryRes, expensesRes, allExpensesRes] = await Promise.all([
                api.get('/users/managers'),
                api.get('/analytics/admin'),
                api.get('/expenses/pending-for-me'),
                api.get('/expenses/all-pending')
            ]);
            setManagers(managersRes.data);
            setSummary(summaryRes.data);
            setPendingExpenses(expensesRes.data);
            setAllPendingExpenses(allExpensesRes.data);
        } catch (err) {
            console.error("Error fetching admin data:", err);
            toast.error("Could not load all admin data.");
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleUpdateStatus = async (expenseId, newStatus) => {
        const comments = newStatus === "Approved" ? "Final approval by Admin." : "Rejected by Admin.";
        try {
          await api.put(`/expenses/${expenseId}/status`, { status: newStatus, comments });
          toast.success(`Expense has been ${newStatus.toLowerCase()}.`);
          fetchData();
        } catch (err) {
          toast.error("Error: Could not update status.");
        }
    };

    const handleForceUpdateStatus = async (expenseId, newStatus) => {
        const comments = `Force ${newStatus.toLowerCase()} by Admin.`;
        try {
          await api.put(`/expenses/${expenseId}/force-status`, { status: newStatus, comments });
          toast.success(`Expense has been force-${newStatus.toLowerCase()}.`);
          fetchData();
        } catch (err) {
          toast.error("Error: Could not perform override.");
        }
    };

    const onSubmit = async e => {
        e.preventDefault();
        try {
            const submissionData = role !== 'Employee' ? { ...formData, manager: undefined } : formData;
            await api.post('/users', submissionData);
            toast.success(`Successfully created ${role}: ${name}`);
            setFormData({ name: '', email: '', password: '', role: 'Employee', manager: '' });
            fetchData();
        } catch (err) {
            toast.error(err.response?.data?.msg || 'Could not create user');
        }
    };
    
    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });
    const { name, email, password, role, manager } = formData;

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-lg font-semibold text-gray-600">Total Employees</h2>
                    <p className="text-4xl font-bold text-gray-800 mt-2">{summary.employeeCount}</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-lg font-semibold text-gray-600">Total Managers</h2>
                    <p className="text-4xl font-bold text-gray-800 mt-2">{summary.managerCount}</p>
                </div>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold mb-6 text-gray-800">Create New User</h2>
                <form onSubmit={onSubmit} className="space-y-4">
                     <div>
                        <label className="block text-sm font-medium text-gray-700">Name</label>
                        <input type="text" name="name" value={name} onChange={onChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"/>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <input type="email" name="email" value={email} onChange={onChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"/>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Password</label>
                        <input type="password" name="password" value={password} onChange={onChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"/>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Role</label>
                        <select name="role" value={role} onChange={onChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                            <option value="Employee">Employee</option>
                            <option value="Manager">Manager</option>
                        </select>
                    </div>
                    {role === 'Employee' && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Assign Manager</label>
                            <select name="manager" value={manager} onChange={onChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                                <option value="" disabled>Select a manager</option>
                                {managers.map(m => (<option key={m._id} value={m._id}>{m.name}</option>))}
                            </select>
                        </div>
                    )}
                    <button type="submit" className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">Create User</button>
                </form>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold mb-6 text-gray-800">Expenses Awaiting Your Final Approval</h2>
                {loading ? <p>Loading expenses...</p> : (
                    <div className="overflow-x-auto relative">
                        <table className="w-full text-sm text-left text-gray-500">
                           <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                                <tr>
                                    <th scope="col" className="py-3 px-6">Date</th>
                                    <th scope="col" className="py-3 px-6">Submitted By</th>
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
                                        <td colSpan="5" className="py-4 px-6 text-center text-gray-500">No expenses are awaiting final approval.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-yellow-400">
                <h2 className="text-2xl font-bold mb-6 text-gray-800">Company-Wide Pending Expenses (Override)</h2>
                {loading ? <p>Loading all expenses...</p> : (
                    <div className="overflow-x-auto relative">
                        <table className="w-full text-sm text-left text-gray-500">
                           <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                                <tr>
                                    <th scope="col" className="py-3 px-6">Submitted By</th>
                                    <th scope="col" className="py-3 px-6">Amount</th>
                                    <th scope="col" className="py-3 px-6">Current Approver</th>
                                    <th scope="col" className="py-3 px-6">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {allPendingExpenses.length > 0 ? (
                                    allPendingExpenses.map((expense) => (
                                        <tr key={expense._id} className="bg-white border-b hover:bg-gray-50">
                                            <td className="py-4 px-6 font-medium text-gray-900">{expense.submittedBy.name}</td>
                                            <td className="py-4 px-6">{expense.amount} {expense.currency}</td>
                                            <td className="py-4 px-6 text-blue-600">{expense.approvalPath[expense.currentApproverIndex]?.approver.name}</td>
                                            <td className="py-4 px-6 flex items-center gap-2">
                                                <button onClick={() => handleForceUpdateStatus(expense._id, "Approved")} className="px-3 py-1 text-xs font-medium text-center text-white bg-yellow-500 rounded-lg hover:bg-yellow-600">Force Approve</button>
                                                <button onClick={() => handleForceUpdateStatus(expense._id, "Rejected")} className="px-3 py-1 text-xs font-medium text-center text-white bg-gray-700 rounded-lg hover:bg-gray-800">Force Reject</button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr className="bg-white border-b">
                                        <td colSpan="4" className="py-4 px-6 text-center text-gray-500">No expenses are currently pending in the company.</td>
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
export default AdminDashboard;