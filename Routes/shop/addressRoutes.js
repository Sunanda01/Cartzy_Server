const routes = require("express").Router();
const {
  addAddress,
  fetchAllAddress,
  editAddress,
  deleteAddress,
} = require("../../Controller/shop/addressController");
const {verifyToken}= require('../../Middleware/verification');

routes.post("/add", addAddress);
routes.get("/get/:userId", fetchAllAddress);
routes.delete("/delete/:userId/:addressId", deleteAddress);
routes.put("/update/:userId/:addressId", editAddress);

module.exports = routes;
 