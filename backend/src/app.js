const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const nasaRoutes = require('./routes/nasaRoutes');
const apiRateLimiter = require('./middlewares/rateLimiter');
const { notFoundHandler, errorHandler } = require('./middlewares/errorHandler');

const app = express();

app.set('trust proxy', 1);
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.get('/', (req, res) => {
  res.json({
    status: 'ok',
    service: 'Space Research Backend',
    health: '/health',
  });
});

app.use('/api', apiRateLimiter, nasaRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
