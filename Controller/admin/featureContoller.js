const Feature = require("../../Models/Feature");

const addFeatureImage = async (req, res) => {
  try {
    const { image } = req.body;

    // console.log(image, "image");

    const featureImages = new Feature({
      image,
    });

    await featureImages.save();

    res.status(201).json({
      success: true,
      data: featureImages,
      msg:"Feature Image Added"
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      msg: "Some error occured!",
    });
  }
};

const getFeatureImages = async (req, res) => {
  try {
    const images = await Feature.find({});

    res.status(200).json({
      success: true,
      data: images,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      msg: "Some error occured!",
    });
  }
};

module.exports = { addFeatureImage, getFeatureImages };