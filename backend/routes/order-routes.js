const {Router} = require('express');
const {check} = require('express-validator');
const checkBot = require('../middleware/check-bot-token');

const ordersController = require('../controllers/orders-controller');

const router = Router();

// router.get('/users/:uid', ordersController.getOrdersByUserId)

router.get('/', checkBot, ordersController.getAllOrders);

router.get('/:oid', checkBot, ordersController.getOrderById);

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

router.post('/wayforpay-capture', [
    check('amount')
        .isNumeric()
        .not()
        .isEmpty(),
    check('transactionStatus')
        .isLength({min: 4}),
    check('orderReference')
        .isLength({min: 6}),
    check('merchantSignature')
        .isLength({min: 6}),
    check('clientName')
        .not()
        .isEmpty()
], ordersController.captureOrderWithWayforpay);

router.post('/wayforpay-create', [
        check('email')
            .isEmail()
            .not()
            .isEmpty(),
        check('cartItems').isArray()
    ],
    ordersController.createOrderWithWayforpay);

module.exports = router;