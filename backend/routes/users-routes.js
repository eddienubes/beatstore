const express = require('express');
const {Router} = require('express');
const bodyParser = require('body-parser');
const {check} = require('express-validator');
const checkStandardAuth = require('../middleware/check-standard-auth');
const checkGoogleAuth = require('../middleware/check-google-auth');
const checkRefreshToken = require('../middleware/check-refresh-token');
const usersControllers = require('../controllers/users-controller')
const checkBot = require('../middleware/check-bot-token');

const router = Router();

router.get('/', checkBot, usersControllers.getAllUsers);

router.get('/:uid', checkBot, usersControllers.getUserById);

router.get('/data/:uid', checkStandardAuth, usersControllers.getUserDataById);

router.get('/purchases/:uid', checkStandardAuth, usersControllers.getUserPurchasesById);

router.post('/login', usersControllers.login);

router.post('/verify/:confirmationCode', usersControllers.verifyUser);


router.post('/continue-google', checkGoogleAuth, usersControllers.googleContinue)

router.post('/token', checkRefreshToken, usersControllers.token)
router.post('/logout', checkStandardAuth, usersControllers.logout);

router.post(
    '/contact', [
        check('email').isEmail(),
        check('name').not().isEmpty(),
        check('subject').not().isEmpty(),
        check('message').not().isEmpty()
    ],
    usersControllers.contact);

router.post(
    '/signup',
    [
        check('username')
            .not()
            .isEmpty(),
        check('email')
            .isEmail(),
        check('password')
            .isLength({min: 6})
    ],
    usersControllers.signup
);

router.post('/:uid/cart', checkStandardAuth, usersControllers.appendInUserCart)

router.delete('/:uid/cart/:pid', checkStandardAuth, usersControllers.removeFromUserCart)

router.post('/cart', usersControllers.appendToCartOffline);
router.patch('/cart/:pid', usersControllers.removeFromCartOffline);

router.patch('/:uid', checkStandardAuth, usersControllers.updateUser)

module.exports = router;