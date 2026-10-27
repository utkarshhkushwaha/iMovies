
import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  movie: { type: mongoose.Schema.Types.ObjectId, ref: 'Movie', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  rating: { type: Number, min: 1, max: 5, required: true },
  text: { type: String, trim: true, maxlength: 1200, default: '' },
  isHidden: { type: Boolean, default: false }
}, { timestamps: true });

reviewSchema.index({ movie: 1, user: 1 }, { unique: true });
export default mongoose.model('Review', reviewSchema);
