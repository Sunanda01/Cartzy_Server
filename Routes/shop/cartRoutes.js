const { addToCart, fetchCart, updateCart, deleteCart } = require('../../Controller/shop/cartController');
const routes=require('express').Router();
const {verifyToken}= require('../../Middleware/verification');
routes.post("/add",verifyToken,addToCart);
routes.get("/get/:userId",verifyToken,fetchCart);
routes.put("/update-cart",verifyToken,updateCart);
routes.delete("/:userId/:productId",verifyToken,deleteCart);
module.exports=routes; 