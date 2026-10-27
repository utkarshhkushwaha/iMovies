import React from 'react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Clapperboard } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import Notice from '../components/Notice.jsx';

export default function Auth({ mode = 'login' }) {
  const isRegister = mode === 'register';
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const { login, register } = useAuth();
  const navigate = useNavigate();
  async function submit(e) {
    e.preventDefault(); setError(''); setBusy(true);
    try { if (isRegister) await register(name, email, password); else await login(email, password); navigate('/'); }
    catch (e) { setError(e.response?.data?.message || 'Could not complete that request. Please try again.'); }
    finally { setBusy(false); }
  }
  return <div className="auth-page"><div className="auth-card">
    <Link className="brand auth-brand" to="/"><span className="brand-mark"><Clapperboard size={19}/></span><span>iMovies</span></Link>
    <span className="eyebrow">{isRegister ? 'JOIN THE AUDIENCE' : 'WELCOME BACK'}</span>
    <h1>{isRegister ? 'Your next film starts here.' : 'Good to see you again.'}</h1>
    <p className="auth-subtitle">{isRegister ? 'Create an account to save films and manage bookings.' : 'Sign in to pick up where your next cinema night left off.'}</p>
    <Notice type="error">{error}</Notice>
    <form onSubmit={submit} className="stack-form">
      {isRegister && <label>Full name<input required minLength="2" maxLength="80" value={name} onChange={e => setName(e.target.value)} autoComplete="name" placeholder="Your name"/></label>}
      <label>Email address<input required type="email" value={email} onChange={e => setEmail(e.target.value)} autoComplete="email" placeholder="you@example.com"/></label>
      <label>Password<input required minLength="8" maxLength="100" type="password" value={password} onChange={e => setPassword(e.target.value)} autoComplete={isRegister ? 'new-password' : 'current-password'} placeholder="At least 8 characters"/></label>
      <button className="button auth-submit" disabled={busy}>{busy ? 'Please wait...' : isRegister ? 'Create account' : 'Sign in'}</button>
    </form>
    <p className="auth-switch">{isRegister ? 'Already have an account?' : 'New to iMovies?'} <Link to={isRegister ? '/login' : '/register'}>{isRegister ? 'Sign in' : 'Create account'}</Link></p>
  </div></div>;
}
