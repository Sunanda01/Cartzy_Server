const Product = require("../../Models/Product");
const getFilteredProduct = async (req, res, next) => {
  try {
    const { category = [], brand = [], sortBy = "price-lowtohigh" } = req.query;
    let filters = {};
    if (category.length) {
      filters.category = { $in: category.split(",") };
    }

    if (brand.length) {
      filters.brand = { $in: brand.split(",") };
    }

    let sort = {};
    switch (sortBy) {
      case "price-lowtohigh":
        sort.price = 1;
        break;

      case "price-hightolow":
        sort.price = -1;
        break;

      case "title-atoz":
        sort.title = 1;
        break;

      case "title-ztoa":
        sort.title = -1;
        break;

      default:
        sort.price = 1;
        break;
    }

    const products = await Product.find(filters).sort(sort);
    return res
      .status(200)
      .json({ success: true, msg: "Products Fetched", data: products });
  } catch (error) {
    return next(error);
  }
};

const getProductDetails = async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await Product.findById({ _id: id });

    if (!product) return next(customErrorHandler.notFound("No Products Found"));
    return res.status(200).json({ success: true, data: product });
  } catch (error) {
    return next(error);
  }
};

module.exports = { getFilteredProduct, getProductDetails };
