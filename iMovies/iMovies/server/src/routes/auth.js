
import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import User from '../models/User.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();
const schema = z.object({
  name: z.string().trim().min(2).max(80),
  email: z.string().trim().email().max(200),
  password: z.string().min(8).max(100)
});

function setSession(res, userId) {
  const token = jwt.sign({ sub: userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
  res.cookie(process.env.COOKIE_NAME || 'imovies_session', token, {
    httpOnly: true, secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax', maxAge: 7 * 24 * 60 * 60 * 1000, path: '/'
  });
}
function publicUser(user) {
  return { id: user._id, name: user.name, email: user.email, role: user.role };
}

router.post('/register', async (req, res, next) => {
  try {
    const parsed = schema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ message: parsed.error.issues[0].message });
    const email = parsed.data.email.toLowerCase();
    if (await User.exists({ email })) return res.status(409).json({ message: 'An account with this email already exists.' });
    const passwordHash = await bcrypt.hash(parsed.data.password, 12);
    const user = await User.create({ name: parsed.data.name, email, passwordHash });
    setSession(res, user.id);
    res.status(201).json({ user: publicUser(user) });
  } catch (e) { next(e); }
});

router.post('/login', async (req, res, next) => {
  try {
    const email = String(req.body.email || '').trim().toLowerCase();
    const password = String(req.body.password || '');
    if (!email || !password) return res.status(400).json({ message: 'Email and password are required.' });
    const user = await User.findOne({ email }).select('+passwordHash');
    if (!user || !(await bcrypt.compare(password, user.passwordHash)) || !user.isActive)
      return res.status(401).json({ message: 'Email or password is incorrect.' });
    setSession(res, user.id);
    res.json({ user: publicUser(user) });
  } catch (e) { next(e); }
});

router.post('/logout', (req, res) => {
  res.clearCookie(process.env.COOKIE_NAME || 'imovies_session', { httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production', path: '/' });
  res.json({ message: 'Signed out successfully.' });
});

router.get('/me', requireAuth, (req, res) => res.json({ user: publicUser(req.user) }));
export default router;
