
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export async function requireAuth(req, res, next) {
  try {
    const token = req.cookies?.[process.env.COOKIE_NAME || 'imovies_session'];
    if (!token) return res.status(401).json({ message: 'Please log in to continue.' });
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(payload.sub);
    if (!user || !user.isActive) return res.status(401).json({ message: 'Your session is no longer valid.' });
    req.user = user;
    next();
  } catch {
    return res.status(401).json({ message: 'Authentication required.' });
  }
}

export function requireAdmin(req, res, next) {
  if (req.user?.role !== 'admin') return res.status(403).json({ message: 'Administrator access required.' });
  next();
}
