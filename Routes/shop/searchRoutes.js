const { searchProducts } = require('../../Controller/shop/searchController');
const routes=require('express').Router();
routes.get('/:keyword',searchProducts)
module.exports=routes;