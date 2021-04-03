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
    populateOrder
} = require('../shared/products');
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
        orderId: uuid(),
        payed: true
    });

    try {
        const sess = await mongoose.startSession();
        sess.startTransaction();

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
    }
    catch (e) {
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

    // try {
    //     const response = await axios.post('https://secure.wayforpay.com/pay?behavior=offline', purchaseObj);
    //     console.log(response.data);
    // }
    // catch (e) {
    //     console.log(e.message);
    //     return next(new HttpError('An error occurred while trying to create wayfoypay order!', 500));
    // }

    // try {
    //     await order.save();
    // }
    // catch (e) {
    //     console.log(e.message);
    //     return next(new HttpError('An error occurred while trying to save order!', 500));
    // }

    res.status(200);
    res.json({message: 'Successfully created order!', order: purchaseObj});
}

const captureOrderWithWayforpay = async (req, res, next) => {
    const body = req.body;
    console.log(body);

    res.status(200);
    res.json({});
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

const orderApproved = async (req, res, next) => {
    console.log(req.body);
    res.status(200);
}

const orderFailed = async (req, res, next) => {
    console.log(req.body);
    res.status(200);
}

module.exports = {
    createOrderWithPaypal,
    captureOrderWithPaypal,
    createOrderWithWayforpay,
    captureOrderWithWayforpay,
    getAllOrders,
    getOrdersByUserId,
    getOrderById,
    orderApproved,
    orderFailed
};