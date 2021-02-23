const express = require('express');
const {Router} = require('express');
const bodyParser = require('body-parser');
const {check} = require('express-validator');

const usersControllers = require('../controllers/users-controller')

const router = Router();

// router.get('/', usersControllers.getAllUsers);
//
// router.get('/:uid', usersControllers.getUserById);

router.patch('/:uid', usersControllers.updateUser)

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

router.post('/login', usersControllers.login);

module.exports = router;