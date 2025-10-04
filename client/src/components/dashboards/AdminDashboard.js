import React, { useState, useEffect } from 'react';
import api from '../../api/axiosConfig';
import toast from 'react-hot-toast';
import HistoryModal from '../HistoryModal';

const AdminDashboard = () => {
    const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'Employee', manager: '' });
    const [managers, setManagers] = useState([]);
    const [summary, setSummary] = useState({ employeeCount: 0, managerCount: 0 });
    const [pendingExpenses, setPendingExpenses] = useState([]);
    const [allPendingExpenses, setAllPendingExpenses] = useState([]);
    const [completedExpenses, setCompletedExpenses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [historyModalExpense, setHistoryModalExpense] = useState(null);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [managersRes, summaryRes, expensesRes, allExpensesRes, completedRes] = await Promise.all([
                api.get('/users/managers'),
                api.get('/analytics/admin'),
                api.get('/expenses/pending-for-me'),
                api.get('/expenses/all-pending'),
                api.get('/expenses/completed')
            ]);
            setManagers(managersRes.data);
            setSummary(summaryRes.data);
            setPendingExpenses(expensesRes.data);
            setAllPendingExpenses(allExpensesRes.data);
            setCompletedExpenses(completedRes.data);
        } catch (err) {
            console.error("Error fetching admin data:", err);
            toast.error("Could not load all admin data.");
        }
        setLoading(false);
    };

    useEffect(() => { fetchData(); }, []);

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
        <>
            <HistoryModal expense={historyModalExpense} onClose={() => setHistoryModalExpense(null)} />
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
                        <button type="submit" className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700">Create User</button>
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
                                    {pendingExpenses.map((expense) => (
                                        <tr key={expense._id} className="bg-white border-b hover:bg-gray-50">
                                            <td className="py-4 px-6">{new Date(expense.date).toLocaleDateString()}</td>
                                            <td className="py-4 px-6 font-medium text-gray-900">{expense.submittedBy.name}</td>
                                            <td className="py-4 px-6">{expense.amount} {expense.currency}</td>
                                            <td className="py-4 px-6">{expense.convertedAmount}</td>
                                            <td className="py-4 px-6 flex items-center gap-2">
                                                <button onClick={() => handleUpdateStatus(expense._id, "Approved")} className="px-3 py-1 text-xs text-white bg-green-600 rounded-lg hover:bg-green-700">Approve</button>
                                                <button onClick={() => handleUpdateStatus(expense._id, "Rejected")} className="px-3 py-1 text-xs text-white bg-red-600 rounded-lg hover:bg-red-700">Reject</button>
                                                <button onClick={() => setHistoryModalExpense(expense)} className="px-3 py-1 text-xs text-gray-900 bg-gray-200 rounded-lg hover:bg-gray-300">History</button>
                                            </td>
                                        </tr>
                                    ))}
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
                                    {allPendingExpenses.map((expense) => (
                                        <tr key={expense._id} className="bg-white border-b hover:bg-gray-50">
                                            <td className="py-4 px-6 font-medium text-gray-900">{expense.submittedBy.name}</td>
                                            <td className="py-4 px-6">{expense.amount} {expense.currency}</td>
                                            <td className="py-4 px-6 text-blue-600">{expense.approvalPath[expense.currentApproverIndex]?.approver.name}</td>
                                            <td className="py-4 px-6 flex items-center gap-2">
                                                <button onClick={() => handleForceUpdateStatus(expense._id, "Approved")} className="px-3 py-1 text-xs text-white bg-yellow-500 rounded-lg hover:bg-yellow-600">Force Approve</button>
                                                <button onClick={() => handleForceUpdateStatus(expense._id, "Rejected")} className="px-3 py-1 text-xs text-white bg-gray-700 rounded-lg hover:bg-gray-800">Force Reject</button>
                                                <button onClick={() => setHistoryModalExpense(expense)} className="px-3 py-1 text-xs text-gray-900 bg-gray-200 rounded-lg hover:bg-gray-300">History</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h2 className="text-2xl font-bold mb-6 text-gray-800">Completed Expense History</h2>
                  {loading ? <p>Loading history...</p> : (
                    <div className="overflow-x-auto relative">
                      <table className="w-full text-sm text-left text-gray-500">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                          <tr>
                            <th scope="col" className="py-3 px-6">Submitted By</th>
                            <th scope="col" className="py-3 px-6">Amount</th>
                            <th scope="col" className="py-3 px-6">Final Status</th>
                            <th scope="col" className="py-3 px-6">View</th>
                          </tr>
                        </thead>
                        <tbody>
                          {completedExpenses.map((expense) => (
                            <tr key={expense._id} className="bg-white border-b hover:bg-gray-50">
                              <td className="py-4 px-6 font-medium text-gray-900">{expense.submittedBy.name}</td>
                              <td className="py-4 px-6">{expense.amount} {expense.currency}</td>
                              <td className="py-4 px-6">
                                <span className={`px-2 py-0.5 text-xs font-medium rounded-full text-white ${expense.status === 'Approved' ? 'bg-green-500' : 'bg-red-500'}`}>
                                  {expense.status}
                                </span>
                              </td>
                              <td className="py-4 px-6">
                                <button onClick={() => setHistoryModalExpense(expense)} className="px-3 py-1 text-xs font-medium text-center text-gray-900 bg-gray-200 rounded-lg hover:bg-gray-300">History</button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
            </div>
        </>
    );
};
export default AdminDashboard;