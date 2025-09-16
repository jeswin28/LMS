// lms-backend/server.js
const { connectDB } = require('./config/db');
const app = require('./app');
const { cleanEnv, str, num } = require('envalid');
const winston = require('winston');
const path = require('path');

// Logger setup
const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    // File transports for production debugging and audits
    new winston.transports.File({ filename: path.join('logs', 'error.log'), level: 'error' }),
    new winston.transports.File({ filename: path.join('logs', 'combined.log') }),
    // Console transport for dev visibility
    new winston.transports.Console({
      format: winston.format.simple(),
    }),
  ],
});

// Validate environment variables
const env = cleanEnv(process.env, {
  NODE_ENV: str({ choices: ['development', 'test', 'production'] }),
  PORT: num({ default: 5000 }),
  JWT_SECRET: str(),
});

// Connect to database
connectDB();

const PORT = env.PORT;

const server = app.listen(PORT, () => logger.info(`Server running in ${env.NODE_ENV} on port ${PORT}`));

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  logger.error(`Unhandled Rejection: ${err.message}`);
  server.close(() => process.exit(1));
});

module.exports = server;