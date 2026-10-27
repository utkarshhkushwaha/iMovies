import React from 'react';
import { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Armchair, ShieldCheck } from 'lucide-react';
import api from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';
import Notice from '../components/Notice.jsx';

export default function ShowBooking() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [show, setShow] = useState(null);
  const [selected, setSelected] = useState([]);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState('');
  useEffect(() => { api.get(`/shows/${id}`).then(r => setShow(r.data.show)).catch(e => setError(e.response?.data?.message || 'Could not load this show.')); }, [id]);
  const seats = show?.seats || [];
  const total = seats.filter(s => selected.includes(s.code)).reduce((sum, s) => sum + s.price, 0);
  function toggle(seat) {
    if (seat.status === 'booked' || (seat.status === 'held' && new Date(seat.holdExpiresAt) > new Date() && seat.holdUser !== user?.id)) return;
    setSelected(prev => prev.includes(seat.code) ? prev.filter(x => x !== seat.code) : prev.length >= 8 ? prev : [...prev, seat.code]);
  }
  async function book() {
    if (!user) { navigate('/login'); return; }
    if (!selected.length) return;
    setBusy(true); setError(''); setNotice('');
    try {
      const hold = await api.post(`/shows/${id}/hold`, { seats: selected });
      const booking = await api.post('/bookings', { showId: id, holdToken: hold.data.holdToken, seats: selected });
      setNotice(`Booking ${booking.data.booking.reference} has been created, but payment is not enabled in this development build. No ticket is confirmed and no payment was taken.`);
      setSelected([]);
    } catch (e) { setError(e.response?.data?.message || 'Could not reserve these seats. Refresh and try again.'); }
    finally { setBusy(false); }
  }
  if (error && !show) return <div className="page-wrap"><Notice type="error">{error}</Notice><Link to="/" className="back-link">Back to films</Link></div>;
  if (!show) return <div className="loading-state page-wrap">Loading seat map...</div>;
  const grouped = seats.reduce((acc, s) => { const row = s.code.match(/^[A-Z]+/)?.[0] || 'A'; (acc[row] ||= []).push(s); return acc; }, {});
  return <div className="page-wrap booking-page">
    <Link to={`/movies/${show.movie?._id}`} className="back-link"><ArrowLeft size={16}/> Back to movie</Link>
    <div className="booking-title"><div><span className="eyebrow">CHOOSE YOUR SEATS</span><h1>{show.movie?.title}</h1><p>{show.theaterName} · {show.city} · {new Date(show.startsAt).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}</p></div><div className="secure-note"><ShieldCheck size={17}/> Server-checked availability</div></div>
    <div className="seat-layout">
      <div className="screen-curve"><span>SCREEN</span></div>
      <div className="seat-rows">{Object.entries(grouped).map(([row, rowSeats]) => <div className="seat-row" key={row}><span className="row-label">{row}</span>{rowSeats.map(seat => {
        const occupied = seat.status === 'booked' || (seat.status === 'held' && seat.holdExpiresAt && new Date(seat.holdExpiresAt) > new Date() && String(seat.holdUser) !== String(user?.id));
        const cls = occupied ? 'seat occupied' : selected.includes(seat.code) ? 'seat selected' : seat.category === 'premium' ? 'seat premium' : 'seat';
        return <button type="button" key={seat.code} disabled={occupied} className={cls} title={`${seat.code} · ₹${seat.price}`} aria-label={`${seat.code}, ${occupied ? 'unavailable' : `₹${seat.price}`}`} onClick={() => toggle(seat)}>{seat.code.replace(row, '')}</button>;
      })}<span className="row-label">{row}</span></div>)}</div>
      <div className="seat-legend"><span><i className="legend-seat"></i>Available</span><span><i className="legend-seat premium"></i>Premium</span><span><i className="legend-seat selected"></i>Selected</span><span><i className="legend-seat occupied"></i>Unavailable</span></div>
    </div>
    <div className="booking-summary"><div><span className="eyebrow">YOUR SELECTION</span><h2>{selected.length ? selected.join(', ') : 'No seats selected'}</h2><p>{selected.length} of 8 seats selected</p></div><div className="summary-total"><span>Total</span><strong>₹{total.toLocaleString('en-IN')}</strong></div><button className="button" disabled={!selected.length || busy} onClick={book}>{busy ? 'Checking availability...' : user ? 'Reserve seats' : 'Sign in to continue'}</button></div>
    <Notice type="error">{error}</Notice><Notice>{notice}</Notice>
    <p className="fine-print">Seat selection is held temporarily. This development build does not process real payments or issue confirmed tickets.</p>
  </div>;
}
