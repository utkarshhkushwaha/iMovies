import React from 'react';
import { useEffect, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import api from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';
import Notice from '../components/Notice.jsx';

export default function Admin() {
  const { user, loading } = useAuth();
  const [summary, setSummary] = useState(null);
  const [movies, setMovies] = useState([]);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [title, setTitle] = useState('');
  const [synopsis, setSynopsis] = useState('');
  const [posterUrl, setPosterUrl] = useState('');
  const [genres, setGenres] = useState('Drama');
  useEffect(() => {
    if (user?.role === 'admin') Promise.all([api.get('/admin/summary'), api.get('/movies')]).then(([s,m]) => { setSummary(s.data); setMovies(m.data.movies); }).catch(e => setError(e.response?.data?.message || 'Could not load admin data.'));
  }, [user]);
  if (loading) return <div className="loading-state page-wrap">Loading...</div>;
  if (!user) return <Navigate to="/login" replace/>;
  if (user.role !== 'admin') return <div className="page-wrap"><Notice type="error">Administrator access is required to view this page.</Notice><Link className="text-link" to="/">Return home</Link></div>;
  async function createMovie(e) {
    e.preventDefault(); setError(''); setMessage('');
    try {
      await api.post('/admin/movies', { title, synopsis, posterUrl, genres: genres.split(',').map(x => x.trim()).filter(Boolean), languages: ['Hindi'], isPublished: true });
      setTitle(''); setSynopsis(''); setPosterUrl(''); setMessage('Movie created.'); const { data } = await api.get('/movies'); setMovies(data.movies);
      const s = await api.get('/admin/summary'); setSummary(s.data);
    } catch (e) { setError(e.response?.data?.message || 'Could not create movie.'); }
  }
  async function unpublish(id) {
    if (!confirm('Unpublish this movie from public listings?')) return;
    try { await api.delete(`/admin/movies/${id}`); setMovies(ms => ms.filter(m => m._id !== id)); setMessage('Movie unpublished.'); }
    catch (e) { setError(e.response?.data?.message || 'Could not update movie.'); }
  }
  return <div className="page-wrap admin-page"><span className="eyebrow">CONTROL ROOM</span><h1>Admin <em>dashboard.</em></h1><p className="muted">Metrics below are live counts from this development database.</p><Notice type="error">{error}</Notice><Notice>{message}</Notice>
    <div className="admin-metrics">{[['Users',summary?.users],['Movies',summary?.movies],['Bookings',summary?.bookings],['Paid bookings',summary?.paidBookings]].map(([label,value]) => <div className="metric-card" key={label}><span>{label}</span><strong>{value ?? '—'}</strong></div>)}</div>
    <section className="admin-section"><h2>Add a movie</h2><form className="admin-form" onSubmit={createMovie}><label>Movie title<input required value={title} onChange={e => setTitle(e.target.value)}/></label><label>Poster URL<input type="url" value={posterUrl} onChange={e => setPosterUrl(e.target.value)} placeholder="https://..."/></label><label>Genres, comma separated<input value={genres} onChange={e => setGenres(e.target.value)}/></label><label>Synopsis<textarea rows="3" value={synopsis} onChange={e => setSynopsis(e.target.value)}/></label><button className="button">Create movie</button></form></section>
    <section className="admin-section"><h2>Published catalog</h2><div className="admin-movie-list">{movies.map(m => <div key={m._id} className="admin-movie"><span>{m.title}</span><button className="text-button" onClick={() => unpublish(m._id)}>Unpublish</button></div>)}</div></section>
    <p className="fine-print">Show management, payment administration, moderation workflows, and production reports need additional implementation before launch.</p>
  </div>;
}
