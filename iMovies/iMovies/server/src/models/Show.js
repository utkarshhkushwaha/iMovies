
import mongoose from 'mongoose';

const seatSchema = new mongoose.Schema({
  code: { type: String, required: true },
  category: { type: String, enum: ['standard', 'premium'], default: 'standard' },
  price: { type: Number, required: true, min: 0 },
  status: { type: String, enum: ['available', 'held', 'booked'], default: 'available' },
  holdToken: { type: String, default: null },
  holdUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  holdExpiresAt: { type: Date, default: null },
  bookingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', default: null }
}, { _id: false });

const showSchema = new mongoose.Schema({
  movie: { type: mongoose.Schema.Types.ObjectId, ref: 'Movie', required: true, index: true },
  theaterName: { type: String, required: true },
  city: { type: String, required: true },
  screenName: { type: String, default: 'Screen 1' },
  startsAt: { type: Date, required: true, index: true },
  seats: { type: [seatSchema], default: [] },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

export default mongoose.model('Show', showSchema);
