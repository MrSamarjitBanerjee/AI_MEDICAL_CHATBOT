// Global Error Middleware - Production ready
const logger = require('../utils/logger');

const errorMiddleware = (err, req, res, next) => {
  logger.error('Global error caught', {
    path: req.path,
    method: req.method,
    message: err.message,
    stack: err.stack,
    status: err.status || 500
  });

  const status = err.status || 500;
  const message = process.env.NODE_ENV === 'production' 
    ? 'Internal Server Error' 
    : err.message;

  res.status(status).json({
    error: true,
    message
  });
};

module.exports = errorMiddleware;

