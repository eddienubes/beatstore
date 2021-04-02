const paypal = require('@paypal/checkout-server-sdk');

const paypalClient = (environment) => {
    return new paypal.core.PayPalHttpClient(environment);
}

const paypalEnvironment = () => {
    return new paypal.core.SandboxEnvironment(process.env.paypalClientId, process.env.paypalClientSecret);
}

module.exports = {
    paypalClient,
    paypalEnvironment
}
