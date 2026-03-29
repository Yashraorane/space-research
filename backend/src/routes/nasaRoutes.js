const express = require('express');
const nasaController = require('../controllers/nasaController');
const validateRequest = require('../middlewares/validateRequest');
const { marsPhotosValidator, asteroidsValidator } = require('../validators/nasaValidators');

const router = express.Router();

router.get('/apod', nasaController.getApod);
router.get('/mars-photos', marsPhotosValidator, validateRequest, nasaController.getMarsPhotos);
router.get('/asteroids', asteroidsValidator, validateRequest, nasaController.getAsteroids);

module.exports = router;
