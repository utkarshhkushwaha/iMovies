
import 'dotenv/config';
import mongoose from 'mongoose';
import { connectDB } from '../config/db.js';
import Movie from '../models/Movie.js';
import Show from '../models/Show.js';

const demos = [
  { title: 'The Silent Orbit', synopsis: 'A small research crew receives a signal from beyond the edge of mapped space. Demo catalog entry for local development.', genres: ['Science Fiction', 'Drama'], languages: ['English'], runtimeMinutes: 124, releaseDate: new Date('2026-08-14'), posterUrl: 'https://placehold.co/600x900/171717/f5f5f5?text=The+Silent+Orbit', cast: [], isPublished: true },
  { title: 'Monsoon Letters', synopsis: 'Two old friends reconnect through a box of letters discovered during a rainy season. Demo catalog entry for local development.', genres: ['Drama', 'Romance'], languages: ['Hindi'], runtimeMinutes: 116, releaseDate: new Date('2026-07-03'), posterUrl: 'https://placehold.co/600x900/171717/f5f5f5?text=Monsoon+Letters', cast: [], isPublished: true },
  { title: 'The Last Checkout', synopsis: 'A night-shift cashier finds a clue that changes the course of a quiet town. Demo catalog entry for local development.', genres: ['Thriller'], languages: ['English', 'Hindi'], runtimeMinutes: 109, releaseDate: new Date('2026-09-11'), posterUrl: 'https://placehold.co/600x900/171717/f5f5f5?text=The+Last+Checkout', cast: [], isPublished: true }
];

try {
  await connectDB();
  for (const movie of demos) {
    await Movie.updateOne({ title: movie.title }, { $setOnInsert: movie }, { upsert: true });
  }
  const movies = await Movie.find({ title: { $in: demos.map(m => m.title) } });
  if (await Show.countDocuments() === 0) {
    const start = new Date(Date.now() + 24 * 60 * 60 * 1000);
    const seats = [];
    for (let r = 0; r < 5; r++) for (let n = 1; n <= 8; n++) {
      const category = r < 2 ? 'premium' : 'standard';
      seats.push({ code: `${String.fromCharCode(65 + r)}${n}`, category, price: category === 'premium' ? 260 : 180, status: 'available' });
    }
    await Show.create(movies.map((movie, i) => ({
      movie: movie._id, theaterName: 'iMovies Demo Cinema', city: 'Bhopal',
      screenName: `Screen ${i + 1}`, startsAt: new Date(start.getTime() + i * 3 * 60 * 60 * 1000), seats
    })));
  }
  console.log('Demo catalog seeded. Entries are clearly marked as development samples.');
} catch (e) {
  console.error(e);
  process.exitCode = 1;
} finally {
  await mongoose.disconnect();
}
