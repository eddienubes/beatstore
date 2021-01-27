const {Router} = require('express');

const ordersController = require('../controllers/orders-controller');''

const router = Router();

router.get('/', ordersController.getAllOrders);

router.post('/', ordersController.createOrder);

module.exports = router;