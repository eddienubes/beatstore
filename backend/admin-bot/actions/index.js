const {
    controlButtons,
    getBeatById,
    editBeatMenu,
    backFromEditingToBeat,
    editBeat,
    deleteCurrentBeat,
    listenToCurrentBeat,
    createNewBeat
} = require('./beats-actions');

const {
    getLicenseById,
    editLicenseMenu,
    backFromEditingLicenseToLicense,
    editLicense,
} = require('./licenses-actions');

const {
    getOrderById,
    controlOrdersButtons,
    getOrderCustomer,
    getOrderProducts,
    backToOrder,
    backFromOrderToOrderMenu,
    controlOrderProductsButtons,
    getProductById,
    backToProducts
} = require('./orders-actions');

const {
    controlUserButtons,
    getUserById,
    getAllPurchases,
    backToAllUsersMenu,
    controlButtonsPurchases,
    backToUserDetails,
    backToAllUsersPurchases,
    getPurchaseById,

} = require('./users-actions');

module.exports = {
    controlButtons,
    getBeatById,
    editBeatMenu,
    editBeat,
    backFromEditingToBeat,
    deleteCurrentBeat,
    listenToCurrentBeat,
    createNewBeat,
    editLicenseMenu,
    getLicenseById,
    backFromEditingLicenseToLicense,
    editLicense,
    controlOrdersButtons,
    getOrderById,
    getOrderCustomer,
    getOrderProducts,
    backToOrder,
    backFromOrderToOrderMenu,
    controlOrderProductsButtons,
    getProductById,
    backToProducts,
    controlUserButtons,
    getUserById,
    getAllPurchases,
    backToAllUsersMenu,
    controlButtonsPurchases,
    backToUserDetails,
    backToAllUsersPurchases,
    getPurchaseById
}