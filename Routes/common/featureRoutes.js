const routes = require("express").Router();

const {
  addFeatureImage,
  getFeatureImages,
} = require("../../Controller/admin/featureContoller");
routes.post("/add", addFeatureImage);
routes.get("/get", getFeatureImages);
module.exports = routes;