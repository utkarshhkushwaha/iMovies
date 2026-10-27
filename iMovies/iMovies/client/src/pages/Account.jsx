import React from 'react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CalendarDays, Ticket } from 'lucide-react';
import api from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';
import Notice from '../components/Notice.jsx';

export default function Account() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [movies, setMovies] = useState([]);
  const [error, setError] = useState('');
  useEffect(() => {
    Promise.all([api.get('/bookings/mine'), api.get('/users/watchlist')])
      .then(([b, w]) => { setBookings(b.data.bookings || []); setMovies(w.data.movies || []); })
      .catch(e => setError(e.response?.data?.message || 'Could not load your account.'));
  }, []);
  async function remove(id) { await api.delete(`/users/watchlist/${id}`); setMovies(m => m.filter(x => x._id !== id)); }
  return <div className="page-wrap account-page"><span className="eyebrow">YOUR iMOVIES ACCOUNT</span><h1>Hello, <em>{user?.name?.split(' ')[0] || 'there'}.</em></h1><p className="muted">Your saved films and booking activity, all in one place.</p><Notice type="error">{error}</Notice>
    <section className="account-section"><div className="section-heading"><div><span className="eyebrow">YOUR PLANS</span><h2>Booking <em>history.</em></h2></div></div>
      {bookings.length ? <div className="booking-history">{bookings.map(b => <article key={b._id} className="history-card"><div className="history-icon"><Ticket size={20}/></div><div className="history-main"><h3>{b.movieTitle}</h3><p>{b.theaterName} · {new Date(b.startsAt).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}</p><small>Reference: {b.reference} · Seats: {b.seatCodes.join(', ')}</small></div><div className="history-status"><strong>₹{b.amount}</strong><span className={`status status-${b.status}`}>{b.status.replace('_', ' ')}</span></div></article>)}</div> : <div className="empty-state compact"><CalendarDays size={24}/><p>No bookings yet. Your next cinema night is waiting.</p><Link className="text-link" to="/">Explore films</Link></div>}
    </section>
    <section className="account-section"><div className="section-heading"><div><span className="eyebrow">SAVED FOR LATER</span><h2>Your <em>watchlist.</em></h2></div></div>
      {movies.length ? <div className="watchlist-list">{movies.map(m => <article className="watchlist-row" key={m._id}><img src={m.posterUrl} alt=""/><div><h3><Link to={`/movies/${m._id}`}>{m.title}</Link></h3><p>{(m.genres || []).join(' · ')}</p></div><button className="text-button" onClick={() => remove(m._id)}>Remove</button></article>)}</div> : <div className="empty-state compact"><p>Your watchlist is empty. Save a film to find it here later.</p><Link className="text-link" to="/">Browse films</Link></div>}
    </section>
  </div>;
}
