const {
  getFilteredProduct,
  getProductDetails,
} = require("../../Controller/shop/productsController");
const { verifyToken } = require("../../Middleware/verification");
const routes = require("express").Router();
routes.get("/get", verifyToken, getFilteredProduct);
routes.get("/get/:id", verifyToken, getProductDetails);
module.exports = routes;
