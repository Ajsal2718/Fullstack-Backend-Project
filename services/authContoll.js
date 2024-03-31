// const express = require('express')
const productModel = require("../models/productSchema");
const userModel  = require("../models/UserSchema");
const cartModel = require("../models/cartShema");
const { tryCatch } = require("../middleware/trycatchHandler");

const addToCartProduct = async (productId, userId, res) => {
    const productFind = await productModel.findById(productId);
    const userFind = await userModel.findById(userId)
    console.log(userFind);
  //   const userFind = await usersmodel

  const existingUser = await cartModel.findOne({ userId: userId });
  const existingProduct = await cartModel.findOne({
    userId: userId,
    products: productId,
  });
  console.log(existingUser);

  if (existingProduct) {
    res.status(200).json({
      status: "Success",
      message: "This Product is already in your Cart",
    });
  }
  if (!userFind || !productFind) {
    // next('Invalid User or Product ID')
  } else {
    if (existingUser && !existingProduct) {
      existingUser.products.push(productId);
      existingUser.totalPrice += productId.price;
      await existingUser.save();
      res.status(200).json({
        status: "success",
        message: "Added to Your Cart Successfully!",
        cart: existingUser,
        totalProduct: existingUser.products.length,
      });
    } else {
      ////// new User ////////
      const addingCart = await cartModel.create({
        userId: userId,
        products: [productId],
        totalPrice: productFind.price,
      });
      res.status(200).json({
        status: "Created a New Cart for this User",
        message: "The Item has been added to the new Cart",
        cart: addingCart,
        totalProduct: addingCart.products.length,
      });
    }
  }
};

module.exports = {
  addToCartProduct,
};
