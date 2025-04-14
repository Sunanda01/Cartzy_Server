const { imageUploadUtil } = require("../../Services/cloudinary");
const Product = require("../../Models/Product");
const {
  productValidationSchema,
  updateProductValidationSchema,
} = require("../../Validators");
const customErrorHandler = require("../../Services/customErrorHandler");

const handleImageUpload = async (req, res, next) => {
  try {
    const b64 = Buffer.from(req.file.buffer).toString("base64");
    const url = "data:" + req.file.mimetype + ";base64," + b64;
    const result = await imageUploadUtil(url);
    res.json({ success: true, result });
  } catch (error) {
    next(error);
  }
};

const addProduct = async (req, res, next) => {
  try {
    const { error } = productValidationSchema.validate(req.body);
      if (error) {
        return next(error);
      }
    // await productValidationSchema.validateAsync(req.body);
    const {
      image,
      title,
      description,
      category,
      brand,
      price,
      salePrice,
      totalStock,
    } = req.body;
    const newlyCreatedProduct = new Product({
      image,
      title,
      description,
      category,
      brand,
      price,
      salePrice,
      totalStock,
    });
    await newlyCreatedProduct.save();
    res
      .status(201)
      .json({ success: true, msg: "Product Added", data: newlyCreatedProduct });
  } catch (error) {
    next(error);
  }
};

const fetchAllProduct = async (req, res, next) => {
  try {
    const listOfProduct = await Product.find({});
    res.status(200).json({ success: true, data: listOfProduct });
  } catch (error) {
    next(error);
  }
};

const editProduct = async (req, res, next) => {
  try {
    const { error } = updateProductValidationSchema.validate(req.body);
      if (error) {
        return next(error);
      }
    // await updateProductValidationSchema.validateAsync(req.body);
    const { id } = req.params;
    const {
      title,
      description,
      category,
      brand,
      price,
      salePrice,
      totalStock,
    } = req.body;
    let findProduct = await Product.findById(id);
    if (!findProduct)
      return next(customErrorHandler.notFound("Product Not Found"));
    findProduct.title = title || findProduct.title;
    findProduct.description = description || findProduct.description;
    findProduct.category = category || findProduct.category;
    findProduct.brand = brand || findProduct.brand;
    findProduct.price = price ?? findProduct.price;
    findProduct.salePrice = salePrice ?? findProduct.salePrice;
    findProduct.totalStock = totalStock ?? findProduct.totalStock;

    await findProduct.save();
    res
      .status(200)
      .json({ success: true, msg: "Product Updated Successfully" });
  } catch (error) {
    next(error);
  }
};

const deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndDelete(id);
    if (!product) return next(customErrorHandler.notFound("Product Not Found"));
    res
      .status(200)
      .json({ success: true, msg: "Product Deleted Successfully" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  handleImageUpload,
  addProduct,
  editProduct,
  deleteProduct,
  fetchAllProduct,
};
