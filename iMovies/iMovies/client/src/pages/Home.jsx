import React from 'react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Search, Ticket } from 'lucide-react';
import api from '../services/api.js';
import MovieCard from '../components/MovieCard.jsx';
import Notice from '../components/Notice.jsx';

export default function Home() {
  const [movies, setMovies] = useState([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  async function load(q = '') {
    setLoading(true); setError('');
    try { const { data } = await api.get('/movies', { params: q ? { q } : {} }); setMovies(data.movies || []); }
    catch (e) { setError(e.response?.data?.message || 'Could not load movies. Check that the API and database are running.'); }
    finally { setLoading(false); }
  }
  useEffect(() => { load(); }, []);
  function submit(e) { e.preventDefault(); load(query); }
  const featured = movies[0];
  return <div className="page-wrap">
    <section className="hero">
      <div className="hero-copy">
        <div className="eyebrow"><span className="eyebrow-line"></span> THE BIG SCREEN, YOUR WAY</div>
        <h1>Make room for<br/><em>a good story.</em></h1>
        <p>Find the film. Choose your seats. Make a night of it.</p>
        <div className="hero-actions"><a href="#now-showing" className="button">Explore films <ArrowUpRight size={17}/></a><span className="hero-note"><Ticket size={15}/> Your next night out starts here</span></div>
      </div>
      <div className="hero-art" aria-label="Cinematic abstract artwork">
        <div className="art-ring ring-one"></div><div className="art-ring ring-two"></div><div className="art-core"></div>
        <div className="art-caption"><span>iM</span><small>THE CINEMA EDIT</small></div>
      </div>
      <div className="hero-index"><span>01</span><span className="index-line"></span><span>DISCOVER</span></div>
    </section>
    <section className="catalog-section" id="now-showing">
      <div className="section-heading">
        <div><div className="eyebrow">CURATED FOR YOUR NEXT NIGHT OUT</div><h2>Find your <em>film.</em></h2></div>
        <form id="search" className="search-form" onSubmit={submit}><Search size={17}/><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search movies..." aria-label="Search movies"/><button type="submit">Search</button></form>
      </div>
      <Notice type="error">{error}</Notice>
      {loading ? <div className="loading-state">Loading the latest listings<span className="loading-dot">.</span></div> :
       movies.length ? <div className="movie-grid">{movies.map(movie => <MovieCard key={movie._id} movie={movie}/>)}</div> :
       <div className="empty-state"><Ticket size={27}/><h3>No films found</h3><p>Try another title, or seed the development catalog from the server.</p><button className="button button-outline" onClick={() => { setQuery(''); load(); }}>Show all films</button></div>}
    </section>
    <section className="callout"><div><span className="eyebrow">YOUR SEAT IS WAITING</span><h2>Good films are<br/><em>better together.</em></h2></div><p>Pick a showtime, choose your seats, and get ready for the opening scene.</p><a href="#now-showing" className="button button-light">Browse movies <ArrowUpRight size={16}/></a></section>
  </div>;
}
