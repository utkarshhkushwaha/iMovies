
import mongoose from 'mongoose';

const movieSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, index: true },
  synopsis: { type: String, default: '' },
  posterUrl: { type: String, default: '' },
  backdropUrl: { type: String, default: '' },
  genres: [{ type: String }],
  languages: [{ type: String }],
  runtimeMinutes: { type: Number, min: 1 },
  releaseDate: { type: Date },
  cast: [{ type: String }],
  trailerUrl: { type: String, default: '' },
  tmdbId: { type: Number, sparse: true, unique: true },
  isPublished: { type: Boolean, default: true }
}, { timestamps: true });

movieSchema.index({ title: 'text', synopsis: 'text' });
export default mongoose.model('Movie', movieSchema);
