
import { Router } from 'express';
import { z } from 'zod';
import Movie from '../models/Movie.js';
import Show from '../models/Show.js';
import Booking from '../models/Booking.js';
import User from '../models/User.js';
import { requireAuth, requireAdmin } from '../middleware/auth.js';

const router = Router();
router.use(requireAuth, requireAdmin);

const movieSchema = z.object({
  title: z.string().trim().min(1).max(160),
  synopsis: z.string().max(5000).optional(),
  posterUrl: z.string().url().or(z.literal('')).optional(),
  backdropUrl: z.string().url().or(z.literal('')).optional(),
  genres: z.array(z.string().max(40)).optional(),
  languages: z.array(z.string().max(40)).optional(),
  runtimeMinutes: z.number().int().positive().optional(),
  releaseDate: z.string().optional(),
  cast: z.array(z.string().max(100)).optional(),
  trailerUrl: z.string().url().or(z.literal('')).optional(),
  isPublished: z.boolean().optional()
});

router.get('/summary', async (req, res, next) => {
  try {
    const [users, movies, bookings, paid] = await Promise.all([
      User.countDocuments(), Movie.countDocuments(), Booking.countDocuments(), Booking.countDocuments({ paymentStatus: 'paid' })
    ]);
    res.json({ users, movies, bookings, paidBookings: paid });
  } catch (e) { next(e); }
});

router.post('/movies', async (req, res, next) => {
  try {
    const parsed = movieSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ message: parsed.error.issues[0].message });
    res.status(201).json({ movie: await Movie.create(parsed.data) });
  } catch (e) { next(e); }
});

router.patch('/movies/:id', async (req, res, next) => {
  try {
    const parsed = movieSchema.partial().safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ message: parsed.error.issues[0].message });
    const movie = await Movie.findByIdAndUpdate(req.params.id, parsed.data, { new: true, runValidators: true });
    if (!movie) return res.status(404).json({ message: 'Movie not found.' });
    res.json({ movie });
  } catch (e) { next(e); }
});

router.delete('/movies/:id', async (req, res, next) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) return res.status(404).json({ message: 'Movie not found.' });
    movie.isPublished = false;
    await movie.save();
    res.json({ message: 'Movie unpublished.' });
  } catch (e) { next(e); }
});

router.get('/bookings', async (req, res, next) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 }).limit(200).populate('user', 'name email').lean();
    res.json({ bookings });
  } catch (e) { next(e); }
});

router.post('/shows', async (req, res, next) => {
  try {
    const { movie, theaterName, city, screenName, startsAt, rows = 5, seatsPerRow = 8, standardPrice = 180, premiumPrice = 260 } = req.body;
    if (!movie || !theaterName || !city || !startsAt || !Number.isInteger(rows) || !Number.isInteger(seatsPerRow) || rows < 1 || rows > 12 || seatsPerRow < 1 || seatsPerRow > 16)
      return res.status(400).json({ message: 'Provide a movie, theater, city, future showtime, and valid seat dimensions.' });
    if (!await Movie.exists({ _id: movie, isPublished: true })) return res.status(400).json({ message: 'Choose an existing published movie.' });
    const seats = [];
    for (let r = 0; r < rows; r++) for (let n = 1; n <= seatsPerRow; n++) {
      const category = r < 2 ? 'premium' : 'standard';
      seats.push({ code: `${String.fromCharCode(65 + r)}${n}`, category, price: category === 'premium' ? Number(premiumPrice) : Number(standardPrice), status: 'available' });
    }
    const show = await Show.create({ movie, theaterName, city, screenName: screenName || 'Screen 1', startsAt: new Date(startsAt), seats });
    res.status(201).json({ show });
  } catch (e) { next(e); }
});

export default router;
