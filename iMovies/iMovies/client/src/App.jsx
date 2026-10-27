import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import Home from './pages/Home.jsx';
import Auth from './pages/Auth.jsx';
import MovieDetails from './pages/MovieDetails.jsx';
import ShowBooking from './pages/ShowBooking.jsx';
import Account from './pages/Account.jsx';
import Watchlist from './pages/Watchlist.jsx';
import Admin from './pages/Admin.jsx';
import { Privacy, Terms } from './pages/Legal.jsx';

export default function App() {
  return <Layout><Routes>
    <Route path="/" element={<Home/>}/>
    <Route path="/login" element={<Auth mode="login"/>}/>
    <Route path="/register" element={<Auth mode="register"/>}/>
    <Route path="/movies/:id" element={<MovieDetails/>}/>
    <Route path="/shows/:id" element={<ShowBooking/>}/>
    <Route path="/account" element={<Account/>}/>
    <Route path="/watchlist" element={<Watchlist/>}/>
    <Route path="/admin" element={<Admin/>}/>
    <Route path="/privacy" element={<Privacy/>}/>
    <Route path="/terms" element={<Terms/>}/>
    <Route path="*" element={<Navigate to="/" replace/>}/>
  </Routes></Layout>;
}
