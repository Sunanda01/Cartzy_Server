const { addToCart, fetchCart, updateCart, deleteCart } = require('../../Controller/shop/cartController');
const routes=require('express').Router();
routes.post("/add",addToCart);
routes.get("/get/:userId",fetchCart);
routes.put("/update-cart",updateCart);
routes.delete("/:userId/:productId",deleteCart);
module.exports=routes; 