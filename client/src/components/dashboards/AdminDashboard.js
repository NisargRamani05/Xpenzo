import React, { useState, useEffect } from 'react';
import api from '../../api/axiosConfig';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
    const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'Employee', manager: '' });
    const [managers, setManagers] = useState([]);
    const [summary, setSummary] = useState({ employeeCount: 0, managerCount: 0 }); // State for analytics

    // Combined useEffect to fetch all necessary data on load
    useEffect(() => {
        const fetchData = async () => {
            try {
                const managersRes = await api.get('/users/managers');
                setManagers(managersRes.data);

                const summaryRes = await api.get('/analytics/admin');
                setSummary(summaryRes.data);
            } catch (err) {
                console.error("Error fetching admin data:", err);
                toast.error("Could not load all admin data.");
            }
        };
        fetchData();
    }, []);

    const { name, email, password, role, manager } = formData;
    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async e => {
        e.preventDefault();
        try {
            const submissionData = role !== 'Employee' ? { ...formData, manager: undefined } : formData;
            await api.post('/users', submissionData);
            toast.success(`Successfully created ${role}: ${name}`);
            setFormData({ name: '', email: '', password: '', role: 'Employee', manager: '' });

            // Refresh managers list and summary counts after creating a new user
            const managersRes = await api.get('/users/managers');
            setManagers(managersRes.data);
            const summaryRes = await api.get('/analytics/admin');
            setSummary(summaryRes.data);

        } catch (err) {
            toast.error(err.response?.data?.msg || 'Could not create user');
        }
    };

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>

            {/* --- ANALYTICS SUMMARY SECTION --- */}
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

            {/* --- CREATE USER FORM (with Tailwind CSS) --- */}
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
        </div>
    );
};

export default AdminDashboard;