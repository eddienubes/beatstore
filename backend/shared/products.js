const baseSelect = 'previewAudioUrl imgUrl title scale bpm';

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

const populateUserCart = async (user, next) => {
    await user.populate([
        {
            path: 'cart.items.beatId',
            select: 'title imgUrl'
        },
        {path: "cart.items.licenseId"}]).execPopulate();
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
                console.log(product.licenseId.type, proj.type);
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
    return normalizedPurchasesList;
}

const populateOrder = (order) => {

}

module.exports =  {
    populateUserCart,
    populateUserPurchases,
    projectionForPopulation: beatProjectionsToLicenseTypes,
    baseSelect
}