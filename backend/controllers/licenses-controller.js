const path = require('path');
const License = require('../models/license');
const Order = require('../models/order');
const HttpError = require('../models/http-error');

const updateLicense = async (req, res, next) => {
  const { type, price, label } = req.body;
  const licenseId = req.params.lid;

  let license;

  try {
    license = await License.findById(licenseId);
  } catch (e) {
    return next(new HttpError('Something went wrong while trying to find a price..', 500));
  }

  if (!license) {
    return next(new HttpError('Price with such id does not exist', 500));
  }

  license.type = type || license.type;
  license.price = parseFloat(price) || license.price;
  license.label = label || license.label;

  try {
    await license.save();
  } catch (e) {
    return next(new HttpError('Something went wrong while trying to save a price..', 500));
  }

  res.status(200);
  res.json({ message: 'Successfully changed the price', license: license.toObject({ getters: true }) });
};

const getAllLicenses = async (req, res, next) => {
  let licenses;

  try {
    licenses = await License.find({});
  } catch (e) {
    return next(new HttpError('Something went wrong while getting prices', 500));
  }

  res.status(200);
  res.json({ message: 'Prices are fetched successfully', licenses: licenses.map((l) => l.toObject({ getters: true })) });
};

const creatLicense = async (req, res, next) => {
  const { type, price, label } = req.body;

  const license = new License({
    type,
    price,
    label
  });

  try {
    await license.save();
  } catch (e) {
    return next(new HttpError('Something went wrong while saving license..', 500));
  }

  res.status(200);
  res.json({ message: 'Price added successfully!', license });
};

const getLicenseDescriptionByType = async (req, res, next) => {
  const { type } = req.params;
  res.status(200).sendFile(path.join(__dirname, '..', 'public', 'licenses-description', `${type}.html`));
};

const getLicenseById = async (req, res, next) => {
  const licenseId = req.params.lid;
  let license;
  try {
    license = await License.findById(licenseId);
  } catch (e) {
    console.log(e.message);
    return next(new HttpError('Error while trying to find license with specified id!', 500));
  }
  if (!license) {
    return next(new HttpError('License with such id has not been found!', 403));
  }
  let orders;
  try {
    orders = await Order.find({ products: { $elemMatch: { licenseId } } });
  } catch (e) {
    console.log(e.message);
    return next(new HttpError('An error occurred while trying to find orders..', 500));
  }

  res.status(200);
  res.json({
    message: 'Successfully retrieved license!',
    license: {
      ...license.toObject({ getters: true }),
      orders: orders.length
    }
  });
};

module.exports = {
  updateLicense,
  getAllLicenses,
  creatLicense,
  getLicenseDescriptionByType,
  getLicenseById
};
