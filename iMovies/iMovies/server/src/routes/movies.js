
import { Router } from 'express';
import Movie from '../models/Movie.js';
import Review from '../models/Review.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.get('/', async (req, res, next) => {
  try {
    const filter = { isPublished: true };
    if (req.query.q) filter.title = { $regex: String(req.query.q).slice(0, 80).replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), $options: 'i' };
    if (req.query.language) filter.languages = String(req.query.language);
    if (req.query.genre) filter.genres = String(req.query.genre);
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(24, Math.max(1, Number(req.query.limit) || 12));
    const [movies, total] = await Promise.all([
      Movie.find(filter).sort({ releaseDate: -1, title: 1 }).skip((page - 1) * limit).limit(limit).lean(),
      Movie.countDocuments(filter)
    ]);
    res.json({ movies, page, pages: Math.ceil(total / limit), total });
  } catch (e) { next(e); }
});

router.get('/:id', async (req, res, next) => {
  try {
    const movie = await Movie.findOne({ _id: req.params.id, isPublished: true }).lean();
    if (!movie) return res.status(404).json({ message: 'Movie not found.' });
    const [reviews, summary] = await Promise.all([
      Review.find({ movie: movie._id, isHidden: false }).populate('user', 'name').sort({ createdAt: -1 }).limit(30).lean(),
      Review.aggregate([{ $match: { movie: movie._id, isHidden: false } }, { $group: { _id: null, average: { $avg: '$rating' }, count: { $sum: 1 } } }])
    ]);
    res.json({ movie, reviews, rating: summary[0] || { average: null, count: 0 } });
  } catch (e) { next(e); }
});

router.post('/:id/reviews', requireAuth, async (req, res, next) => {
  try {
    const rating = Number(req.body.rating);
    const text = String(req.body.text || '').trim();
    if (!Number.isInteger(rating) || rating < 1 || rating > 5 || text.length > 1200)
      return res.status(400).json({ message: 'Provide a rating from 1 to 5 and review text under 1200 characters.' });
    const movie = await Movie.findOne({ _id: req.params.id, isPublished: true });
    if (!movie) return res.status(404).json({ message: 'Movie not found.' });
    const review = await Review.findOneAndUpdate(
      { movie: movie._id, user: req.user._id },
      { $set: { rating, text, isHidden: false } },
      { upsert: true, new: true, runValidators: true, setDefaultsOnInsert: true }
    );
    res.status(201).json({ review });
  } catch (e) { next(e); }
});

export default router;
