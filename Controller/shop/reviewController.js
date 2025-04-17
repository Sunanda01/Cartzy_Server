const Order = require("../../Models/Order");
const Product = require("../../Models/Product");
const ProductReview = require("../../Models/Review");

const addProductReview = async (req, res, next) => {
  try {
    const { productId, userId, userName, reviewMessage, reviewValue } =
      req.body;

    const order = await Order.findOne({
      userId,
      "cartItems.productId": productId,
      // orderStatus: "confirmed" || "delivered",
    });

    if (!order) {
      return res.status(403).json({
        success: false,
        msg: "You need to purchase product to review it.",
      });
    }

    const checkExistinfReview = await ProductReview.findOne({
      productId,
      userId,
    });

    if (checkExistinfReview) {
      return res.status(400).json({
        success: false,
        msg: "You already reviewed this product!",
      });
    }

    const newReview = new ProductReview({
      productId,
      userId,
      userName,
      reviewMessage,
      reviewValue,
    });

    await newReview.save();

    const reviews = await ProductReview.find({ productId });
    const totalReviewsLength = reviews.length;
    const averageReview =
      reviews.reduce((sum, reviewItem) => sum + reviewItem.reviewValue, 0) /
      totalReviewsLength;

    await Product.findByIdAndUpdate(productId, { averageReview });

    return res.status(201).json({
      success: true,
      data: newReview,
    });
  } catch (error) {
    return next(error);
  }
};

const getProductReviews = async (req, res, next) => {
  try {
    const { productId } = req.params;

    const reviews = await ProductReview.find({ productId });
    return res.status(200).json({
      success: true,
      data: reviews,
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = { addProductReview, getProductReviews };
