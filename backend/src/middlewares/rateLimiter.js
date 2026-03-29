const rateLimit = require('express-rate-limit');
const env = require('../config/env');

const apiRateLimiter = rateLimit({
  windowMs: env.rateLimitWindowMs,
  max: env.rateLimitMax,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: {
    success: false,
    error: 'Too many requests. Please try again shortly.',
  },
});

module.exports = apiRateLimiter;
