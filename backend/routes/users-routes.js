const express = require('express');
const {Router} = require('express');
const bodyParser = require('body-parser');
const {check} = require('express-validator');
const checkAuth = require('../middleware/check-auth');
const usersControllers = require('../controllers/users-controller')

const router = Router();

// router.get('/', usersControllers.getAllUsers);
//
// router.get('/:uid', usersControllers.getUserById);

router.patch('/:uid', usersControllers.updateUser)

router.post('/login', usersControllers.login);

router.post(
    '/signup',
    [
        check('username')
            .not()
            .isEmpty(),
        check('email')
            .normalizeEmail()
            .isEmail(),
        check('password')
            .isLength({min: 6})
    ],
    usersControllers.signup
);


router.use(checkAuth);

router.post('/:uid/cart', usersControllers.appendInUserCart)

router.delete('/:uid/cart/:pid', usersControllers.removeFromUserCart)

module.exports = router;