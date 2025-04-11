const { searchProducts } = require('../../Controller/shop/searchController');
const routes=require('express').Router();
const {verifyToken}= require('../../Middleware/verification');
routes.get('/:keyword',searchProducts)
module.exports=routes;