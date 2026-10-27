
import { Router } from 'express';
import crypto from 'node:crypto';
import Booking from '../models/Booking.js';
import Show from '../models/Show.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.post('/', requireAuth, async (req, res, next) => {
  try {
    const { showId, holdToken, seats } = req.body;
    if (!showId || !holdToken || !Array.isArray(seats) || !seats.length)
      return res.status(400).json({ message: 'Show, seat hold, and seats are required.' });
    const show = await Show.findById(showId).populate('movie', 'title');
    if (!show || !show.isActive || show.startsAt <= new Date()) return res.status(404).json({ message: 'Show not found.' });
    const uniqueSeats = [...new Set(seats.map(String))];
    const chosen = show.seats.filter(s => uniqueSeats.includes(s.code));
    if (chosen.length !== uniqueSeats.length || chosen.some(s => s.status !== 'held' || s.holdToken !== holdToken || String(s.holdUser) !== String(req.user._id) || !s.holdExpiresAt || s.holdExpiresAt <= new Date()))
      return res.status(409).json({ message: 'Your seat hold expired or changed. Please select seats again.' });
    const amount = chosen.reduce((sum, s) => sum + s.price, 0);
    const reference = `IM-${crypto.randomBytes(5).toString('hex').toUpperCase()}`;
    const booking = await Booking.create({
      reference, user: req.user._id, show: show._id, movieTitle: show.movie.title,
      theaterName: show.theaterName, startsAt: show.startsAt, seatCodes: uniqueSeats,
      amount, status: 'pending_payment', paymentStatus: 'not_started', holdToken
    });
    res.status(201).json({ booking, message: 'Booking created. Complete a verified payment before tickets are confirmed.' });
  } catch (e) { next(e); }
});

router.get('/mine', requireAuth, async (req, res, next) => {
  try {
    const bookings = await Booking.find({ user: req.user._id }).sort({ createdAt: -1 }).lean();
    res.json({ bookings });
  } catch (e) { next(e); }
});

router.get('/:id', requireAuth, async (req, res, next) => {
  try {
    const booking = await Booking.findOne({ _id: req.params.id, user: req.user._id }).lean();
    if (!booking) return res.status(404).json({ message: 'Booking not found.' });
    res.json({ booking });
  } catch (e) { next(e); }
});

export default router;
