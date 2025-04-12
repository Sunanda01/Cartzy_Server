const { getAllOrder, getOrderDetails, updateOrderStatus } = require('../../Controller/admin/orderController');
const {verifyToken,verifyAdmin}=require('../../Middleware/verification');

const routes=require('express').Router();
routes.get('/get-order',getAllOrder);
routes.get('/get-order-details/:id',verifyToken,verifyAdmin,getOrderDetails);
routes.put('/update/:id',verifyToken,verifyAdmin,updateOrderStatus);
module.exports=routes;