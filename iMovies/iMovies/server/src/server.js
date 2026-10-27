
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import { connectDB } from './config/db.js';
import authRoutes from './routes/auth.js';
import movieRoutes from './routes/movies.js';
import showRoutes from './routes/shows.js';
import bookingRoutes from './routes/bookings.js';
import userRoutes from './routes/users.js';
import adminRoutes from './routes/admin.js';
import paymentRoutes from './routes/payments.js';
import { notFound, errorHandler } from './middleware/errors.js';

const app = express();
app.disable('x-powered-by');
app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173', credentials: true }));
app.use(express.json({ limit: '1mb' }));
app.use(cookieParser());
app.use('/api/auth', rateLimit({ windowMs: 15 * 60 * 1000, limit: 100, standardHeaders: true, legacyHeaders: false }));
app.get('/api/health', (req, res) => res.json({ status: 'ok', service: 'iMovies API' }));
app.use('/api/auth', authRoutes);
app.use('/api/movies', movieRoutes);
app.use('/api/shows', showRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/payments', paymentRoutes);
app.use(notFound);
app.use(errorHandler);

const port = Number(process.env.PORT || 5000);
connectDB().then(() => app.listen(port, () => console.log(`iMovies API listening on http://localhost:${port}`)))
  .catch(err => { console.error('Could not start API:', err.message); process.exit(1); });
