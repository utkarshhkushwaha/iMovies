
import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  reference: { type: String, required: true, unique: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  show: { type: mongoose.Schema.Types.ObjectId, ref: 'Show', required: true },
  movieTitle: { type: String, required: true },
  theaterName: { type: String, required: true },
  startsAt: { type: Date, required: true },
  seatCodes: [{ type: String, required: true }],
  amount: { type: Number, required: true, min: 0 },
  status: { type: String, enum: ['pending_payment', 'confirmed', 'cancelled', 'payment_failed'], default: 'pending_payment' },
  paymentStatus: { type: String, enum: ['not_started', 'pending', 'paid', 'failed', 'refunded'], default: 'not_started' },
  holdToken: { type: String, required: true }
}, { timestamps: true });

export default mongoose.model('Booking', bookingSchema);
