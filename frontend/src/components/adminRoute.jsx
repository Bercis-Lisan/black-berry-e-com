import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Client-side navigation gate only. Backend product APIs are intentionally public.
export const ADMIN_UID = 'yewJSPza0haEXbliw2IkQkolZoj1';

export default function AdminRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-[#f5f5f7]">
        Loading...
      </div>
    );
  }

  if (!user || user.uid !== ADMIN_UID) {
    return <Navigate to="/" replace />;
  }

  return children;
}
