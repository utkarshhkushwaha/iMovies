import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Clapperboard, Search, UserRound, LogOut, Bookmark } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';

export default function Layout({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  async function signOut() { try { await logout(); navigate('/'); } catch {} }
  return <div className="app-shell">
    <header className="topbar">
      <Link className="brand" to="/"><span className="brand-mark"><Clapperboard size={19}/></span><span>iMovies</span></Link>
      <nav className="main-nav">
        <NavLink to="/" end>Discover</NavLink>
        <a href="/#now-showing">Now showing</a>
        <Link to="/watchlist"><Bookmark size={15}/> Watchlist</Link>
      </nav>
      <div className="nav-actions">
        <Link className="icon-link" aria-label="Search movies" to="/#search"><Search size={19}/></Link>
        {user ? <>
          <Link className="account-link" to="/account"><UserRound size={16}/><span>{user.name.split(' ')[0]}</span></Link>
          {user.role === 'admin' && <Link to="/admin">Admin</Link>}
          <button className="icon-button" onClick={signOut} aria-label="Sign out" title="Sign out"><LogOut size={17}/></button>
        </> : <Link className="button button-small" to="/login">Sign in</Link>}
      </div>
    </header>
    <main>{children}</main>
    <footer className="footer">
      <Link className="brand footer-brand" to="/"><span className="brand-mark"><Clapperboard size={17}/></span><span>iMovies</span></Link>
      <p>Your next cinema night starts here.</p>
      <div className="footer-links"><Link to="/privacy">Privacy policy</Link><Link to="/terms">Terms and conditions</Link></div>
      <small>© {new Date().getFullYear()} iMovies. Development version.</small>
    </footer>
  </div>;
}
