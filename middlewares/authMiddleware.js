// JWT Authentication Middleware
const logger = require('../utils/logger');
const { verifyToken } = require('../utils/jwtUtils');

const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  logger.debug(`Auth middleware for ${req.path}, token present: ${!!token}`);

  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    const decoded = verifyToken(token);
    logger.debug(`Token verified for user: ${decoded.id}`);
    req.user = decoded;
    next();
  } catch (error) {
    logger.error(`Token verification failed: ${error.message}`);
    return res.status(401).json({ message: 'Invalid token' });
  }
};

module.exports = authMiddleware;

