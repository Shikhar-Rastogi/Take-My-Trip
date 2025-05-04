const User = require("../models/User.js");

const createUser = async (req, res) => {
  const newUser = new User(req.body);
  try {
    const savedUser = await newUser.save();
    res.status(200).json({
      success: true,
      message: "Successfully created",
      data: savedUser,
    });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "Failed to create. Try again" });
  }
};

// update User
const updateUser = async (req, res) => {
  const id = req.params.id;
  try {
    const updatedUser = await User.findByIdAndUpdate(
      id,
      {
        $set: req.body,
      },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Successfully updated",
      data: updatedUser,
    });
  } catch (err) {
    res.status(500).json({
      success: true,
      message: "failed to update",
    });
  }
};

// delete User
const deleteUser = async (req, res) => {
  const id = req.params.id;
  try {
    await User.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Successfully deleted",
    });
  } catch (err) {
    res.status(500).json({
      success: true,
      message: "failed to delete",
    });
  }
};

// getSingle User
const getSingleUser = async (req, res) => {
  const id = req.params.id;
  try {
    const user = await User.findById(id);

    res.status(200).json({
      success: true,
      message: "Successful",
      data: user,
    });
  } catch (err) {
    res.status(404).json({
      success: true,
      message: "not found",
    });
  }
};

// getAll User
const getAllUser = async (req, res) => {
  // for pagination
  const page = parseInt(req.query.page);
  try {
    const users = await User.find({})
      .skip(page * 8)
      .limit(8);
    res
      .status(200)
      .json({
        success: true,
        message: "Successful",
        data: users,
      });
  } catch (err) {
    res.status(404).json({
      success: true,
      message: "not found",
    });
  }
};

module.exports = {
    createUser,
    updateUser,
    deleteUser,
    getSingleUser,
    getAllUser,
  };
  