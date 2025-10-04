import React, { useContext } from 'react';
import AuthContext from '../context/AuthContext';
import AdminDashboard from '../components/dashboards/AdminDashboard';
import ManagerDashboard from '../components/dashboards/ManagerDashboard';
import EmployeeDashboard from '../components/dashboards/EmployeeDashboard';

const DashboardPage = () => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return <div>Loading user data...</div>;
  }

  if (!user) {
    return <div>Could not load user data.</div>;
  }

  // Render the correct dashboard based on user role
  switch (user.role) {
    case 'Admin':
      return <AdminDashboard />;
    case 'Manager':
      return <ManagerDashboard />;
    case 'Employee':
      return <EmployeeDashboard />;
    default:
      return <div>Invalid user role.</div>;
  }
};

export default DashboardPage;