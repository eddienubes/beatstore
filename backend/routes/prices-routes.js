const {Router} = require('express');
const pricesController = require('../controllers/prices-controller');
const router = Router();

router.get('/', pricesController.getAllPrices);

router.patch('/', pricesController.updatePrice);

router.post('/', pricesController.createPrice);

module.exports = router;