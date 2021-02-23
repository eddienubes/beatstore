const HttpError = require('../models/http-error');
const {v4: uuid} = require('uuid');
const {validationResult} = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const Order = require('../models/order');
const User = require('../models/user');
const License = require('../models/license');

const populateUserCart = async (user, next) => {
    try {
        await user.populate([
            {
                path: 'cart.items.beatId',
                select: 'title imgUrl'
            },
            {path: "cart.items.licenseId"}]).execPopulate();
    } catch (e) {
        return next(new HttpError('Something went wrong while populating beats..', 500));
    }
}

const populateUserPurchases = async (user, next) => {
    const baseSelect = 'previewAudioUrl imgUrl title scale bpm';

    const beatProjectionsToLicenseTypes = [
        {
            labels: ['MP3 audio'],
            type: 1,
            select: 'mp3Url ' + baseSelect
        },
        {
            labels: ['MP3 audio', 'WAV audio'],
            type: 2,
            select: 'mp3Url wavUrl ' + baseSelect
        },
        {
            labels: ['MP3 audio', 'WAV audio', 'STEMS'],
            type: 3,
            select: 'mp3Url wavUrl stemsUrl ' + baseSelect
        },
        {
            labels: ['MP3 audio', 'WAV audio', 'STEMS'],
            type: 4,
            select: 'mp3Url wavUrl stemsUrl ' + baseSelect
        }
    ];

    let normalizedPurchasesList = [];

    // fucking javascript below
    try {
        await Promise.all(user.purchased.map(async (order, orderIndex) => {
            await Promise.all(order.products.map(async (product, productIndex) => {
                await Promise.all(beatProjectionsToLicenseTypes.map(async proj => {
                    if (product.licenseId.type === proj.type) {
                        await user.populate({
                            path: `purchased.${orderIndex}.products.${productIndex}.beatId`,
                            select: proj.select
                        })
                            .execPopulate()
                            .then(data => {
                                let links = [];

                                const licenseUrlKeys = proj.select
                                    .replace(new RegExp('\\s' + baseSelect), '')
                                    .split(/\s+/);

                                licenseUrlKeys.map((l, index) => {
                                    links.push({
                                        label: proj.labels[index],
                                        url: data.purchased[orderIndex].products[productIndex].beatId[l]
                                    });
                                });

                                normalizedPurchasesList.push({
                                    beatId: user.purchased[orderIndex].products[productIndex].beatId._id.toString(),
                                    licenseId: user.purchased[orderIndex].products[productIndex].licenseId._id.toString(),
                                    orderId: user.purchased[orderIndex]._id.toString(),
                                    licenseType: user.purchased[orderIndex].products[productIndex].licenseId.type,
                                    label: user.purchased[orderIndex].products[productIndex].licenseId.label,
                                    title: user.purchased[orderIndex].products[productIndex].beatId.title,
                                    bpm: user.purchased[orderIndex].products[productIndex].beatId.bpm,
                                    scale: user.purchased[orderIndex].products[productIndex].beatId.scale,
                                    imgUrl: user.purchased[orderIndex].products[productIndex].beatId.imgUrl,
                                    previewAudioUrl: user.purchased[orderIndex].products[productIndex].beatId.previewAudioUrl,
                                    links: links,
                                    price: user.purchased[orderIndex].products[productIndex].licenseId.price,
                                    date: user.purchased[orderIndex].date
                                });
                            });
                    }
                }));
            }));
        }));
    } catch (e) {
        return next(
            new HttpError('Something went wrong while populating purchased items..', 500)
        );
    }

    return normalizedPurchasesList;

}

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

    const normalizedPurchasesList = await populateUserPurchases(userToSend, next);

    res.status(201);
    res.json({
        message: messageToSend,
        user: {
            id: userToSend.id,
            email: userToSend.email,
            username: userToSend.username,
            cart: {
                items: existingUser.cart.items,
                total: Math.round((userToSend.cart.total + Number.EPSILON) * 100) / 100
            },
            purchased: normalizedPurchasesList,
            token: token
        }
    });
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

    if (!existingUser) {
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
    try {
        token = jwt.sign(
            {userId: existingUser._id.toString(), email: existingUser.email},
            'supersecret_do_not_share',
            {expiresIn: '1h'}
        );
    } catch (e) {
        return next(
            new HttpError('Could not log in, please try again.', 500)
        );
    }

    const normalizedPurchases = await populateUserPurchases(existingUser, next);
    await populateUserCart(existingUser, next);

    res.status(200);
    res.json({
        message: 'successfully logged in',
        user: {
            id: existingUser.id,
            email: existingUser.email,
            username: existingUser.username,
            cart: {
                items: existingUser.cart.items,
                total: Math.round((existingUser.cart.total + Number.EPSILON) * 100) / 100
            },
            purchased: normalizedPurchases,
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
        await populateUserCart(user, next);

    await populateUserCart(user, next);

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
    }
    else {
        let existingLicense;
        try {
            existingLicense = await License.findById(user.cart.items[existingProductIndex].licenseId);
        }
        catch (e) {
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

    await populateUserCart(user, next);

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

    await populateUserCart(user, next);

    res.status(200);
    res.json({
        message: 'Successfully deleted item from cart',
        cart: {
            items: user.cart.items,
            total: Math.round((user.cart.total + Number.EPSILON) * 100) / 100
        }
    });
}

module.exports = {
    getUserById,
    getAllUsers,
    signup,
    login,
    updateUser,
    appendInUserCart,
    removeFromUserCart
};
