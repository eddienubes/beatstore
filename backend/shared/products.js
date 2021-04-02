const baseSelect = 'previewAudioUrl imgUrl title scale bpm';
const {v4: uuid} = require('uuid');
const HttpError = require('../models/http-error');
const User = require('../models/user');

const beatProjectionsToLicenseTypes = [
    {
        labels: ['MP3 audio'],
        type: 1,
        select: 'mp3Url ' + baseSelect,
        projection: {
            'wavUrl': false,
            'stemsUrl': false
        }
    },
    {
        labels: ['MP3 audio', 'WAV audio'],
        type: 2,
        select: 'mp3Url wavUrl ' + baseSelect,
        projection: {
            'stemsUrl': false
        }
    },
    {
        labels: ['MP3 audio', 'WAV audio', 'STEMS'],
        type: 3,
        select: 'mp3Url wavUrl stemsUrl ' + baseSelect,
        projection: {}
    },
    {
        labels: ['MP3 audio', 'WAV audio', 'STEMS'],
        type: 4,
        select: 'mp3Url wavUrl stemsUrl ' + baseSelect,
        projection: {}
    }
];

const deleteBeatObj = {
    id: uuid(),
    beatId: 'Deleted',
    licenseId: 'Deleted',
    orderId: 'Deleted',
    licenseType: 'Deleted',
    label: 'Beat was deleted, please contact me! Sorry for inconvenience :(',
    title: 'Beat was deleted, please contact me! Sorry for inconvenience :(',
    bpm: 'Deleted',
    scale: 'Deleted',
    imgUrl: 'Deleted',
    previewAudioUrl: 'Deleted',
    links: ['Deleted', 'Deleted', 'Deleted'],
    price: 'Deleted',
    date: 'Deleted'
}

const populateUserCart = async (user, next) => {
    await user.populate([
        {
            path: 'cart.items.beatId',
            select: 'title imgUrl'
        },
        {path: "cart.items.licenseId"}]).execPopulate();

    user.cart.total = user.cart.items.reduce((t, i) => t += i.licenseId.price, 0);

    try {
        await user.save();
    }
    catch (e) {
        return next(new HttpError('Error while saving user to db!', 500));
    }
}

const populateUserPurchases = async (user, next) => {


    let normalizedPurchasesList = [];

    // fucking javascript below
    if (!user?.populated('purchased.products.licenseId')) {
        await user?.populate({
            path: 'purchased',
            select: 'products date total',
            populate: {
                path: 'products',
                populate: [
                    {path: 'licenseId'}
                ]
            }
        }).execPopulate();
    }

    await Promise.all(user.purchased.map(async (order, orderIndex) => {
        await Promise.all(order.products.map(async (product, productIndex) => {
            await Promise.all(beatProjectionsToLicenseTypes.map(async proj => {
                // console.log(product.licenseId.type, proj.type);
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
                                if (!data.purchased[orderIndex].products[productIndex].beatId) {
                                    links.push({
                                        label: 'Beat was deleted, please contact me! Sorry for inconvenience :(',
                                        url: 'Deleted..'
                                    });
                                }
                                else {
                                    links.push({
                                        label: proj.labels[index],
                                        url: data.purchased[orderIndex].products[productIndex].beatId[l]
                                    });
                                }
                            });
                            if (!user.purchased[orderIndex].products[productIndex].beatId) {
                                normalizedPurchasesList.push(deleteBeatObj);
                            }
                            else {
                                normalizedPurchasesList.push({
                                    id: uuid(),
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
                            }

                        });
                }
            }));
        }));
    }));
    return normalizedPurchasesList;
}

const populateOrder = async (order) => {
    let normalizedProducts = [];

    if (!order?.populated('products.licenseId')) {
        await order?.populate({
            path: 'products.licenseId'
        }).execPopulate();
    }

    await Promise.all(order.products.map(async (product, productIndex) => {
        await Promise.all(beatProjectionsToLicenseTypes.map(async proj => {
            // console.log(product.licenseId.type, proj.type);
            if (product.licenseId.type === proj.type) {
                await order.populate({
                    path: `products.${productIndex}.beatId`,
                    select: proj.select
                })
                    .execPopulate()
                    .then(data => {
                        let links = [];

                        const licenseUrlKeys = proj.select
                            .replace(new RegExp('\\s' + baseSelect), '')
                            .split(/\s+/);

                        licenseUrlKeys.map((l, index) => {
                            if (!order.products[productIndex].beatId) {
                                links.push({
                                    label: 'Beat was deleted, please contact me! Sorry for inconvenience :(',
                                    url: 'Deleted..'
                                });
                            }
                            else {
                                links.push({
                                    label: proj.labels[index],
                                    url: order.products[productIndex].beatId[l]
                                });
                            }
                        });
                        if (!order.products[productIndex].beatId) {
                            normalizedProducts.push(deleteBeatObj);
                        }
                        else {
                            normalizedProducts.push({
                                id: uuid(),
                                beatId: order.products[productIndex].beatId._id.toString(),
                                licenseId: order.products[productIndex].licenseId._id.toString(),
                                orderId: order._id.toString(),
                                licenseType: order.products[productIndex].licenseId.type,
                                label: order.products[productIndex].licenseId.label,
                                title: order.products[productIndex].beatId.title,
                                bpm: order.products[productIndex].beatId.bpm,
                                scale: order.products[productIndex].beatId.scale,
                                imgUrl: order.products[productIndex].beatId.imgUrl,
                                previewAudioUrl: order.products[productIndex].beatId.previewAudioUrl,
                                links: links,
                                price: order.products[productIndex].licenseId.price,
                                date: order.date
                            });
                        }
                    });
            }
        }));
    }));

    return normalizedProducts;
}

module.exports = {
    populateUserCart,
    populateUserPurchases,
    projectionForPopulation: beatProjectionsToLicenseTypes,
    baseSelect,
    populateOrder
}