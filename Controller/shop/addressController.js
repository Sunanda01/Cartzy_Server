const Address = require("../../Models/Address");
const { addressValidationSchema } = require("../../Validators");

const addAddress = async (req, res, next) => {
  try {
    const { error } = addressValidationSchema.validate(req.body);
      if (error) {
        return next(error);
      }
    // await addressValidationSchema.validateAsync(req.body);
    const { userId, address, city, pincode, phone, notes } = req.body;
    if (!userId || !address || !city || !pincode || !phone || !notes) {
      return res.status(400).json({
        success: false,
        msg: "Invalid Data Provided!",
      });
    }

    const newlyCreatedAddress = new Address({
      userId,
      address,
      city,
      pincode,
      notes,
      phone,
    });

    await newlyCreatedAddress.save();

    res.status(201).json({
      success: true,
      data: newlyCreatedAddress,
      msg: "New Address Added",
    });
  } catch (error) {
    next(error);
  }
};

const fetchAllAddress = async (req, res, next) => {
  try {
    const { userId } = req.params;
    if (!userId) {
      return res.status(400).json({
        success: false,
        msg: "User Id is required!",
      });
    }

    const addressList = await Address.find({ userId });
    res.status(200).json({
      success: true,
      data: addressList,
      msg: "Saved Address",
    });
  } catch (error) {
    next(error);
  }
};

const editAddress = async (req, res, next) => {
  try {
    const { error } = addressValidationSchema.validate(req.body);
      if (error) {
        return next(error);
      }
    const { userId, addressId } = req.params;
    const formData = req.body;

    if (!userId || !addressId) {
      return res.status(400).json({
        success: false,
        msg: "User and address id is required!",
      });
    }

    const address = await Address.findOneAndUpdate(
      {
        _id: addressId,
        userId,
      },
      formData,
      { new: true }
    );

    if (!address) {
      return res.status(404).json({
        success: false,
        msg: "Address not found",
      });
    }

    res.status(200).json({
      success: true,
      data: address,
      msg: "Address updated successfully",
    });
  } catch (error) {
    next(error);
  }
};

const deleteAddress = async (req, res, next) => {
  try {
    const { userId, addressId } = req.params;
    if (!userId || !addressId) {
      return res.status(400).json({
        success: false,
        msg: "User and address id is required!",
      });
    }

    const address = await Address.findOneAndDelete({ _id: addressId, userId });

    if (!address) {
      return res.status(404).json({
        success: false,
        msg: "Address not found",
      });
    }

    res.status(200).json({
      success: true,
      msg: "Address deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { addAddress, editAddress, fetchAllAddress, deleteAddress };
