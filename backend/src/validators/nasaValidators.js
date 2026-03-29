const { query } = require('express-validator');

const ROVERS = ['curiosity', 'opportunity', 'spirit', 'perseverance'];

const marsPhotosValidator = [
  query('rover')
    .optional()
    .isIn(ROVERS)
    .withMessage(`rover must be one of: ${ROVERS.join(', ')}`),
  query('date')
    .optional()
    .isISO8601()
    .withMessage('date must be in YYYY-MM-DD format'),
];

const asteroidsValidator = [
  query('start_date')
    .optional()
    .isISO8601()
    .withMessage('start_date must be in YYYY-MM-DD format'),
  query('end_date')
    .optional()
    .isISO8601()
    .withMessage('end_date must be in YYYY-MM-DD format'),
];

module.exports = {
  marsPhotosValidator,
  asteroidsValidator,
};
