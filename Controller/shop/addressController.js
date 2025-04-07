const Address = require("../../Models/Address");

const addAddress = async (req, res) => {
  try {
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
  } catch (e) {
    res.status(500).json({
      success: false,
      msg: "Failed to add address",
    });
  }
};

const fetchAllAddress = async (req, res) => {
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
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      msg: "Failed to fetch address",
    });
  }
};

const editAddress = async (req, res) => {
  try {
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
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      msg: "Failed to update Address",
    });
  }
};

const deleteAddress = async (req, res) => {
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
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      msg: "Failed to delete Address",
    });
  }
};

module.exports = { addAddress, editAddress, fetchAllAddress, deleteAddress };
