
import { Router } from 'express';
import User from '../models/User.js';
import Movie from '../models/Movie.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.get('/me', requireAuth, (req, res) => res.json({ user: { id: req.user._id, name: req.user.name, email: req.user.email, role: req.user.role } }));

router.get('/watchlist', requireAuth, async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).populate('watchlist').lean();
    res.json({ movies: user.watchlist || [] });
  } catch (e) { next(e); }
});

router.post('/watchlist/:movieId', requireAuth, async (req, res, next) => {
  try {
    if (!await Movie.exists({ _id: req.params.movieId, isPublished: true })) return res.status(404).json({ message: 'Movie not found.' });
    await User.updateOne({ _id: req.user._id }, { $addToSet: { watchlist: req.params.movieId } });
    res.json({ message: 'Added to watchlist.' });
  } catch (e) { next(e); }
});

router.delete('/watchlist/:movieId', requireAuth, async (req, res, next) => {
  try {
    await User.updateOne({ _id: req.user._id }, { $pull: { watchlist: req.params.movieId } });
    res.json({ message: 'Removed from watchlist.' });
  } catch (e) { next(e); }
});

export default router;
