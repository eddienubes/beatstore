const paypal = require('@paypal/checkout-server-sdk');

const paypalClient = (environment) => new paypal.core.PayPalHttpClient(environment);

const paypalEnvironment = () => new paypal.core.SandboxEnvironment(process.env.PAYPAL_CLIENT_ID, process.env.PAYPAL_CLIENT_SECRET);

module.exports = {
  paypalClient,
  paypalEnvironment
};
