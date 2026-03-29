const dotenv = require('dotenv');

dotenv.config();

const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT || 5000),
  nasaApiKey: process.env.NASA_API_KEY || 'DEMO_KEY',
  nasaBaseUrl: process.env.NASA_BASE_URL || 'https://api.nasa.gov',
  nasaTimeoutMs: Number(process.env.NASA_TIMEOUT_MS || 10000),
  nasaRetryCount: Number(process.env.NASA_RETRY_COUNT || 2),
  cacheTtlSeconds: Number(process.env.CACHE_TTL_SECONDS || 300),
  redisUrl: process.env.REDIS_URL || '',
  // Generous limits for development (1000/min); tighten for production
  rateLimitWindowMs: Number(process.env.RATE_LIMIT_WINDOW_MS || 60000),
  rateLimitMax: Number(process.env.RATE_LIMIT_MAX || 10000),
};

module.exports = env;
