const Feature = require("../../Models/Feature");

const addFeatureImage = async (req, res, next) => {
  try {
    const { image } = req.body;
    const featureImages = new Feature({
      image,
    });
    await featureImages.save();
    return res.status(201).json({
      success: true,
      data: featureImages,
      msg: "Feature Image Added",
    });
  } catch (error) {
    return next(err);
  }
};

const getFeatureImages = async (req, res, next) => {
  try {
    const images = await Feature.find({});

    return res.status(200).json({
      success: true,
      data: images,
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = { addFeatureImage, getFeatureImages };
