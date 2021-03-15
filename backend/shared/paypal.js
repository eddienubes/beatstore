const config = require('../config.json');
const paypal = require('@paypal/checkout-server-sdk');

const paypalClient = (environment) => {
    return new paypal.core.PayPalHttpClient(environment);
}

const paypalEnvironment = () => {
    return new paypal.core.SandboxEnvironment(config.paypalClientId, config.paypalClientSecret);
}

module.exports = {
    paypalClient,
    paypalEnvironment
}
