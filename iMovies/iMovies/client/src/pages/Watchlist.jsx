import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import Account from './Account.jsx';
export default function Watchlist() {
  const { user, loading } = useAuth();
  if (loading) return <div className="loading-state page-wrap">Loading...</div>;
  return user ? <Account/> : <Navigate to="/login" replace/>;
}
