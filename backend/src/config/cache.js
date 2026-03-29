const NodeCache = require('node-cache');
const { createClient } = require('redis');
const env = require('./env');

const memoryCache = new NodeCache({ stdTTL: env.cacheTtlSeconds, checkperiod: 120 });

let redisClient;
let redisConnectPromise;

async function getRedisClient() {
  if (!env.redisUrl) {
    return null;
  }

  if (!redisClient) {
    redisClient = createClient({
      url: env.redisUrl,
      socket: {
        reconnectStrategy: (retries) => Math.min(50 * retries, 2000),
      },
    });

    redisClient.on('error', () => {
      // Redis outages should not break API calls because memory cache is the fallback.
    });
  }

  if (!redisClient.isOpen) {
    redisConnectPromise = redisConnectPromise || redisClient.connect().catch(() => null);
    await redisConnectPromise;
    redisConnectPromise = null;
  }

  return redisClient.isOpen ? redisClient : null;
}

async function get(key) {
  const client = await getRedisClient();

  if (client) {
    const value = await client.get(key);
    if (value) {
      return JSON.parse(value);
    }
  }

  return memoryCache.get(key);
}

async function set(key, value, ttlSeconds = env.cacheTtlSeconds) {
  const client = await getRedisClient();

  if (client) {
    await client.set(key, JSON.stringify(value), { EX: ttlSeconds });
  }

  memoryCache.set(key, value, ttlSeconds);
}

module.exports = {
  get,
  set,
};
