const userModel = require("../models/UserSchema");
const productModel = require("../models/productSchema");
const { accessToken } = require("../middleware/jwt");
const { tryCatch } = require("../middleware/trycatchHandler");

/////////////////// Admin Login ////////////////
const adminLogin = tryCatch(async (req, res) => {
  const admin = {
    username: process.env.Admin_username,
    password: process.env.Admin_password,
  };
  const { username, password } = req.body;
  const validator = password === admin.password && username === admin.username;
  // console.log(validator);

  if (validator) {
    // console.log('login Success');
    res
      .status(200)
      .cookie("AdminAuth", accessToken)
      .json({ success: true, message: "Successfully Logged In!" });
  } else {
    res.status(400).send("validation failed:Invalid Username or Password");
  }
});

/////////////////// View all users ///////////////////
const allUsers = tryCatch(async (req, res) => {
  const userData = await userModel.find();
  if (userData?.length === 0) {
    res.status(400).send("Database error");
  } else {
    res.status(202).json(userData);
  }
});

/////////////// User By id //////////////
const useridFind = tryCatch(async (req, res) => {
  const id = req.params.id;

  const checkUser = await userModel.findOne({ _id: id });

  if (!checkUser) {
    res.status(404).json({
      succes: false,
      message: "User not fond",
    });
  } else {
    res.status(202).json(checkUser);
  }
});

///////////////// Show Products ////////////
const displayProduct = tryCatch(async (req, res) => {
  const checkProduct = await productModel.find();

  if (!checkProduct) {
    res.status(404).json({
      succes: false,
      message: "Product not found",
    });
  } else {
    res.status(202).json(checkProduct);
  }
});

//////////////////// Product by id ////////////////

const ProductById = tryCatch(async (req, res) => {
  const id = req.params.id;

  const productId = await productModel.findOne({ _id: id });

  if (!productId) {
    res.status(404).json({
      succes: false,
      message: "Product not found",
    });
  } else {
    res.status(202).json(productId);
  }
});

////////////// Show Products category /////////////
const productsCategory = tryCatch(async (req, res) => {
  const cate = req.params.id;
  const categoryFind = await productModel.aggregate([
    { $match: { category: cate } },
  ]);

  if (!categoryFind || categoryFind.length === 0) {
    res.status(404).json({
      success: false,
      message: "category not found",
    });
  } else {
    res.status(202).json(categoryFind);
  }
});

///////////////// Product Delete /////////////

const productDelete = tryCatch(async (req, res) => {
  const productId = req.params.id;

  const deleteProduct = await productModel.findByIdAndDelete(productId);

  if (!deleteProduct) {
    res.status(404).json({
      success: false,
      message: "Product not found",
    });
  } else {
    res.status(202).json({
      success: true,
      message: "Product delete successfully",
      data: deleteProduct,
    });
  }
});
module.exports = {
  adminLogin,
  allUsers,
  useridFind,
  displayProduct,
  ProductById,
  productsCategory,
  productDelete
};
