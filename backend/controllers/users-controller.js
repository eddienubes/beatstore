const HttpError = require('../models/http-error');
const {v4: uuid} = require('uuid');
const {validationResult} = require('express-validator');

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
    const {userName, email, password} = req.body;

    let existingUser;
    try {
        existingUser = await User.findOne({email})
    } catch (e) {
        return next(
            new HttpError('Signing up has failed..', 500)
        );
    }

    if (existingUser) {
        return next(
            new HttpError('User with such email or userName already exists')
        );
    }

    const newUser = new User({
        userName,
        email,
        password,
    });

    try {
        await newUser.save();
    } catch (e) {
        return next(
            new HttpError('Something went wrong while saving new user to a database..')
        );
    }

    res.status(201);
    res.json({message: 'New user has been successfully created!', newUser: newUser.toObject({getters: true})});
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

    if (!existingUser || existingUser.password !== password) {
        return next(
            new HttpError('Invalid credentials..', 500)
        );
    }

    res.json({message: 'successfully logged in'});
};

module.exports = {
    getUserById,
    getAllUsers,
    signup,
    login
};
