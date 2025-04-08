const routes = require("express").Router();

const {
  createOrder,
  getAllOrdersByUser,
  getOrderDetails,
  capturePayment,
} = require("../../Controller/shop/orderController");



routes.post("/create", createOrder);
routes.post("/capture", capturePayment);
routes.get("/list/:userId", getAllOrdersByUser);
routes.get("/details/:id", getOrderDetails);

module.exports = routes;
