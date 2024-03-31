const userModel = require("../models/UserSchema");
const productModel = require("../models/productSchema");
const { accessToken } = require("../middleware/jwt");
const { tryCatch } = require("../middleware/trycatchHandler");
const cloudinary = require("../utils/cloudinery");
const jwt = require("jsonwebtoken");

/////////////////// Admin Login ////////////////
const adminLogin = tryCatch(async (req, res) => {
  const admin = {
    username: process.env.Admin_username,
    password: process.env.Admin_password,
  };
  const { username, password } = req.body;
  const validator = password === admin.password && username === admin.username;
  if (!validator)
    return res.status(401).send("validati failed:Invalid Username or Password");

  const accessToken = jwt.sign({ username: username }, process.env.JWT_KEY);
  console.log(accessToken);
  res.cookie("adminAuth", accessToken);
  const token = req.cookies.adminAuth;

  if (!token) {
    return res.status(400).json({
      success: false,
      message: "Failed to set cookie",
    });
  }

  res.status(200).json({
    success: true,
    message: "Logged in Successfully!",
    accessToken,
  });
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

///////////////// Add product in mongodb /////////////////
const addproducts = tryCatch(async (req, res) => {
  const { title, description, price, category, qty } = req.body;
  const existingproduct = await productModel.findOne({ title: title });

  if (!existingproduct) {
    const adding = await cloudinary.uploader.upload(req.file.path);
    const added = await productModel.create({
      title,
      description,
      price,
      category,
      Image: adding.url,
    });
    res.status(200).json({
      success: true,
      message: "Product has been created",
      data: added,
    });
  } else {
    res.status(404).json({
      success: false,
      message: "This product already exists",
    });
  }
});

////////////////// Update Products ////////////
const updateProducts = tryCatch(async (req, res) => {
  const productId = req.params.id;
  const isExist = await productModel.findById(productId);
  const { title, description, price, qty } = req.body;

  if (isExist) {
    const adding = await cloudinary.uploader.upload(req.file.path);
    const product = await productModel.findById(productId);

    product.title = title || product.title;
    product.description = description || product.description;
    product.price = price || product.price;
    product.category = category || product.category;
    product.qty = qty || product.qty;
    product.Image = adding.url || product.Image;

    await product.save();

    res.status(200).json({
      status: "success",
      message: "The product has been updated successfully!",
      data: product,
    });
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
  productDelete,
  addproducts,
  updateProducts,
};
