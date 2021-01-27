const mongoose = require('mongoose');
const Order = require('../models/order');
const User = require('../models/user');
const HttpError = require('../models/http-error');

const createOrder = async (req, res, next) => {
    const {email, products, total} = req.body;
    console.log(email, products, total);
    const order = new Order({
        email,
        products,
        date: new Date(),
        total
    });

    let user;

    try {
        user = await User.findOne({email});
    }
    catch (e) {
        return next(
            new HttpError('Searching for a user went wrong..'),
            500
        );
    }

    const hasUser = !!user;

    try {
        const sess = await mongoose.startSession();
        sess.startTransaction();
        await order.save({session: sess});

        if (hasUser) {
            user.purchased.push(...order.products);
            user.cart = [];
            await user.save();
        }
        await sess.commitTransaction();
    }
    catch (e) {
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


module.exports = {
    createOrder,
    getAllOrders
};