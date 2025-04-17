const Product =require('../../Models/Product');

const searchProducts = async (req,res,next) => {
  try {
    const { keyword } = req.params;
    if (!keyword || typeof keyword !== "string") {
      return res.status(400).json({
        succes: false,
        msg: "Keyword is required and must be in string format",
      });
    }
    const regEx = new RegExp(keyword, "i");
    const createSearchQuery = {
      $or: [
        { title: regEx },
        { description: regEx },
        { category: regEx },
        { brand: regEx },
      ],
    };
    const searchResults = await Product.find(createSearchQuery);
    res.status(200).json({
      success: true,
      data: searchResults,
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = { searchProducts };