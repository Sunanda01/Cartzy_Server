const Order = require("../../Models/Order");
const redis_client = require("../../Utils/redisConnection");
const customErrorHandler = require("../../Services/customErrorHandler");
const getAllOrder = async (req, res, next) => {
  try {
    const order = await Order.find();
    if (!order) return next(customErrorHandler.notFound("No Orders Found"));
    const redis_data = await redis_client.get(`all_orderList`);
    if (redis_data) {
      const parsed_data = JSON.parse(redis_data);
      return res
        .status(200)
        .json({ success: true, msg: "Orders Found", data: parsed_data.data });
    }
    await redis_client.set(
      `all_orderList`,
      JSON.stringify({
        data: order,
      }),
      "EX",
      1800
    );
    res.status(200).json({ success: true, msg: "Orders Found", data: order });
  } catch (error) {
    next(error);
  }
};

const getOrderDetails = async (req, res, next) => {
  try {
    const { id } = req.params;
    const redis_data = await redis_client.get(`${id}_order_details`);
    if (redis_data) {
      const parsed_data = JSON.parse(redis_data);
      return res.status(200).json({ success: true, data: parsed_data.data });
    }
    const order = await Order.findById(id);

    if (!order) return next(customErrorHandler.notFound("No Orders Found"));
    await redis_client.set(
      `${id}_order_details`,
      JSON.stringify({
        data: order,
      }),
      "EX",
      1800
    );
    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

const updateOrderStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { orderStatus } = req.body;
    const order = await Order.findById(id);
    if (!order) return next(customErrorHandler.notFound("No Orders Found"));
    await Order.findByIdAndUpdate(id, { orderStatus });

    await redis_client.set(
      `${id}_order_details`,
      JSON.stringify({ data: order }),
      "EX",
      1800
    );
    await redis_client.del(`${id}_order_details`);
    await redis_client.del(`${order.userId}_orderList`);
    await redis_client.del("all_orderList");
    res.status(200).json({
      success: true,
      msg: "Order status is updated successfully!",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getAllOrder, getOrderDetails, updateOrderStatus };
