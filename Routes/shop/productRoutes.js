const {
  getFilteredProduct,
  getProductDetails,
} = require("../../Controller/shop/productsController");
const { verifyToken } = require("../../Middleware/verification");
const routes = require("express").Router();
routes.get("/get", getFilteredProduct);
routes.get("/get/:id", getProductDetails);
module.exports = routes;
