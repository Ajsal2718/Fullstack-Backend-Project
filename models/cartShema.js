const mongoose = require("mongoose");
const product = require("../models/productSchema");
const users = require("../models/UserSchema");

const cartSchema = new mongoose.Schema({
  cart: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: users, // Reference to the User model
      required: true,
    },
  ],
  products: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: product, // Reference to the Product model
    },
  ],
  // Add other properties as needed
  //   totalPrice
});

module.exports = mongoose.model("Cart", cartSchema);
