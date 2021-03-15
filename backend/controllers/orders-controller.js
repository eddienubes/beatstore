const mongoose = require('mongoose');
const Order = require('../models/order');
const User = require('../models/user');
const Beat = require('../models/beat');
const License = require('../models/license');
const HttpError = require('../models/http-error');
const config = require('../config.json');
const paypal = require('@paypal/checkout-server-sdk');
const {paypalClient, paypalEnvironment} = require('../shared/paypal');
const jwt = require('jsonwebtoken');
const mailer = require('../shared/nodemailer');
const {v4: uuid} = require('uuid');
const {populateUserCart, populateUserPurchases, projectionForPopulation, baseSelect} = require('../shared/products');
const axios = require('axios');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const createOrderWithPaypal = async (req, res, next) => {
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
        // 'application_content': {
        //     'brand_name': 'Cherries By',
        //     'landing_page': 'NO_PREFERENCE'
        // },
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
        config.paypalTokenSecret,
        {expiresIn: '1h'});

    res.status(200);
    res.json({message: 'Order has been successfully created', orderId: order.result.id, token: paypalDataToken});
};

const captureOrderWithPaypal = async (req, res, next) => {
    const orderId = req.body.orderId;
    const {token} = req.body;


    let tokenPayload;

    try {
        tokenPayload = jwt.verify(token, config.paypalTokenSecret);
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
        orderId: uuid(),
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

        await order.save({session: sess});
        await sess.commitTransaction();

    } catch (e) {
        console.log(e.message);
        return next(
            new HttpError('Creation order process has failed..'),
            500
        );
    }

    const populatedProducts = [];
    await Promise.all(products.map(async (p, pIndex) => {
        const license = await License.findById(p.licenseId);
        await Promise.all(projectionForPopulation.map(async proj => {
            if (license.type === proj.type) {
                const beat = await Beat.findById(p.beatId, proj.projection);
                let links = [];

                const licenseUrlKeys = proj.select
                    .replace(new RegExp('\\s' + baseSelect), '')
                    .split(/\s+/);

                licenseUrlKeys.map((l, index) => {
                    links.push({
                        label: proj.labels[index],
                        url: beat[l]
                    });
                });

                populatedProducts.push(
                    {
                        title: beat.title,
                        price: license.price.toFixed(2),
                        licenseType: license.label,
                        links
                    }
                );
            }
        }));
    }));

    try {
        await mailer.sendEmail(email, 'Cherries By Beatstore purchase', 'order-details', {
            email,
            orderId,
            total: total.toFixed(2),
            gross: total.toFixed(2),
            discount: 0.00.toFixed(2),
            date: order.date.toISOString().split('T')[0],
            username: capture.result.payer.name.given_name,
            identifier: order.orderId,
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
    const {email, cartItems} = req.body;


    const md5Hasher = crypto.createHmac('md5', 'flk3409refn54t54t*FNJRET');
    const hash = md5Hasher
        .update('test_merch_n1;http://localhost:3000/;qwe123;1615559108837;1;USD;qwe;123qweqweasd;1;1;0.5;0.5')
        .digest('hex');

    const response = await axios.post('https://secure.wayforpay.com/pay?behavior=offline', {
            "merchantAccount": "test_merch_n1",
            "merchantAuthType": "SimpleSignature",
            "merchantDomainName": "http://localhost:3000/",
            "merchantTransactionSecureType": "AUTO",
            "merchantSignature": hash,
            "language": "AUTO",
            "serviceUrl": "http://localhost:5000/api/orders/wayforpay-capture",
            "orderReference": "qwe123",
            "orderDate": "1615559108837",
            "amount": 1,
            "currency": "USD",
            "productName": ["qwe", "123qweqweasd"],
            "productPrice": [0.5, 0.5],
            "productCount": [1, 1]
        }
    );

    console.log(response.data);

    res.status(200);
    res.json({});
}

const captureOrderWithWayforpay = async (req, res, next) => {
    const body = req.body;
    console.log(body);

    res.status(200);
    res.json({});
}


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
    createOrderWithPaypal,
    captureOrderWithPaypal,
    createOrderWithWayforpay,
    captureOrderWithWayforpay,
    getAllOrders,
    getOrdersByUserId
};