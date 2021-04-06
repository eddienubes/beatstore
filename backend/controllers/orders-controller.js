const mongoose = require('mongoose');
const Order = require('../models/order');
const User = require('../models/user');
const Beat = require('../models/beat');
const License = require('../models/license');
const HttpError = require('../models/http-error');
const paypal = require('@paypal/checkout-server-sdk');
const {paypalClient, paypalEnvironment} = require('../shared/paypal');
const jwt = require('jsonwebtoken');
const mailer = require('../shared/nodemailer');
const {v4: uuid} = require('uuid');
const {
    populateUserCart,
    populateUserPurchases,
    projectionForPopulation,
    baseSelect,
    populateOrder,
    populateOrderProductsToSendEmail
} = require('../shared/products');
const axios = require('axios');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const {validationResult} = require('express-validator');

const createOrderWithPaypal = async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return next(new HttpError('Wrong arguments specified!', 403));
    }

    const {email, cartItems} = req.body;

    let licenses;
    let beats;
    try {
        const licensePromises = cartItems.map(async p => {
            return License.findById(p.licenseId._id);
        });
        const beatsPromises = cartItems.map(async p => {
            return Beat.findById(p.beatId._id);
        })
        licenses = await Promise.all(licensePromises);
        beats = await Promise.all(beatsPromises);
    } catch (e) {
        return next(
            new HttpError('Searching for a license or beat went wrong..'),
            500
        );
    }

    const total = licenses.reduce((sum, {price}) => sum += price, 0);

    const client = paypalClient(paypalEnvironment());

    const request = new paypal.orders.OrdersCreateRequest();

    request.requestBody({
        'intent': 'CAPTURE',
        'application_context': {
            'brand_name': 'Cherries By',
        },
        'purchase_units': [
            {
                'amount': {
                    'currency_code': 'USD',
                    'value': total.toFixed(2),
                    'breakdown': {
                        'item_total': {
                            'currency_code': 'USD',
                            'value': total.toFixed(2)
                        }
                    }
                },
                'description': 'Thanks for choosing my beats. In case you have any problems with purchasing, contact me via email. Cherries By',
                'items': licenses.map((l, i) => {
                    return {
                        'name': beats[i].title + ' ' + l.label,
                        'unit_amount': {
                            'currency_code': 'USD',
                            'value': l.price.toFixed(2)
                        },
                        'currency': 'USD',
                        'description': beats[i].title + ' ' + l.label,
                        'quantity': 1,
                        'category': 'DIGITAL_GOODS'
                    }
                }),
            }
        ],

    });

    let order;

    try {
        order = await client.execute(request);
    } catch (e) {
        return next(new HttpError('Purchasing has failed, please try again', 500));
    }


    let orderProducts = [];

    for (let i = 0; i < cartItems.length; ++i) {
        orderProducts.push({beatId: cartItems[i].beatId._id, licenseId: cartItems[i].licenseId._id});
    }

    const paypalDataToken = jwt.sign(
        {email: email, products: orderProducts, date: new Date(), total, orderId: order.result.id},
        process.env.paypalTokenSecret,
        {expiresIn: '1h'});

    res.status(200);
    res.json({message: 'Order has been successfully created', orderId: order.result.id, token: paypalDataToken});
};

const captureOrderWithPaypal = async (req, res, next) => {
    const orderId = req.body.orderId;
    const {token} = req.body;

    let tokenPayload;

    try {
        tokenPayload = jwt.verify(token, process.env.paypalTokenSecret);
    } catch (e) {
        console.log(e.message);
        return next(new HttpError('Capturing order has failed, please try again', 500));
    }

    if (tokenPayload.orderId !== orderId) {
        console.log('incorrect token');
        return next(new HttpError('Incorrect transaction token.', 403));
    }

    const {email, products, date, total} = tokenPayload;

    const request = new paypal.orders.OrdersCaptureRequest(orderId);
    request.requestBody({});

    let capture;
    try {
        capture = await paypalClient(paypalEnvironment()).execute(request);
    } catch (e) {
        console.log(e.message);
        return next(new HttpError('Capturing order has failed, please try again', 500));
    }

    if (capture.result.status !== 'COMPLETED') {
        console.log(' IS NOT COMPLETED ', capture.result.status);
        return next(new HttpError('Capturing order was not completed, please try again', 500));
    }

    let user;

    try {
        user = await User.findOne({email});
    } catch (e) {
        console.log(e.message);

        return next(
            new HttpError('Searching for a user went wrong..'),
            500
        );
    }

    const hasUser = !!user;

    const order = new Order({
        email,
        products,
        date,
        total,
        paypalOrderId: orderId,
        captureId: capture.result.id,
        payed: true
    });

    try {
        const sess = await mongoose.startSession();
        sess.startTransaction();
        console.log('hasUser', hasUser)
        console.log('order', order)
        console.log('user', user)
        if (hasUser) {
            user.purchased.push(order);
            user.cart = [];
            await user.save({session: sess});
            order.customerId = user._id;
        }

        await order.save({session: sess});
        await sess.commitTransaction();

    } catch (e) {
        console.log(e.message);
        return next(
            new HttpError('Creation order process has failed..'),
            500
        );
    }

    let populatedProducts;
    try {
        populatedProducts = await populateOrderProductsToSendEmail(products);
    } catch (e) {
        return next(new HttpError('Error while populating order products to send email!', 500));
    }

    try {
        await mailer.sendEmail(email, 'Cherries By Beatstore purchase', 'order-details', {
            email,
            orderId: order._id.toString(),
            total: total.toFixed(2),
            gross: total.toFixed(2),
            discount: 0.00.toFixed(2),
            date: order.date.toISOString().split('T')[0],
            username: capture.result.payer.name.given_name,
            identifier: order._id.toString(),
            products: populatedProducts
        });
    } catch (e) {
        console.log(e.message);
        return next(new HttpError('Sending order confirmation email has failed', 500));
    }

    res.status(201);
    res.json({message: 'Order has been successfully captured', order: {email, products, date, total}});
}

const createOrderWithWayforpay = async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return next(new HttpError('Wrong arguments specified!', 403));
    }

    const {email, cartItems} = req.body;

    let licenses;
    let beats;
    try {
        const licensePromises = cartItems.map(async p => {
            return License.findById(p.licenseId._id);
        });
        const beatsPromises = cartItems.map(async p => {
            return Beat.findById(p.beatId._id);
        });
        licenses = await Promise.all(licensePromises);
        beats = await Promise.all(beatsPromises);
    } catch (e) {
        return next(
            new HttpError('Searching for a license or beat went wrong..'),
            500
        );
    }

    const total = licenses.reduce((sum, {price}) => sum += price, 0);

    let orderProducts = [];

    for (let i = 0; i < cartItems.length; ++i) {
        orderProducts.push({beatId: cartItems[i].beatId._id, licenseId: cartItems[i].licenseId._id});
    }

    const order = new Order({
        email,
        products: orderProducts,
        date: new Date(),
        total,
        orderId: uuid(),
    });

    let productName;
    try {
        productName = licenses.map((l, i) => {
            return beats[i].title + ' ' + l.label;
        });
    } catch (e) {
        return next(new HttpError('An error occurred while trying to create order! Please, reload your page and try again', 500));
    }

    const productPrice = licenses.map((l, i) => l.price.toFixed(2));

    const purchaseObj = {
        "merchantAccount": process.env.wayforpayMerchantAccount,
        "merchantAuthType": "SimpleSignature",
        "merchantDomainName": process.env.wayforpayMerchantDomainName,
        "merchantTransactionSecureType": "AUTO",
        "language": "AUTO",
        "serviceUrl": process.env.currentIP + "api/orders/wayforpay-capture",
        "orderReference": order._id.toString(),
        "orderDate": order.date.getTime(),
        "amount": total,
        "currency": "USD",
        "productName": productName,
        "productPrice": productPrice,
        "productCount": Array(licenses.length).fill(1),
    }

    const baseSignature =
        purchaseObj.merchantAccount + ';' +
        purchaseObj.merchantDomainName + ';' +
        purchaseObj.orderReference + ';' +
        purchaseObj.orderDate + ';' +
        purchaseObj.amount + ';' +
        purchaseObj.currency + ';' +
        purchaseObj.productName.join(';') + ';' +
        purchaseObj.productCount.join(';') + ';' +
        purchaseObj.productPrice.join(';');

    const md5Hasher = crypto.createHmac('md5', process.env.wayforpayMerchantSecretKey);

    purchaseObj['merchantSignature'] = md5Hasher.update(baseSignature).digest('hex');

    try {
        await order.save();
    } catch (e) {
        console.log(e.message);
        return next(new HttpError('An error occurred while trying to save order!', 500));
    }

    res.status(200);
    res.json({message: 'Successfully created order!', order: purchaseObj});
}

const captureOrderWithWayforpay = async (req, res, next) => {
    // TODO: BUG: Add to purchased list

    const body = JSON.parse(Object.getOwnPropertyNames(req.body)[0]);
    console.log(body);
    if (!body || !Object.getOwnPropertyNames(req.body)[0]) {
        return next(new HttpError('Invalid data specified!', 403));
    }

    const {
        amount,
        transactionStatus,
        orderReference,
        authCode,
        cardPan,
        merchantSignature,
        reasonCode,
        clientName,
        currency
    } = body;

    let order;

    try {
        order = await Order.findById(orderReference);
    } catch (e) {
        console.log(e.message);
        return next(new HttpError('An error occurred while trying to find such order in db!', 500));
    }

    const responseTime = new Date().getTime();

    if (!order) {
        const declinedBaseSignature =
            orderReference + ';' +
            'decline' + ';' +
            responseTime;

        const declinedMd5Hasher = crypto.createHmac('md5', process.env.wayforpayMerchantSecretKey);

        const declinedMerchantSignature = declinedMd5Hasher.update(declinedBaseSignature).digest('hex');

        res.status(200);
        return res.json({
            orderReference,
            status: 'decline',
            time: responseTime,
            signature: declinedMerchantSignature
        });
    }
    const baseSignature =
        process.env.wayforpayMerchantAccount + ';' +
        orderReference + ';' +
        amount + ';' +
        currency + ';' +
        authCode + ';' +
        cardPan + ';' +
        transactionStatus + ';' +
        reasonCode;

    console.log(baseSignature);

    const existingMd5Hasher = crypto.createHmac('md5', process.env.wayforpayMerchantSecretKey);
    const existingMerchantSignature = existingMd5Hasher.update(baseSignature).digest('hex');

    if (existingMerchantSignature !== merchantSignature) {
        console.log('existingMerchantSignature !== merchantSignature');
        return next(new HttpError('Invalid data specified!', 403));
    }

    if (transactionStatus === 'Declined') {
        try {
            await order.remove();
        } catch (e) {
            return next(new HttpError('Deletion order process has failed..', 500))
        }

        const declinedBaseSignature =
            orderReference + ';' +
            'decline' + ';' +
            responseTime;

        const declinedMd5Hasher = crypto.createHmac('md5', process.env.wayforpayMerchantSecretKey);

        const declinedMerchantSignature = declinedMd5Hasher.update(declinedBaseSignature).digest('hex');

        res.status(200);
        return res.json({
            orderReference,
            status: 'decline',
            time: responseTime,
            signature: declinedMerchantSignature
        });
    } else if (transactionStatus === 'Approved') {
        order.payed = true;
    } else if (transactionStatus === 'Refunded') {
        try {
            await order.remove();
        } catch (e) {
            return next(new HttpError('Deletion order process has failed..', 500))
        }
        const refundedBaseSignature =
            orderReference + ';' +
            'refund' + ';' +
            responseTime;

        const refundMd5Hasher = crypto.createHmac('md5', process.env.wayforpayMerchantSecretKey);

        const refundMerchantSignature = refundMd5Hasher.update(refundedBaseSignature).digest('hex');

        res.status(200);
        return res.json({
            orderReference,
            status: 'refund',
            time: responseTime,
            signature: refundMerchantSignature
        });
    } else {
        try {
            await order.remove();
        } catch (e) {
            return next(new HttpError('Deletion order process has failed..', 500))
        }
        return next(new HttpError('Invalid transaction status!', 403));
    }

    let populatedProducts;
    try {
        populatedProducts = await populateOrderProductsToSendEmail(order.products);
    } catch (e) {
        console.log(e.message);
        return next(new HttpError('Error while populating order products to send email!', 500));
    }

    let user;
    try {
        user = await User.findOne({email: order.email});
    } catch (e) {
        console.log(e.message);

        return next(
            new HttpError('Searching for a user went wrong..'),
            500
        );
    }

    const hasUser = !!user;

    try {
        const sess = await mongoose.startSession();
        sess.startTransaction();
        console.log('hasUser', hasUser)
        console.log('order', order)
        console.log('user', user)
        if (hasUser) {
            user.purchased.push(order);
            user.cart = [];
            await user.save({session: sess});
            order.customerId = user._id;
        }

        await order.save({session: sess});
        await sess.commitTransaction();

    } catch (e) {
        console.log(e.message);
        return next(
            new HttpError('Creation order process has failed..'),
            500
        );
    }


    try {
        await mailer.sendEmail(order.email, 'Cherries By Beatstore purchase', 'order-details', {
            email: order.email,
            orderId: orderReference,
            total: order.total.toFixed(2),
            gross: order.total.toFixed(2),
            discount: 0.00.toFixed(2),
            date: order.date.toISOString().split('T')[0],
            username: clientName,
            identifier: orderReference,
            products: populatedProducts
        });
    } catch (e) {
        console.log(e.message);
        return next(new HttpError('Sending order confirmation email has failed', 500));
    }

    const approvedBaseSignature =
        orderReference + ';' +
        'approve' + ';' +
        responseTime;

    const approvedMd5Hasher = crypto.createHmac('md5', process.env.wayforpayMerchantSecretKey);

    const approveMerchantSignature = approvedMd5Hasher.update(approvedBaseSignature).digest('hex');

    res.status(200);
    res.json({
        orderReference,
        status: 'approve',
        time: responseTime,
        signature: approveMerchantSignature
    });
}


const getAllOrders = async (req, res, next) => {
    let {skip, limit} = req.query;

    let orders;

    try {
        skip = skip && /^\d+$/.test(skip) ? Number(skip) : 0;
        limit = limit && /^\d+$/.test(limit) ? Number(limit) : 10;

        orders = await Order
            .find({}, {}, {skip})
            .sort({date: -1})
            .limit(limit);
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

const getOrderById = async (req, res, next) => {
    const orderId = req.params.oid;

    let order;
    try {
        order = await Order.findById(orderId);
    } catch (e) {
        return next(new HttpError('An error occurred while trying to find order..', 500));
    }

    if (!order) {
        return next(new HttpError('Order with specified id does not exist!', 402));
    }

    let customer;
    try {
        customer = await User.findOne({email: order.email}, {
            password: false,
            confirmationCode: false,
            cart: false,
            purchased: false
        });
    } catch (e) {
        return next(new HttpError('An error occurred while trying to find customer..', 500));
    }

    let normalizedProducts;
    try {
        normalizedProducts = await populateOrder(order);
    } catch (e) {
        console.log(e.message, 'populating');
        return next(new HttpError('An error occurred while populating order..', 500));
    }

    res.status(200);
    res.json({
        message: 'Successfully found order!',
        order: {
            ...order.toObject({getters: true}),
            products: normalizedProducts,
            customer: customer
        }
    })
}

module.exports = {
    createOrderWithPaypal,
    captureOrderWithPaypal,
    createOrderWithWayforpay,
    captureOrderWithWayforpay,
    getAllOrders,
    getOrdersByUserId,
    getOrderById,
};