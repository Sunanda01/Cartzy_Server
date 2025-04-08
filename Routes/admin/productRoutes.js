const {
  handleImageUpload,
  addProduct,
  editProduct,
  fetchAllProduct,
  deleteProduct,
} = require("../../Controller/admin/productController");
const {upload}=require('../../Services/cloudinary');
const router = require("express").Router();
router.post("/upload-image", upload.single("my_file"), handleImageUpload);
router.post("/add", addProduct);
router.put("/edit/:id", editProduct);
router.get("/get", fetchAllProduct);
router.delete("/delete/:id", deleteProduct);
module.exports = router;
