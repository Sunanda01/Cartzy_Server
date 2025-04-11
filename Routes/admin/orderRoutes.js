const { getAllOrder, getOrderDetails, updateOrderStatus } = require('../../Controller/admin/orderController');
const {verifyToken}=require('../../Middleware/verification');

const routes=require('express').Router();
routes.get('/get-order',getAllOrder);
routes.get('/get-order-details/:id',getOrderDetails);
routes.put('/update/:id',updateOrderStatus);
module.exports=routes;