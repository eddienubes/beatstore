const {Router} = require('express');
const {check} = require('express-validator');

const ordersController = require('../controllers/orders-controller');

const router = Router();

router.get('/users/:uid', ordersController.getOrdersByUserId)

router.get('/', ordersController.getAllOrders);

router.post('/paypal-create', [
        check('email')
            .isEmail()
            .not()
            .isEmpty(),
        check('cartItems').isArray()
    ],
    ordersController.createOrderWithPaypal);
router.post('/paypal-capture', [
        check('orderId').isString(),
        check('token').not().isEmpty()
    ],
    ordersController.captureOrderWithPaypal);

router.post('/wayforpay-capture', ordersController.captureOrderWithWayforpay);
router.get('/wayforpay-create', ordersController.createOrderWithWayforpay);

module.exports = router;