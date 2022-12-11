const paypal = require('@paypal/checkout-server-sdk');

const paypalClient = (environment) => new paypal.core.PayPalHttpClient(environment);

const paypalEnvironment = () => new paypal.core.SandboxEnvironment(process.env.paypalClientId, process.env.paypalClientSecret);

module.exports = {
  paypalClient,
  paypalEnvironment
};
