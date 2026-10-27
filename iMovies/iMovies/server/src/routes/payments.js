
import { Router } from 'express';
import crypto from 'node:crypto';
import { requireAuth } from '../middleware/auth.js';
import Booking from '../models/Booking.js';

const router = Router();

/*
 * This endpoint deliberately does not mark bookings paid.
 * Implement provider order creation + signature/webhook verification before enabling real payments.
 */
router.post('/status', requireAuth, async (req, res, next) => {
  try {
    const booking = await Booking.findOne({ _id: req.body.bookingId, user: req.user._id });
    if (!booking) return res.status(404).json({ message: 'Booking not found.' });
    return res.status(501).json({
      message: 'Payment provider is not configured in this starter. No payment was taken and the booking is not confirmed.',
      bookingStatus: booking.status,
      paymentStatus: booking.paymentStatus
    });
  } catch (e) { next(e); }
});

export default router;
