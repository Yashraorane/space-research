const axios = require('axios');
const axiosRetry = require('axios-retry').default;
const http = require('http');
const https = require('https');
const cache = require('../config/cache');
const env = require('../config/env');
const ApiError = require('../utils/ApiError');

const inFlightRequests = new Map();

const nasaClient = axios.create({
  baseURL: env.nasaBaseUrl,
  timeout: env.nasaTimeoutMs,
  httpAgent: new http.Agent({ keepAlive: true, maxSockets: 50 }),
  httpsAgent: new https.Agent({ keepAlive: true, maxSockets: 50 }),
});

axiosRetry(nasaClient, {
  retries: env.nasaRetryCount,
  retryDelay: axiosRetry.exponentialDelay,
  retryCondition: (error) =>
    axiosRetry.isNetworkOrIdempotentRequestError(error) ||
    error.response?.status === 429,
});

nasaClient.interceptors.request.use((config) => {
  config.params = {
    ...(config.params || {}),
    api_key: env.nasaApiKey,
  };
  return config;
});

function buildCacheKey(prefix, params) {
  const sortedParams = Object.entries(params || {})
    .sort(([keyA], [keyB]) => keyA.localeCompare(keyB))
    .reduce((acc, [key, value]) => {
      acc[key] = value;
      return acc;
    }, {});

  return `${prefix}:${JSON.stringify(sortedParams)}`;
}

function normalizeParams(params) {
  return Object.entries(params)
    .filter(([, value]) => value !== undefined && value !== null && value !== '')
    .reduce((acc, [key, value]) => {
      acc[key] = value;
      return acc;
    }, {});
}

async function fetchFromNasa(path, params, cacheKey) {
  const cached = await cache.get(cacheKey);

  if (cached) {
    return cached;
  }

  if (inFlightRequests.has(cacheKey)) {
    return inFlightRequests.get(cacheKey);
  }

  const requestPromise = (async () => {
    try {
      const { data } = await nasaClient.get(path, {
        params: normalizeParams(params),
      });

      await cache.set(cacheKey, data);
      return data;
    } catch (error) {
      const upstreamStatus = error.response?.status;
      const isMarsRequest = path.includes('/mars-photos/');
      const isMarsUnavailable = isMarsRequest && upstreamStatus === 404;
      const statusCode = isMarsUnavailable ? 503 : upstreamStatus || 502;
      const message =
        (isMarsUnavailable
          ? 'NASA Mars Photos API is temporarily unavailable. Please try again later.'
          : undefined) ||
        error.response?.data?.error?.message ||
        error.response?.data?.msg ||
        'Failed to fetch data from NASA API';

      throw new ApiError(statusCode, message);
    } finally {
      inFlightRequests.delete(cacheKey);
    }
  })();

  inFlightRequests.set(cacheKey, requestPromise);
  return requestPromise;
}

async function getApod() {
  const cacheKey = 'apod:today';
  return fetchFromNasa('/planetary/apod', {}, cacheKey);
}

async function getMarsPhotos({ rover = 'curiosity', date }) {
  const queryDate = date || new Date().toISOString().slice(0, 10);
  const params = { earth_date: queryDate };
  const cacheKey = buildCacheKey('mars', { rover, queryDate });

  return fetchFromNasa(`/mars-photos/api/v1/rovers/${rover}/photos`, params, cacheKey);
}

async function getAsteroids({ start_date, end_date }) {
  const params = {
    start_date,
    end_date,
  };

  const cacheKey = buildCacheKey('asteroids', params);
  return fetchFromNasa('/neo/rest/v1/feed', params, cacheKey);
}

module.exports = {
  getApod,
  getMarsPhotos,
  getAsteroids,
};
