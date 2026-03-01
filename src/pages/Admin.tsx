import { useEffect } from 'react';
import AdminLogin from '../components/AdminLogin';
import AdminDashboard from '../components/AdminDashboard';
import { useAuth } from '../lib/auth';

export default function Admin() {
  const { isAuthenticated, logout } = useAuth();

  // If not authenticated, show login
  if (!isAuthenticated) {
    return <AdminLogin />;
  }

  // If authenticated, show admin dashboard
  return (
    <AdminDashboard
      onLogout={() => {
        logout();
      }}
    />
  );
}
