const routes = require("express").Router();
const {
  createOrder,
  getAllOrdersByUser,
  getOrderDetails,
  capturePayment,
} = require("../../Controller/shop/orderController");
const {verifyToken}= require('../../Middleware/verification');

routes.post("/create", verifyToken, createOrder);
routes.post("/capture", verifyToken, capturePayment);
routes.get("/list/:userId", verifyToken, getAllOrdersByUser);
routes.get("/details/:id", verifyToken, getOrderDetails);

module.exports = routes;
