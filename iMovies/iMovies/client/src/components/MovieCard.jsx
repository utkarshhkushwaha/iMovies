import React from 'react';
import { Link } from 'react-router-dom';
import { Clock3 } from 'lucide-react';

export default function MovieCard({ movie }) {
  return <article className="movie-card">
    <Link to={`/movies/${movie._id}`} className="poster-wrap" aria-label={`View ${movie.title}`}>
      <img src={movie.posterUrl || 'https://placehold.co/600x900/171717/f5f5f5?text=iMovies'} alt={`${movie.title} poster`} loading="lazy" onError={e => { e.currentTarget.src = 'https://placehold.co/600x900/171717/f5f5f5?text=Poster+unavailable'; }} />
      <span className="poster-overlay">View film <span>↗</span></span>
    </Link>
    <div className="movie-card-info">
      <div><h3><Link to={`/movies/${movie._id}`}>{movie.title}</Link></h3><p>{(movie.genres || []).slice(0, 2).join(' · ') || 'Feature film'}</p></div>
      <div className="movie-meta">{movie.runtimeMinutes ? <span><Clock3 size={13}/>{movie.runtimeMinutes} min</span> : null}<span>{(movie.languages || [])[0] || 'Language varies'}</span></div>
    </div>
  </article>;
}
