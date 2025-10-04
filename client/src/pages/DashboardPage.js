import React, { useContext } from 'react';
import AuthContext from '../context/AuthContext';

const DashboardPage = () => {
  const { user } = useContext(AuthContext);

  return (
    <div>
      <h1 className="text-3xl font-bold">Welcome to your Dashboard</h1>
      {user && <p className="mt-4">You are logged in as {user.role}.</p>}
    </div>
  );
};

export default DashboardPage;