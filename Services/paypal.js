const paypal = require("@paypal/checkout-server-sdk");
const CLIENT_ID = require("../Config/config").CLIENT_ID;
const CLIENT_SECRET = require("../Config/config").CLIENT_SECRET;
const NODE_ENV = require("../Config/config").NODE_ENV;

const environment =
  NODE_ENV === "production"
    ? new paypal.core.LiveEnvironment(CLIENT_ID, CLIENT_SECRET)
    : new paypal.core.SandboxEnvironment(CLIENT_ID, CLIENT_SECRET);

const paypalClient = new paypal.core.PayPalHttpClient(environment);

module.exports = paypalClient;
