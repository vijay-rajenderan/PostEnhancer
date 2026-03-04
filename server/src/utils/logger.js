import winston from 'winston';

const { combine, timestamp, printf, colorize, json } = winston.format;

// Custom format for human-readable console output
const consoleFormat = printf(({ level, message, timestamp, correlationId }) => {
    return `${timestamp} [${correlationId || 'SYS'}] ${level}: ${message}`;
});

const logger = winston.createLogger({
    level: process.env.LOG_LEVEL || 'info',
    format: combine(
        timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        winston.format.errors({ stack: true }),
        winston.format.metadata({ fillExcept: ['message', 'level', 'timestamp'] }),
        json()
    ),
    defaultMeta: { service: 'linkedin-enhancer' },
    transports: [
        // Console transport for Docker logs
        new winston.transports.Console({
            format: combine(
                colorize(),
                timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
                consoleFormat
            )
        })
    ]
});

export default logger;
