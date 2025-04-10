const routes = require("express").Router();
const {
  addProductReview,
  getProductReviews,
} = require("../../Controller/shop/reviewController");
const {verifyToken}= require('../../Middleware/verification');
routes.post("/add", verifyToken,addProductReview);
routes.get("/:productId", verifyToken,getProductReviews);
module.exports = routes;