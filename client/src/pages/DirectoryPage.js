import React, { useState, useEffect, useContext } from 'react';
import api from '../api/axiosConfig';
import AuthContext from '../context/AuthContext';

const DirectoryPage = () => {
    const [directoryData, setDirectoryData] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useContext(AuthContext);

    useEffect(() => {
        const fetchData = async () => {
            if (!user) return;
            setLoading(true);
            try {
                let res;
                if (user.role === 'Admin') {
                    res = await api.get('/users/directory');
                } else if (user.role === 'Manager') {
                    res = await api.get('/users/team');
                }
                setDirectoryData(res.data);
            } catch (err) {
                console.error("Error fetching directory data:", err);
            }
            setLoading(false);
        };
        fetchData();
    }, [user]);

    const AdminView = () => (
        <div className="space-y-6">
            {directoryData.map(manager => (
                <div key={manager._id} className="bg-white p-6 rounded-lg shadow-md">
                    <div className="mb-4">
                        <h2 className="text-xl font-bold text-gray-800">{manager.name}</h2>
                        <p className="text-sm text-gray-500">Manager | {manager.email}</p>
                    </div>
                    {manager.employees && manager.employees.length > 0 ? (
                        <ul className="space-y-3 pl-6 border-l-2 border-gray-200">
                            {manager.employees.map(employee => (
                                <li key={employee._id}>
                                    <h3 className="text-md font-semibold text-gray-700">{employee.name}</h3>
                                    <p className="text-sm text-gray-500">{employee.email}</p>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="pl-6 text-sm text-gray-400">No employees assigned.</p>
                    )}
                </div>
            ))}
        </div>
    );

    const ManagerView = () => (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold text-gray-800 mb-4">My Team</h2>
            <ul className="space-y-4">
                {directoryData.map(employee => (
                     <li key={employee._id} className="border-b border-gray-200 pb-2">
                        <h3 className="text-md font-semibold text-gray-700">{employee.name}</h3>
                        <p className="text-sm text-gray-500">{employee.email}</p>
                    </li>
                ))}
            </ul>
        </div>
    );

    if (loading) return <p>Loading directory...</p>;

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-8">Team Directory</h1>
            {user?.role === 'Admin' && <AdminView />}
            {user?.role === 'Manager' && <ManagerView />}
        </div>
    );
};

export default DirectoryPage;