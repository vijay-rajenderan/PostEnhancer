import { v4 as uuidv4 } from 'uuid';
import logger from '../utils/logger.js';

/**
 * Middleware to attach a unique Correlation-ID to every request for tracing.
 * Adheres to the observability requirement in development_principles.md.
 */
export const requestTracing = (req, res, next) => {
    const correlationId = req.headers['x-correlation-id'] || uuidv4();

    // Attach to request and response
    req.correlationId = correlationId;
    res.setHeader('x-correlation-id', correlationId);

    // Initial request log
    logger.info(`${req.method} ${req.url}`, {
        correlationId,
        method: req.method,
        url: req.url,
        ip: req.ip
    });

    next();
};
