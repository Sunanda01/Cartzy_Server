const routes = require("express").Router();
const {
  addFeatureImage,
  getFeatureImages,
} = require("../../Controller/admin/featureContoller");
const { verifyToken, verifyAdmin } = require("../../Middleware/verification");
routes.post("/add", verifyToken, verifyAdmin, addFeatureImage);
routes.get("/get", verifyToken, getFeatureImages);
module.exports = routes;
