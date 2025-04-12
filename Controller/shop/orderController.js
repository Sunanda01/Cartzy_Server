const paypal = require("@paypal/checkout-server-sdk");
const Order = require("../../Models/Order");
const Product = require("../../Models/Product");
const Cart = require("../../Models/Cart");
const client = require("../../Services/paypal");
const FRONTEND_URL = require("../../Config/config").FRONTEND_URL;
const redis_client = require("../../Utils/redisConnection");
const createOrder = async (req, res) => {
  try {
    const {
      userId,
      cartItems,
      addressInfo,
      orderStatus,
      paymentMethod,
      paymentStatus,
      totalAmount,
      orderDate,
      orderUpdateDate,
      cartId,
    } = req.body;

    const items = cartItems.map((item) => ({
      name: item.title,
      unit_amount: {
        currency_code: "USD",
        value: item.price.toFixed(2),
      },
      quantity: item.quantity.toString(),
      description: item.title,
      sku: item.productId,
    }));

    const request = new paypal.orders.OrdersCreateRequest();
    request.prefer("return=representation");
    request.requestBody({
      intent: "CAPTURE",
      purchase_units: [
        {
          amount: {
            currency_code: "USD",
            value: totalAmount.toFixed(2),
            breakdown: {
              item_total: {
                currency_code: "USD",
                value: totalAmount.toFixed(2),
              },
            },
          },
          items,
        },
      ],
      application_context: {
        return_url: `${FRONTEND_URL}/shop/paypal-return`,
        cancel_url: `${FRONTEND_URL}/shop/paypal-cancel`,
        brand_name: "My Shop",
        landing_page: "BILLING",
        user_action: "PAY_NOW",
      },
    });

    const order = await client.execute(request);
    const approvalLink = order.result.links.find(
      (link) => link.rel === "approve"
    )?.href;

    const newOrder = new Order({
      userId,
      cartId,
      cartItems,
      addressInfo,
      orderStatus,
      paymentMethod,
      paymentStatus,
      totalAmount,
      orderDate,
      orderUpdateDate,
      paymentId: order.result.id,
    });

    await newOrder.save();

    res.status(201).json({
      success: true,
      approvalURL: approvalLink,
      orderId: newOrder._id,
      paymentId: newOrder.paymentId,
    });
  } catch (err) {
    or(err);
    res.status(500).json({
      success: false,
      msg: "Error creating PayPal order",
    });
  }
};

const capturePayment = async (req, res) => {
  try {
    const { paymentId, payerId, orderId } = req.body;

    let order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ success: false, msg: "Order not found" });
    }

    const request = new paypal.orders.OrdersCaptureRequest(paymentId);
    request.requestBody({});

    const captureResponse = await client.execute(request);

    order.paymentStatus = "paid";
    order.orderStatus = "confirmed";
    order.paymentId = paymentId;
    order.payerId = payerId;

    // Reduce stock
    for (let item of order.cartItems) {
      let product = await Product.findById(item.productId);
      if (!product) {
        return res.status(404).json({
          success: false,
          msg: `Product not found: ${item.title}`,
        });
      }
      product.totalStock -= item.quantity;
      await product.save();
    }

    const cart=await Cart.findByIdAndDelete(order.cartId);
    await order.save();
    const redis_exists=await redis_client.exists('all_orderList');
    if(redis_exists){
      await redis_client.del('all_orderList');
      await redis_client.del(`${cart.userId}_orderList`);
    }
    res.status(200).json({
      success: true,
      msg: "Order confirmed",
      data: order,
      captureResult: captureResponse.result,
    });
  } catch (err) {
    or(err);
    res.status(500).json({ success: false, msg: "Payment capture failed" });
  }
};

const getAllOrdersByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const redis_data = await redis_client.get(`${userId}_orderList`);
    if (redis_data) {
      const parsed_data = JSON.parse(redis_data);
      return res.status(200).json({
        success: true,
        data: parsed_data.data,
      });
    }

    const orders = await Order.find({ userId });

    if (!orders.length) {
      return res.status(404).json({
        success: false,
        msg: "No orders found!",
      });
    }
    await redis_client.set(
      `${userId}_orderList`,
      JSON.stringify({
        data: orders,
      }),
      "EX",
      1800
    );

    res.status(200).json({
      success: true,
      data: orders,
    });
  } catch (e) {
    
    res.status(500).json({
      success: false,
      msg: "Some error occured!",
    });
  }
};

const getOrderDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const redis_data = await redis_client.get(`${id}_order_details`);
    if (redis_data) {
      const parsed_data = JSON.parse(redis_data);
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
    
    res.status(500).json({
      success: false,
      msg: "Some error occured!",
    });
  }
};

module.exports = {
  createOrder,
  capturePayment,
  getAllOrdersByUser,
  getOrderDetails,
};
