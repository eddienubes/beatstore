const HttpError = require('../models/http-error');
const {v4: uuid} = require('uuid');
const {validationResult} = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const Order = require('../models/order');
const User = require('../models/user');
const License = require('../models/license');
const RefreshToken = require('../models/refresh-token');
const Beat = require('../models/beat');
const {populateUserCart, populateUserPurchases} = require('../shared/products');
const mailer = require('../shared/nodemailer');

const getUserById = async (req, res, next) => {
    const userId = req.params.uid;

    let user;
    try {
        user = await User.findById(userId, {
            password: false
        });
    } catch (e) {
        return next(new HttpError('An error occurred while trying to find user..', 500));
    }

    if (!user) {
        return next(
            new HttpError('Couldn\'t find a user with specified id!', 404)
        );
    }

    let purchased;
    try {
        purchased = await populateUserPurchases(user, next);
    } catch (e) {
        return next(new HttpError('An error occurred while trying to populate user..', 500));
    }


    res.status(200);
    res.json({
        message: 'Successfully retrieved a user',
        user: {
            ...user.toObject({getters: true}),
            purchased
        }
    });
};

const getAllUsers = async (req, res, next) => {
    let users;
    let {skip, limit} = req.query;

    try {
        skip = skip && /^\d+$/.test(skip) ? Number(skip) : 0;
        limit = limit && /^\d+$/.test(limit) ? Number(limit) : 10;

        users = await User
            .find({}, '-password', {skip})
            .limit(limit);
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

    const {username, email, password, clientIP} = req.body;

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
            new HttpError('User with such email already exists', 409)
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

    let orders;

    try {
        orders = await Order.find({email});
    } catch (e) {
        return next(new HttpError('Something went wrong while finding orders with such email!', 500));
    }


    const newUser = new User({
        username,
        email,
        password: hashedPassword,
        purchased: [...orders],
    });

    const confirmationToken = jwt.sign(
        {email, username},
        process.env.confirmationTokenSecret + newUser._id.toString());

    newUser.confirmationCode = confirmationToken;

    try {
        await newUser.save();
    } catch (e) {
        return next(
            new HttpError('Something went wrong while saving new user to a database..', 500)
        );
    }

    messageToSend = 'Check your email to verify your account';


    try {
        await mailer.sendEmail(email, 'Cherries By Beatstore purchase', 'user-verification', {
            username,
            confirmationUrl: clientIP + `/${confirmationToken}`
        });
    } catch (e) {
        return next(new HttpError('Something went wrong while sending email', 500));
    }

    res.status(201);
    res.json({message: messageToSend});

};

const login = async (req, res, next) => {
    const {email, password} = req.body;

    let existingUser;
    try {
        existingUser = await User.findOne({email}).populate({
            path: 'purchased',
            select: 'products date total',
            populate: {
                path: 'products',
                populate: [
                    {path: 'licenseId'}
                ]
            }
        });
    } catch (e) {
        console.log(e.message);
        return next(
            new HttpError('Logging in has failed..', 500)
        );
    }

    if (!existingUser || !existingUser?.password || existingUser.status !== 'Active') {
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
        return next(
            new HttpError('Invalid credentials..', 401)
        );
    }

    let token;
    let refreshToken;
    let refreshTokenExpirationDate;
    try {
        token = jwt.sign(
            {userId: existingUser._id.toString(), email: existingUser.email},
            process.env.secret,
            {expiresIn: process.env.tokenExpireTime}
        );
        const existingRefreshToken = await RefreshToken.findOne({email: existingUser.email});

        if (!existingRefreshToken || existingRefreshToken?.expirationDate.getTime() <= new Date().getTime()) {
            refreshToken = jwt.sign(
                {userId: existingUser._id.toString(), email: existingUser.email},
                process.env.refreshTokenSecret,
                {expiresIn: process.env.refreshTokenExpireTime}
            );

            // 1k milliseconds => 1 second => 1 minute => 1 hour => 1 day => 1 month (30 days)
            await existingRefreshToken?.remove();

            const newRefreshToken = new RefreshToken({
                email: existingUser.email,
                refreshToken: refreshToken,
                expirationDate: new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 30)
            });
            refreshTokenExpirationDate = newRefreshToken.expirationDate;
            await newRefreshToken.save();
        } else {
            refreshToken = existingRefreshToken.refreshToken;
            refreshTokenExpirationDate = existingRefreshToken.expirationDate;
        }
    } catch (e) {
        return next(
            new HttpError('Could not log in, please try again.', 500)
        );
    }

    let normalisedPurchases;
    try {
        normalisedPurchases = await populateUserPurchases(existingUser, next);
        await populateUserCart(existingUser, next);
    } catch (e) {
        console.log(e.message);
        return next(new HttpError('Error while populating user purchases or user cart...', 500));
    }

    res.status(200);
    res.json({
        message: 'Successfully logged in',
        user: {
            id: existingUser.id,
            email: existingUser.email,
            username: existingUser.username,
            cart: {
                items: existingUser.cart.items,
                total: Math.round((existingUser.cart.total + Number.EPSILON) * 100) / 100
            },
            purchased: normalisedPurchases,
            token: token,
            refreshToken: refreshToken,
            refreshTokenExpiration: refreshTokenExpirationDate
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

    let existingUser;
    try {
        existingUser = await User.findOne({email});
    } catch (e) {
        return next(new HttpError('Something went wrong whilst trying to find user with specified email', 500));
    }

    if (existingUser && email !== user.email) {
        return next(new HttpError('User with such email already exists..', 401));
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
            hashedPassword = await bcrypt.hash(newPassword, 12);
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

    try {
        await populateUserCart(user, next);
    } catch (e) {
        return next(new HttpError('Something went wrong while populating user cart..', 500));
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

const appendInUserCart = async (req, res, next) => {
    const userId = req.params.uid;
    const {product} = req.body;
    const userIdFromToken = req.userData.userId;

    if (userIdFromToken !== userId) {
        return next(new HttpError('Authentication has failed..', 401));
    }

    let user;
    try {
        user = await User.findById(userId);
    } catch (e) {
        return next(new HttpError('Something went wrong while trying to find such user..', 500));
    }

    if (!user) {
        return next(new HttpError('User with this id have not been found..', 401));
    }

    let license;
    try {
        license = await License.findById(product.licenseId);
    } catch (e) {
        console.log(e.message);
        return next(new HttpError('Something went wrong while trying to find such license in database..', 500));
    }

    const existingProductIndex = user.cart.items.findIndex(i => i.beatId.toString() === product.beatId.toString());

    if (!~existingProductIndex) {
        user.cart.total += license.price;
        user.cart.items.push({beatId: product.beatId, licenseId: product.licenseId});
    } else {
        let existingLicense;
        try {
            existingLicense = await License.findById(user.cart.items[existingProductIndex].licenseId);
        } catch (e) {
            return next(new HttpError('Something went wrong while trying to find license in database..', 500));
        }
        if (!existingLicense) {
            return next(new HttpError('License with such id does not exist...', 500));
        }

        user.cart.total += -existingLicense.price + license.price;
        user.cart.items[existingProductIndex].licenseId = license._id;
    }


    try {
        await user.save();
    } catch (e) {
        console.log(e.message)
        return next(new HttpError('Something went wrong while saving user to database..', 500));
    }

    try {
        await populateUserCart(user, next);
    } catch (e) {
        return next(new HttpError('Error while populating', 500));
    }

    res.status(200);
    res.json({
        message: 'Successfully added new beat into the cart',
        cart: {
            items: user.cart.items,
            total: Math.round((user.cart.total + Number.EPSILON) * 100) / 100
        }
    })
}

const removeFromUserCart = async (req, res, next) => {
    const productId = req.params.pid;
    const userId = req.params.uid;

    const userIdFromToken = req.userData.userId;

    if (userIdFromToken !== userId) {
        return next(new HttpError('Authentication has failed..', 401));
    }

    let user;
    try {
        user = await User.findById(userId);
    } catch (e) {
        return next(new HttpError('Something went wrong while trying to find such user..', 500));
    }

    if (!user) {
        return next(new HttpError('User with this id have not been found..', 401));
    }

    try {
        const sess = await mongoose.startSession();
        sess.startTransaction();

        const product = user.cart.items.find(p => {
            return p._id.toString() === productId
        });

        const license = await License.findById(product.licenseId);
        user.cart.total -= license.price;

        await user.cart.items.pull(productId);
        await user.save({session: sess});
        await sess.commitTransaction();
    } catch (e) {
        console.log(e.message);
        return next(new HttpError('Something went wrong while deleting product from cart', 401));
    }

    try {
        await populateUserCart(user, next);
    } catch (e) {
        return next(new HttpError('Something went wrong while populating user cart..', 500));
    }

    res.status(200);
    res.json({
        message: 'Successfully deleted item from cart',
        cart: {
            items: user.cart.items,
            total: Math.round((user.cart.total + Number.EPSILON) * 100) / 100
        }
    });
}

const googleContinue = async (req, res, next) => {
    const userData = req.userData;

    let user;
    try {
        user = await User.findOne({email: userData.email});
    } catch (e) {
        return next(new HttpError('Something went wring while trying to find user in database!', 500));
    }

    if (!user) {
        let orders;

        try {
            orders = await Order.find({email: userData.email});
        } catch (e) {
            return next(new HttpError('Something went wrong while finding orders with such email!', 500));
        }

        let newUser;
        try {
            newUser = new User({
                email: userData.email,
                username: userData.name,
                purchased: [...orders],
                status: 'Active'
            });
            await newUser.save();
        } catch (e) {
            return next(new HttpError('Error while saving new user who signed up with oauth..', 500));
        }

        let token;
        let refreshToken;
        let refreshTokenExpirationDate;
        try {
            token = jwt.sign(
                {userId: newUser._id.toString(), email: newUser.email},
                process.env.secret,
                {expiresIn: process.env.tokenExpireTime}
            );
            refreshToken = jwt.sign(
                {userId: newUser._id.toString(), email: userData.email},
                process.env.refreshTokenSecret,
                {expiresIn: process.env.refreshTokenExpireTime}
            );
            const newRefreshToken = new RefreshToken({
                refreshToken: refreshToken,
                email: newUser.email,
                expirationDate: new Date(new Date().getTime() * 1000 * 60 * 60 * 24 * 30)
            });
            await newRefreshToken.save();
            refreshTokenExpirationDate = newRefreshToken.expirationDate.toISOString();
        } catch (e) {
            return next(
                new HttpError('Could not log in, please try again.', 500)
            );
        }

        let normalizedPurchases;
        try {
            normalizedPurchases = await populateUserPurchases(newUser, next);
            await populateUserCart(newUser, next);
        } catch (e) {
            return next(new HttpError('Error while populating..', 500));
        }

        res.status(200);
        return res.json({
            message: 'Google signup was successful',
            user: {
                id: newUser.id,
                email: newUser.email,
                username: newUser.username,
                cart: {
                    items: newUser.cart.items,
                    total: Math.round((newUser.cart.total + Number.EPSILON) * 100) / 100
                },
                purchased: normalizedPurchases,
                token: token,
                refreshToken: refreshToken,
                refreshTokenExpiration: refreshTokenExpirationDate
            }
        });
    } else {
        let token;
        let refreshToken;
        let refreshTokenExpirationDate;
        try {
            token = jwt.sign(
                {userId: user._id.toString(), email: user.email},
                process.env.secret,
                {expiresIn: process.env.tokenExpireTime}
            );
            const existingRefreshToken = await RefreshToken.findOne({email: userData.email});

            if (!existingRefreshToken || existingRefreshToken?.expirationDate.getTime() <= new Date().getTime()) {
                refreshToken = jwt.sign(
                    {userId: user._id.toString(), email: userData.email},
                    process.env.refreshTokenSecret,
                    {expiresIn: process.env.refreshTokenExpireTime}
                );

                // 1k milliseconds => 1 second => 1 minute => 1 hour => 1 day => 1 month (30 days)
                await existingRefreshToken?.remove();

                const newRefreshToken = new RefreshToken({
                    email: userData.email,
                    refreshToken: refreshToken,
                    expirationDate: new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 30)
                });
                refreshTokenExpirationDate = newRefreshToken.expirationDate;
                await newRefreshToken.save();
            } else {
                refreshToken = existingRefreshToken.refreshToken;
                refreshTokenExpirationDate = existingRefreshToken.expirationDate;
            }
        } catch (e) {
            return next(
                new HttpError('Could not log in, please try again.', 500)
            );
        }

        let normalizedPurchases;
        try {
            normalizedPurchases = await populateUserPurchases(user, next);
            await populateUserCart(user, next);
        } catch (e) {
            console.log(e.message);
            return next(new HttpError('Error while populating..', 500));
        }
        console.log({
            id: user.id,
            email: user.email,
            username: user.username,
            cart: {
                items: user.cart.items,
                total: Math.round((user.cart.total + Number.EPSILON) * 100) / 100
            },
            purchased: normalizedPurchases,
            token: token,
            refreshToken: refreshToken,
            refreshTokenExpiration: refreshTokenExpirationDate
        });
        res.status(200);
        return res.json({
            message: 'Google login was successful',
            user: {
                id: user.id,
                email: user.email,
                username: user.username,
                cart: {
                    items: user.cart.items,
                    total: Math.round((user.cart.total + Number.EPSILON) * 100) / 100
                },
                purchased: normalizedPurchases,
                token: token,
                refreshToken: refreshToken,
                refreshTokenExpiration: refreshTokenExpirationDate
            }
        });
    }
}

const token = async (req, res, next) => {
    const userData = req.userData;
    let token;
    try {
        token = jwt.sign(
            {userId: userData.userId, email: userData.email},
            process.env.secret,
            {expiresIn: process.env.tokenExpireTime});
    } catch (e) {
        console.log(e.message);
        return next(new HttpError('Error while refreshing token', 500));
    }

    res.status(200);
    res.json({message: 'Successfully refreshed access token!', accessToken: token})
}

const logout = async (req, res, next) => {
    const {userId} = req.userData;

    let user;
    try {
        user = await User.findById(userId);
    } catch (e) {
        return next(new HttpError('Error while finding user..', 500))
    }

    let refreshToken;
    try {
        refreshToken = await RefreshToken.findOne({email: user.email});
        await refreshToken?.remove()
    } catch (e) {
        return next(new HttpError('Error while finding user..', 500))
    }

    res.status(200)
    res.json({message: 'Logged out successfully'});
};

const appendToCartOffline = async (req, res, next) => {
    const {cart} = req.body;
    const {product} = req.body.product;

    let license;
    try {
        license = await License.findById(product.licenseId);
    } catch (e) {
        console.log(e.message);
        return next(new HttpError('Something went wrong while trying to find such license in database..', 500));
    }

    const existingProductIndex = cart.items.findIndex(i => i.beatId._id.toString() === product.beatId.toString());

    if (!~existingProductIndex) {
        let beat;
        let license;
        try {
            beat = await Beat.findById(product.beatId, {'mp3Url': 0, 'wavUrl': 0, 'stemsUrl': 0});
            license = await License.findById(product.licenseId)
        } catch (e) {
            return next(new HttpError('Something went wring while finding license and beat in db..', 500));
        }
        if (!beat || !license) {
            return next(new HttpError('Beat or license with such ids have not been found', 500));
        }

        cart.total += license.price;
        cart.items.push({_id: uuid(), beatId: beat, licenseId: license});
    } else {
        let existingLicense;
        try {
            existingLicense = await License.findById(cart.items[existingProductIndex].licenseId);
        } catch (e) {
            return next(new HttpError('Something went wrong while trying to find license in database..', 500));
        }
        if (!existingLicense) {
            return next(new HttpError('License with such id does not exist...', 500));
        }

        cart.total += -existingLicense.price + license.price;
        cart.items[existingProductIndex].licenseId = license._id;
    }

    res.status(200);
    res.json({
        message: 'Successfully added item to cart of unregistered user',
        cart: cart
    });
}

const removeFromCartOffline = async (req, res, next) => {
    const productId = req.params.pid;
    const {cart} = req.body;

    try {

        const productIndex = cart.items.findIndex(p => {
            return p._id === productId;
        });
        const license = await License.findById(cart.items[productIndex].licenseId._id);
        cart.total -= license.price;
        cart.items.splice(productIndex, 1);

    } catch (e) {
        console.log(e.message);
        return next(new HttpError('Something went wrong while deleting product from cart', 401));
    }

    res.status(200);
    res.json({
        message: 'Successfully removed item to cart of unregistered user',
        cart: cart
    })
}

const verifyUser = async (req, res, next) => {
    const confirmationCode = req.params.confirmationCode;

    let user;
    try {
        user = await User.findOne({confirmationCode});
    } catch (e) {
        console.log(e.message);
        return next(new HttpError('Error while trying to find a user..', 500));
    }
    if (!user || user.status === 'Active') {
        return next(new HttpError('Wrong confirmation code..', 301));
    }

    user.status = 'Active';

    try {
        await user.save();
    } catch (e) {
        return next(new HttpError('Error while saving user..', 500));
    }
    let token;
    let refreshToken;
    let refreshTokenExpirationDate;

    try {
        token = jwt.sign(
            {userId: user.id.toString(), email: user.email},
            process.env.secret,
            {expiresIn: process.env.tokenExpireTime}
        );
        refreshToken = jwt.sign(
            {userId: user._id.toString(), email: user.email},
            process.env.refreshTokenSecret,
            {expiresIn: process.env.refreshTokenExpireTime}
        );
        const newRefreshToken = new RefreshToken({
            refreshToken,
            email: user.email,
            expirationDate: new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 30)
        });
        await newRefreshToken.save();
        refreshTokenExpirationDate = newRefreshToken.expirationDate;
    } catch (e) {
        console.log(e.message);
        return next(
            new HttpError('Could not create a user, please try again.', 500)
        );
    }
    let normalizedPurchasesList;
    try {
        normalizedPurchasesList = await populateUserPurchases(user, next);
    } catch (e) {
        console.log(e.message);
        return next(new HttpError('Error while populating user purchased list', 500));
    }

    res.status(201);
    res.json({
        message: 'Successfully activated new user',
        user: {
            id: user._id.toString(),
            email: user.email,
            username: user.username,
            cart: {
                items: user.cart.items,
                total: Math.round((user.cart.total + Number.EPSILON) * 100) / 100
            },
            purchased: normalizedPurchasesList,
            token: token,
            refreshToken: refreshToken,
            refreshTokenExpiration: refreshTokenExpirationDate
        }
    });


}

const contact = async (req, res, next) => {
    const {name, email, subject, message} = req.body;

    try {
        await mailer.sendEmail(process.env.gmailOwner, subject, 'contact', {
            name,
            email,
            subject,
            message
        });
    } catch (e) {
        return next(new HttpError('Something went wrong while sending contact email', 500));
    }

    res.status(200);
    res.json({message: 'Successfully sent. I will read your message in 1 day, thank you.'});
}

const getUserDataById = async (req, res, next) => {
    const userId = req.params.uid;

    let user;
    try {
        user = await User.findById(userId);
    } catch (e) {
        return next(new HttpError('An error occurred while trying to find user with such id..', 500));
    }

    if (!user) {
        return next(new HttpError('User has not been found!', 403));
    }

    try {
        await populateUserCart(user, next);
    } catch (e) {
        return next(new HttpError('An error occurred while populating user cart', 500));
    }

    let purchased;
    try {
        purchased = await populateUserPurchases(user, next);
    } catch (e) {
        return next(new HttpError('An error occurred while populating user purchases', 500));
    }

    res.status(200);
    res.json({
        message: 'Successfully retrieved user cart!', user: {
            cart: user.cart,
            purchased
        }
    });
}

const getUserPurchasesById = async (req, res, next) => {
    const userId = req.params.uid;

    let user;
    try {
        user = await User.findById(userId);
    } catch (e) {
        return next(new HttpError('An occurred while trying to find user', 500));
    }

    if (!user) {
        return next(new HttpError('No user found with such id', 403));
    }

    let purchases;
    try {
        purchases = await populateUserPurchases(user, next);
    } catch (e) {
        return next(new HttpError('An occurred while trying to populate user purchases', 500));
    }

    res.status(200);
    res.json({message: 'Successfully retrieved user purchases!', purchases})
}

module.exports = {
    getUserById,
    getAllUsers,
    signup,
    login,
    updateUser,
    appendInUserCart,
    removeFromUserCart,
    googleContinue,
    token,
    logout,
    appendToCartOffline,
    removeFromCartOffline,
    verifyUser,
    contact,
    getUserDataById,
    getUserPurchasesById
};
