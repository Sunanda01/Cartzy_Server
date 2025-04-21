const express = require("express");
const PORT = require("./Config/config").PORT;
const connection = require("./Utils/connection");
const cors = require("cors");
// const FRONTEND_URL = require("./Config/config").FRONTEND_URL;
const authRoutes = require("./Routes/auth/authRoutes");
const productRoutes=require("./Routes/admin/productRoutes");
const shopProductRoutes=require("./Routes/shop/productRoutes");
const cartRoutes=require("./Routes/shop/cartRoutes");
const addressRoutes=require("./Routes/shop/addressRoutes");
const orderRoutes=require("./Routes/shop/orderRoutes");
const adminOrderRoutes=require("./Routes/admin/orderRoutes");
const searchProductsRoutes=require("./Routes/shop/searchRoutes");
const shopReviewRoutes=require("./Routes/shop/reviewRoutes")
const featureRoutes=require('./Routes/common/featureRoutes');
const redisConnection=require('./Utils/redisConnection');
const errorHandler=require('./Middleware/errorHandler');
const healthcheckroute = require("./Routes/health");

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);
app.use(express.urlencoded({ extended: true }));

//HealthCheck
app.use("/api",healthcheckroute);

//Auth Routes
app.use("/api/auth", authRoutes);

//Admin Routes
app.use("/api/admin/products",productRoutes);
app.use("/api/admin/orders",adminOrderRoutes);

app.use("/api/common/feature",featureRoutes)

//Shop Routes
app.use("/api/shop/products",shopProductRoutes);
app.use("/api/shop/cart",cartRoutes);
app.use("/api/shop/address",addressRoutes);
app.use("/api/shop/orders",orderRoutes);
app.use("/api/shop/search",searchProductsRoutes);
app.use("/api/shop/review",shopReviewRoutes);

//errorHandler
app.use(errorHandler);

app.listen(PORT, async() => {
  await connection();
  await redisConnection;
  console.log(`PORT Connected @ ${PORT}`);
});