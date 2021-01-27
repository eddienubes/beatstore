const mongoose = require('mongoose');
const Price = require('../models/price')
const HttpError = require('../models/http-error');

const updatePrice = async (req, res, next) => {
    const {amount, type, label} = req.body;

    let price;

    try {
        price = await Price.findOne({type});
    } catch (e) {
        return next(
            new HttpError(
                'Something went wrong while trying to find a price..',
                500
            )
        );
    }
    
    if (!price) {
        return next(
            new HttpError(
                'Price with such type does not exist',
                500
            )
        );
    }

    price.type = type;
    price.amount = amount;
    price.label = label;

    try {
        await price.save();
    }
    catch (e) {
        return next(
            new HttpError(
                'Something went wrong while trying to save a price..',
                500
            )
        );
    }

    res.status(200);
    res.json({message: 'Successfully changed the price', price: price.toObject({getters: true})});
};

const getAllPrices = async (req, res, next) => {
    let prices;

    try {
        prices = await Price.find({});
    }
    catch (e) {
        return next(
            new HttpError(
                'Something went wrong while getting prices',
                500
            )
        );
    }

    res.status(200);
    res.json({message: 'Prices are fetched successfully', prices});
};

const createPrice = async (req, res, next) => {
    const {type, amount, label} = req.body;

    const price = new Price({
        type,
        amount,
        label
    });

    try {
        await price.save();
    }
    catch (e) {
        return next(
            new HttpError(
                'Something went wrong while saving price..',
                500
            )
        );
    }

    res.status(200);
    res.json({message: 'Price added successfully!', price});
};

module.exports = {
    updatePrice,
    getAllPrices,
    createPrice
};
