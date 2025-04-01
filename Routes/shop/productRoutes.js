const {
  getFilteredProduct,
} = require("../../Controller/shop/productsController");

const routes = require("express").Router();
routes.get("/get", getFilteredProduct);
module.exports = routes;
