import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ADMIN_UID } from './adminRoute';

export default function GuestRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black text-[#f5f5f7]">
        Loading...
      </div>
    );
  }

  if (user) {
    return <Navigate to={user.uid === ADMIN_UID ? '/admin' : '/'} replace />;
  }

  return children;
}
