import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import logger from './utils/logger.js';
import { requestTracing } from './middleware/tracing.middleware.js';
import apiRoutes from './routes/api.js';

import { rateLimit } from 'express-rate-limit';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Trust proxy if behind Docker/Load Balancer
app.set('trust proxy', 1);

// Rate Limiter: 100 requests per 15 minutes per IP
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Too many requests, please try again later.' }
});

app.use(cors());
app.use(express.json());
app.use('/api/', limiter);

// Apply Request Tracing to all requests
app.use(requestTracing);

// API Routes
app.use('/api', apiRoutes);

// Health Check
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'UP',
        timestamp: new Date().toISOString(),
        correlationId: req.correlationId
    });
});

// Centralized Error Handling Middleware (Basic)
app.use((err, req, res, next) => {
    logger.error('Unhandled Exception', {
        error: err.message,
        correlationId: req.correlationId
    });
    res.status(500).json({ error: 'Something went wrong' });
});

app.listen(PORT, () => {
    logger.info(`Server is running on port ${PORT}`);
});
