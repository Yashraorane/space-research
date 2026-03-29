const nasaService = require('../services/nasaService');

async function getApod(req, res, next) {
  try {
    const data = await nasaService.getApod();
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
}

async function getMarsPhotos(req, res, next) {
  try {
    const { rover, date } = req.query;
    const data = await nasaService.getMarsPhotos({ rover, date });
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
}

async function getAsteroids(req, res, next) {
  try {
    const { start_date, end_date } = req.query;
    const data = await nasaService.getAsteroids({ start_date, end_date });
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getApod,
  getMarsPhotos,
  getAsteroids,
};
