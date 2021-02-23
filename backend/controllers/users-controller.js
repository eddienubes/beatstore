const HttpError = require('../models/http-error');
const {v4: uuid} = require('uuid');
const {validationResult} = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const Order = require('../models/order');
const User = require('../models/user');

const DUMMY_USERS = [
    {
        "id": 1,
        "cart": [1, 3, 4, 5, 6],
        "username": "DaBaby",
        "email": "DaBaby@gmail.com",
        "password": "DaBaby",
        "purchased": ["Vacation", "Racks"]
    },
    {
        "id": 2,
        "cart": [1, 3, 4, 5, 6],
        "username": "ToryLanez",
        "email": "ToryLanez@gmail.com",
        "password": "ToryLanez",
        "purchased": ["Cherry", "Maybe"]

    },
    {
        "id": 3,
        "cart": [2, 10, 2, 3, 1],
        "username": "Eminem",
        "email": "Eminem@gmail.com",
        "password": "Eminem",
        "purchased": ["Conscious", "Cannot"]
    }
];

const getUserById = (req, res, next) => {

    const userId = Number.parseInt(req.params.uid);
    const user = DUMMY_USERS.find(u => u.id === userId);

    if (!user) {
        return next(
            new HttpError('Couldn\'nt find a user for specified id!', 404)
        );
    }

    res.json(user);
};

const getAllUsers = async (req, res, next) => {
    let users;

    try {
        users = await User.find({}, '-password');
    } catch (e) {
        return next(
            new HttpError('Invalid inputs passed, please, check your data'),
            500
        );
    }
    res.json({
        message: 'All users have been successfully retrieved',
        users: users.map(u => u.toObject({getters: true}))
    });
};

const signup = async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return next(new HttpError('Invalid inputs passed, please, check your data'));
    }

    const {username, email, password} = req.body;

    let existingUser;
    try {
        existingUser = await User.findOne({email})
    } catch (e) {
        return next(
            new HttpError('Signing up has failed..', 500)
        );
    }

    if (existingUser && existingUser.password) {
        return next(
            new HttpError('User with such email or username already exists', 409)
        );
    }

    let hashedPassword;
    try {
        hashedPassword = await bcrypt.hash(password, 12);
    } catch (e) {
        return next(
            new HttpError('Could not create a user, please try again.', 500)
        );
    }

    let userToSend;
    let messageToSend;

    if (!existingUser) {
        const newUser = new User({
            username,
            email,
            password: hashedPassword,
        });

        try {
            await newUser.save();
        } catch (e) {
            return next(
                new HttpError('Something went wrong while saving new user to a database..', 500)
            );
        }

        userToSend = newUser;
        messageToSend = 'New user has been successfully created!';
    } else {
        existingUser.password = hashedPassword;
        existingUser.username = username;
        try {
            await existingUser.save();
        } catch (e) {
            return next(
                new HttpError('Something went wrong while trying to save existing user..')
            );
        }
        userToSend = existingUser;
        messageToSend = 'New registered user has been successfully created!';
    }

    let token;
    try {
        token = jwt.sign(
            {userId: userToSend.id, email: userToSend.email},
            'supersecret_do_not_share',
            {expiresIn: '1h'});
    } catch (e) {
        return next(
            new HttpError('Could not create a user, please try again.', 500)
        );
    }

    res.status(201);
    res.json({
        message: messageToSend,
        user: {
            id: userToSend.id,
            email: userToSend.email,
            username: userToSend.username,
            cart: userToSend.cart,
            purchased: userToSend.purchased,
            token: token
        }
    });
};

const login = async (req, res, next) => {
    const {email, password} = req.body;

    let existingUser;
    try {
        existingUser = await User.findOne({email})
    } catch (e) {
        return next(
            new HttpError('Logging in up has been failed..', 500)
        );
    }

    if (!existingUser) {
        console.log('DOES NOT EXIST')

        return next(
            new HttpError('Invalid credentials..', 401)
        );
    }

    let isValidPassword = false;
    try {
        isValidPassword = await bcrypt.compare(password, existingUser.password)
    } catch (e) {
        return next(
            new HttpError('Something went wrong while logging you in, please try again.', 500)
        );
    }

    if (!isValidPassword) {
        console.log('HERE INVALID')
        return next(
            new HttpError('Invalid credentials..', 401)
        );
    }

    let token;
    try {
        token = jwt.sign(
            {userId: existingUser, email: existingUser.email},
            'supersecret_do_not_share',
            {expiresIn: '1h'}
        );
    } catch (e) {
        return next(
            new HttpError('Could not log in, please try again.', 500)
        );
    }


    res.json({
        message: 'successfully logged in',
        user: {
            id: existingUser.id,
            email: existingUser.email,
            username: existingUser.username,
            cart: existingUser.cart,
            purchased: existingUser.purchased,
            token: token
        }
    });
};

const updateUser = async (req, res, next) => {
    const userId = req.params.uid;
    const {email, username, password, newPassword} = req.body;

    let user;
    try {
        user = await User.findById(userId);
    } catch (e) {
        return next(new HttpError('Something went wrong whilst trying to find user with specified id', 500));
    }

    if (!user) {
        return next(new HttpError('User has not been found..', 401));
    }

    let isPasswordValid;

    try {
        isPasswordValid = await bcrypt.compare(password, user.password);
    } catch (e) {
        return next(new HttpError('Something went wrong while bcrypting..', 500));
    }

    if (!isPasswordValid) {
        return next(new HttpError('Invalid credentials..', 401));
    }

    user.email = email;
    user.username = username;

    if (newPassword) {
        let hashedPassword;

        try {
            hashedPassword = await bcrypt.hash(password, 12);
        } catch (e) {
            return next(new HttpError('Something went wrong while hashing..', 500));
        }

        user.password = hashedPassword;
    }

    try {
        await user.save()
    } catch (e) {
        return next(new HttpError('Something went wrong while saving user..', 500));
    }

    res.status(200);
    res.json({
        message: 'User has been updated successfully',
        user: {
            id: user.id.toString(),
            username: user.username,
            email: user.email,
            cart: user.cart,
            purchased: user.purchased
        }
    });
}
// TODO add new action to update the user

module.exports = {
    getUserById,
    getAllUsers,
    signup,
    login,
    updateUser
};
