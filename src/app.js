import express from 'express';
import { errorHandler } from './middlewares/error.middleware.js';
import authRoutes from './routes/auth.route.js';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);

// Global Error Handler
app.use(errorHandler);

export default app;
