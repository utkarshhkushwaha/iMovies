import React from 'react';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Clock3, CalendarDays, MapPin, Star, BookmarkPlus } from 'lucide-react';
import api from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';
import Notice from '../components/Notice.jsx';

export default function MovieDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [shows, setShows] = useState([]);
  const [error, setError] = useState('');
  const [rating, setRating] = useState('5');
  const [reviewText, setReviewText] = useState('');
  const [message, setMessage] = useState('');
  async function load() {
    try {
      const [movieRes, showRes] = await Promise.all([api.get(`/movies/${id}`), api.get('/shows', { params: { movie: id } })]);
      setData(movieRes.data); setShows(showRes.data.shows || []);
    } catch (e) { setError(e.response?.data?.message || 'Could not load this movie.'); }
  }
  useEffect(() => { load(); }, [id]);
  async function addWatchlist() {
    try { await api.post(`/users/watchlist/${id}`); setMessage('Added to your watchlist.'); }
    catch (e) { setMessage(e.response?.data?.message || 'Sign in to save films.'); }
  }
  async function submitReview(e) {
    e.preventDefault(); setMessage('');
    try { await api.post(`/movies/${id}/reviews`, { rating: Number(rating), text: reviewText }); setMessage('Your review has been saved.'); setReviewText(''); await load(); }
    catch (e) { setMessage(e.response?.data?.message || 'Please sign in before submitting a review.'); }
  }
  if (error) return <div className="page-wrap detail-error"><Notice type="error">{error}</Notice><Link to="/" className="text-link"><ArrowLeft size={15}/> Back to films</Link></div>;
  if (!data) return <div className="loading-state page-wrap">Loading film details...</div>;
  const movie = data.movie;
  return <div className="page-wrap detail-page">
    <Link to="/" className="back-link"><ArrowLeft size={16}/> All films</Link>
    <section className="detail-hero">
      <div className="detail-poster"><img src={movie.posterUrl || 'https://placehold.co/600x900/171717/f5f5f5?text=iMovies'} alt={`${movie.title} poster`}/></div>
      <div className="detail-copy"><span className="eyebrow">FILM DETAILS</span><h1>{movie.title}</h1>
        <div className="detail-meta">{movie.runtimeMinutes && <span><Clock3 size={15}/>{movie.runtimeMinutes} min</span>}{movie.releaseDate && <span><CalendarDays size={15}/>{new Date(movie.releaseDate).toLocaleDateString()}</span>}{data.rating?.count > 0 && <span><Star size={15}/>{Number(data.rating.average).toFixed(1)} / 5 · {data.rating.count} reviews</span>}</div>
        <div className="tag-row">{(movie.genres || []).map(g => <span className="tag" key={g}>{g}</span>)}{(movie.languages || []).map(l => <span className="tag tag-muted" key={l}>{l}</span>)}</div>
        <p className="synopsis">{movie.synopsis || 'Synopsis not available yet.'}</p>
        {movie.cast?.length > 0 && <p className="cast-line"><strong>Cast</strong> {movie.cast.join(', ')}</p>}
        <div className="detail-actions"><a className="button" href="#showtimes">Find showtimes</a><button className="button button-outline" onClick={addWatchlist}><BookmarkPlus size={16}/> Save film</button></div>
        {message && <Notice>{message}</Notice>}
      </div>
    </section>
    <section className="showtimes-section" id="showtimes"><div className="section-heading"><div><span className="eyebrow">MAKE IT A MOVIE NIGHT</span><h2>Available <em>showtimes.</em></h2></div></div>
      {shows.length ? <div className="show-list">{shows.map(show => <article className="show-row" key={show._id}><div><h3>{show.theaterName}</h3><p><MapPin size={14}/>{show.city} · {show.screenName}</p></div><div className="show-time">{new Date(show.startsAt).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}</div><Link className="button button-small" to={`/shows/${show._id}`}>Choose seats</Link></article>)}</div> : <div className="empty-state compact"><p>No upcoming showtimes are available for this title yet.</p></div>}
    </section>
    <section className="reviews-section"><div className="section-heading"><div><span className="eyebrow">AUDIENCE NOTES</span><h2>Reviews, <em>honestly.</em></h2></div></div>
      {user ? <form className="review-form" onSubmit={submitReview}><label>Rating<select value={rating} onChange={e => setRating(e.target.value)}>{[5,4,3,2,1].map(n => <option key={n} value={n}>{n} / 5</option>)}</select></label><label>Your review<textarea maxLength="1200" rows="3" value={reviewText} onChange={e => setReviewText(e.target.value)} placeholder="What did you think of the film?"/></label><button className="button button-small">Publish review</button></form> : <p className="muted"> <Link to="/login">Sign in</Link> to share your own review.</p>}
      {data.reviews?.length ? <div className="review-list">{data.reviews.map(r => <article className="review-item" key={r._id}><div><strong>{r.user?.name || 'Audience member'}</strong><span className="review-stars"><Star size={13}/>{r.rating}/5</span></div><p>{r.text || 'Rating submitted without written comments.'}</p></article>)}</div> : <div className="empty-state compact"><p>No audience reviews yet. Be the first to share an honest opinion.</p></div>}
    </section>
  </div>;
}
