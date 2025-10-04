import React, { useState, useEffect, useContext } from "react";
import api from "../api/axiosConfig";
import AuthContext from "../context/AuthContext";

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
        if (user.role === "Admin") {
          res = await api.get("/users/directory");
        } else if (user.role === "Manager") {
          res = await api.get("/users/team");
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
      {directoryData.map((manager) => (
        <div
          key={manager._id}
          className="bg-[#FDFFD4] p-6 rounded-lg shadow-md border border-gray-200"
        >
          <div className="mb-4">
            <h2 className="text-xl font-bold text-[#073737]">{manager.name}</h2>
            <p className="text-sm text-gray-600">
              Manager | {manager.email}
            </p>
          </div>

          {manager.employees && manager.employees.length > 0 ? (
            <ul className="space-y-3 pl-6 border-l-2 border-gray-300">
              {manager.employees.map((employee) => (
                <li key={employee._id}>
                  <h3 className="text-md font-semibold text-gray-800">
                    {employee.name}
                  </h3>
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
    <div className="bg-[#FDFFD4] p-6 rounded-lg shadow-md border border-gray-200">
      <h2 className="text-2xl font-bold text-[#073737] mb-4">My Team</h2>
      {directoryData.length > 0 ? (
        <ul className="space-y-4">
          {directoryData.map((employee) => (
            <li
              key={employee._id}
              className="border-b border-gray-200 pb-2 last:border-0"
            >
              <h3 className="text-md font-semibold text-gray-800">
                {employee.name}
              </h3>
              <p className="text-sm text-gray-500">{employee.email}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500">No team members assigned.</p>
      )}
    </div>
  );

  if (loading) return <p className="text-gray-200">Loading directory...</p>;

  return (
    <div className="p-8 bg-[#073737] min-h-[91.4vh]">
      <h1 className="text-3xl font-bold text-[#FDFFD4] mb-8">
        Team Directory
      </h1>
      <div className="space-y-6">
        {user?.role === "Admin" && <AdminView />}
        {user?.role === "Manager" && <ManagerView />}
      </div>
    </div>
  );
};

export default DirectoryPage;
