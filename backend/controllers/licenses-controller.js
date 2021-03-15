const mongoose = require('mongoose');
const License = require('../models/license')
const HttpError = require('../models/http-error');
const path = require('path');

const updateLicense = async (req, res, next) => {
    const {type, price, label} = req.body;

    let license;
    
    try {
        license = await License.findOne({type});
    } catch (e) {
        return next(
            new HttpError(
                'Something went wrong while trying to find a price..',
                500
            )
        );
    }
    
    if (!license) {
        return next(
            new HttpError(
                'Price with such type does not exist',
                500
            )
        );
    }

    license.type = type;
    license.price = price;
    license.label = label;

    try {
        await license.save();
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
    res.json({message: 'Successfully changed the price', license: license.toObject({getters: true})});
};

const getAllLicenses = async (req, res, next) => {
    let licenses;

    try {
        licenses = await License.find({});
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
    res.json({message: 'Prices are fetched successfully', licenses: licenses.map(l => l.toObject({getters: true}))});
};

const creatLicense = async (req, res, next) => {
    const {type, price, label} = req.body;

    const license = new License({
        type,
        price,
        label
    });

    try {
        await license.save();
    }
    catch (e) {

        return next(
            new HttpError(
                'Something went wrong while saving license..',
                500
            )
        );
    }

    res.status(200);
    res.json({message: 'Price added successfully!', license});
};

const getLicenseDescriptionByType = async (req, res, next) => {
    const type = req.params.type;
    res.status(200).sendFile(path.join(__dirname, '..', 'public', 'licenses-description', `${type}.html`));
}

module.exports = {
    updateLicense,
    getAllLicenses,
    creatLicense,
    getLicenseDescriptionByType
};
