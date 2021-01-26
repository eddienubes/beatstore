const HttpError = require('../models/http-error');
const {v4: uuid} = require('uuid');
const {validationResult} = require('express-validator');

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

const getAllUsers = (req, res, next) => {
    res.json(DUMMY_USERS);
};

const signup = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        throw new HttpError('Invalid inputs passed, please, check your data');
    }
    const {userName, email, password} = req.body;

    const hasUser = DUMMY_USERS.find(u => u.email === email);

    if (hasUser) {
        throw new HttpError('User with this email already exists', 422);
    }

    const newUser = {
        id: uuid(),
        userName,
        email,
        password,
        purchased: [],
        cart: []
    };

    DUMMY_USERS.push(newUser);

    res.status(201);

    res.json(newUser);
};

const login = (req, res, next) => {
    const {email, password} = req.body;
    console.log(DUMMY_USERS);
    console.log(email, password);
    const identifiedUser = DUMMY_USERS.find(u => u.email === email);
    console.log(identifiedUser);
    if (!identifiedUser || identifiedUser.password !== password) {
        console.log('here');
        throw new HttpError('Couldn\'t identify user, credentials seem to be wrong!', 401);
    }

    res.json({message: 'successfully logged in'});
};

module.exports = {
    getUserById,
    getAllUsers,
    signup,
    login
};
