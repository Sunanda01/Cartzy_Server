const {
  handleImageUpload,
  addProduct,
  editProduct,
  fetchAllProduct,
  deleteProduct,
} = require("../../Controller/admin/productController");
const {verifyToken,verifyAdmin}=require('../../Middleware/verification');
const {upload}=require('../../Services/cloudinary');
const router = require("express").Router();
router.post("/upload-image",verifyToken,verifyAdmin, upload.single("my_file"), handleImageUpload);
router.post("/add",verifyToken,verifyAdmin, addProduct);
router.put("/edit/:id",verifyToken,verifyAdmin, editProduct);
router.get("/get",verifyToken,verifyAdmin, fetchAllProduct);
router.delete("/delete/:id",verifyToken,verifyAdmin, deleteProduct);
module.exports = router;
