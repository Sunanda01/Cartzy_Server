const Order = require("../../Models/Order");
const redis_client = require("../../Utils/redisConnection");
const getAllOrder = async (req, res) => {
  try {
    const order = await Order.find();
    
    if (!order)
      return res.status(404).json({ success: false, msg: "No Orders Found" });
    const redis_data = await redis_client.get(`all_orderList`);
    if (redis_data) {
      const parsed_data = JSON.parse(redis_data);
      console.log("Admin Order From Redis!!!!!!!!");
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
  } catch (err) {
    res.status(500).json({ success: false, msg: "Failed to fetch order" });
  }
};

const getOrderDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const redis_data = await redis_client.get(`${id}_order_details`);
    if (redis_data) {
      const parsed_data = JSON.parse(redis_data);
      console.log(`${id} Admin Order Details From Redis!!!!!!!!`);
      return res.status(200).json({ success: true, data: parsed_data.data });
    }
    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        msg: "Order not found!",
      });
    }
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
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      msg: "Some error occured!",
    });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { orderStatus } = req.body;
    const order = await Order.findById(id);
    console.log(order);
    if (!order) {
      return res.status(404).json({
        success: false,
        msg: "Order not found!",
      });
    }
    await Order.findByIdAndUpdate(id, { orderStatus });
    
    await redis_client.set(
      `${id}_order_details`,
      JSON.stringify({ data: order }),
      "EX",
      1800
    );
    await redis_client.del(`${id}_order_details`);
    await redis_client.del(`${order.userId}_orderList`);
    await redis_client.del('all_orderList');
    res.status(200).json({
      success: true,
      msg: "Order status is updated successfully!",
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occured!",
    });
  }
};

module.exports = { getAllOrder, getOrderDetails, updateOrderStatus };
