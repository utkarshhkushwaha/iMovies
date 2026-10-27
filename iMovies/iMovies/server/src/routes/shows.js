
import { Router } from 'express';
import Show from '../models/Show.js';
import Movie from '../models/Movie.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.get('/', async (req, res, next) => {
  try {
    const filter = { isActive: true, startsAt: { $gte: new Date() } };
    if (req.query.movie) filter.movie = req.query.movie;
    if (req.query.city) filter.city = new RegExp(`^${String(req.query.city).slice(0, 60)}$`, 'i');
    const shows = await Show.find(filter).populate('movie', 'title posterUrl languages runtimeMinutes').sort({ startsAt: 1 }).limit(100).lean();
    res.json({ shows });
  } catch (e) { next(e); }
});

router.get('/:id', async (req, res, next) => {
  try {
    const show = await Show.findOne({ _id: req.params.id, isActive: true }).populate('movie', 'title posterUrl runtimeMinutes languages').lean();
    if (!show) return res.status(404).json({ message: 'Show not found.' });
    const now = new Date();
    show.seats = show.seats.map(s => s.status === 'held' && s.holdExpiresAt <= now ? { ...s, status: 'available', holdToken: null, holdUser: null, holdExpiresAt: null } : s);
    res.json({ show });
  } catch (e) { next(e); }
});

router.post('/:id/hold', requireAuth, async (req, res, next) => {
  try {
    const requested = [...new Set((Array.isArray(req.body.seats) ? req.body.seats : []).map(s => String(s).trim()))];
    if (!requested.length || requested.length > 8 || requested.some(s => !/^[A-Z]{1,2}\d{1,2}$/.test(s)))
      return res.status(400).json({ message: 'Select between 1 and 8 valid seats.' });
    const token = crypto.randomUUID();
    const now = new Date();
    const expires = new Date(now.getTime() + 5 * 60 * 1000);
    const show = await Show.findById(req.params.id);
    if (!show || !show.isActive || show.startsAt <= now) return res.status(404).json({ message: 'Upcoming show not found.' });
    for (const seat of show.seats) {
      if (seat.status === 'held' && seat.holdExpiresAt && seat.holdExpiresAt <= now) {
        seat.status = 'available'; seat.holdToken = null; seat.holdUser = null; seat.holdExpiresAt = null;
      }
    }
    const selected = show.seats.filter(s => requested.includes(s.code));
    if (selected.length !== requested.length) return res.status(400).json({ message: 'One or more seats do not exist.' });
    if (selected.some(s => s.status === 'booked' || (s.status === 'held' && String(s.holdUser) !== String(req.user._id))))
      return res.status(409).json({ message: 'One or more seats are no longer available. Refresh and choose again.' });
    for (const seat of selected) {
      seat.status = 'held'; seat.holdToken = token; seat.holdUser = req.user._id; seat.holdExpiresAt = expires;
    }
    await show.save();
    res.json({ holdToken: token, expiresAt: expires, seats: selected.map(s => ({ code: s.code, price: s.price, category: s.category })), total: selected.reduce((sum, s) => sum + s.price, 0) });
  } catch (e) { next(e); }
});

export default router;
