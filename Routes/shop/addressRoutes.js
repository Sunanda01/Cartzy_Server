const routes = require("express").Router();
const {
  addAddress,
  fetchAllAddress,
  editAddress,
  deleteAddress,
} = require("../../Controller/shop/addressController");
const {verifyToken}= require('../../Middleware/verification');

routes.post("/add", verifyToken,addAddress);
routes.get("/get/:userId", verifyToken,fetchAllAddress);
routes.delete("/delete/:userId/:addressId",verifyToken, deleteAddress);
routes.put("/update/:userId/:addressId",verifyToken, editAddress);

module.exports = routes;
 