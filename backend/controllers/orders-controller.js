const mongoose = require('mongoose');
const Order = require('../models/order');
const User = require('../models/user');
const License = require('../models/license');
const HttpError = require('../models/http-error');

const createOrder = async (req, res, next) => {
    const {email, products} = req.body;

    let user;

    try {
        user = await User.findOne({email});
    } catch (e) {
        return next(
            new HttpError('Searching for a user went wrong..'),
            500
        );
    }

    const hasUser = !!user;

    let licenses;

    try {
        const promises = products.map(async p => {
            return License.findById(p.licenseId);
        });
        licenses = await Promise.all(promises);
    }
    catch (e) {
        return next(
            new HttpError('Searching for a license went wrong..'),
            500
        );
    }
    const total = licenses.reduce((sum, {price}) => sum += price, 0);

    const order = new Order({
        email,
        products,
        date: new Date(),
        total
    });

    try {
        const sess = await mongoose.startSession();
        sess.startTransaction();

        if (hasUser) {
            user.purchased.push(order);
            user.cart = [];
            await user.save();
            order.customerId = user._id;
        }
        if (!hasUser) {
            const newUser = new User({
                email,
                cart: [],
            });
            newUser.purchased.push(order);
            order.customerId = newUser._id;
            await newUser.save();
        }
        await order.save({session: sess});
        await sess.commitTransaction();

    } catch (e) {
        return next(
            new HttpError('Creation order process has failed..'),
            500
        );
    }
    res.status(201);
    res.json({message: 'New order has been successfully created..', order: order});
};

const getAllOrders = async (req, res, next) => {
    let orders;

    try {
        orders = await Order.find({});
    } catch (e) {
        return next(
            new HttpError('Getting all orders went wrong..'),
            500
        );
    }

    res.status(200);

    res.json(
        {
            message: 'Successfully got all orders..',
            orders: orders.map(o => o.toObject({getters: true}))
        }
    );
};

const getOrdersByUserId = async (req, res, next) => {
    const userId = req.params.id;

    let orders;

    try {
        orders = await Order.find({customerId: userId})
    } catch (e) {
        return next(
            new HttpError('Getting orders by email went wrong..'),
            500
        );
    }

    if (orders.length === 0) {
        res.status(500);
        res.json({
            message: 'Couldn\'t find orders by specified email',
            orders: []
        });
    }

    res.status(200);
    res.json({
        message: 'Successfully found all orders of this user',
        orders: orders.map(o => o.toObject({getters: true}))
    });
}

module.exports = {
    createOrder,
    getAllOrders,
    getOrdersByUserId
};