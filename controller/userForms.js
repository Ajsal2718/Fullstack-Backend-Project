const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const userModel = require("../models/UserSchema");
const productModel = require("../models/productSchema");
const { signToken } = require("../middleware/jwt");
const { tryCatch } = require("../middleware/trycatchHandler");
const { use } = require("../routes/userRouter");

////////////// Show Products /////////////////

const GetProducts = tryCatch(async (req, res) => {
  const productData = await productModel.find();
  if (!productData) {
    res.status(401).json({
      success: false,
      message: "No products in here",
    });
  } else {
    res.status(200).json({
      message: "Success",
      productData,
    });
  }
});

/////////////////Get ProductId /////////////
const getProductById = async (req, res) => {
  const id = req.params.id;
  const product = await productModel.findById(id);
  return res.status(200).json(product);
};

///////////////// Product By Category ///////////
const getProductByCategory = tryCatch(async (req, res) => {
  const Category = req.params.id;

  const findCategory = await productModel.aggregate([
    { $match: { category: Category } },
  ]);

  if (!findCategory || findCategory.length === 0) {
    res.status(404).json({
      success: false,
      message: "Category not found",
    });
  } else {
    res.status(200).json(findCategory);
  }
});

////////////// add product to the user cart ///////////
const addToCart = tryCatch(async (req, res) => {
  const { id: userId } = req.params;
  const { id: productId } = req.body;

  const addProduct = await productModel.findById(productId);
  const checkUser = await userModel.findById(userId);

  if (!addProduct && !checkUser) {
    res.status(404).json({
      success: false,
      message: "user id or may product id get inccorrect",
    });
  } else {
    const isExist = checkUser.cart.find((item) => item.id == productId);
    if (isExist) {
      res.status(404).send("This product already exist in your cart");
    } else {
      checkUser.cart.push(addProduct);
      await checkUser.save();
      res.status(200).json(checkUser);
    }
  }
});

///////////////// View Prodcut From  User Cart ///////////
const viewFromCart = tryCatch(async (req, res) => {
  const id = req.params.id;
  const userData = await userModel.findById(id);

  if (!userData) {
    res.status(404).json({
      success: false,
      mesaage: "No data found by this Id",
    });
  } else {
    const cartData = userData.cart;
    res.status(200).json(cartData);
  }
});

//////////////////// add to wish list /////////////////
const addToWishlist = tryCatch(async (req, res) => {
  const { id: userId } = req.params;
  const { id: productId } = req.body;

  const userData = await userModel.findById(userId);
  const productData = await productModel.findById(productId);

  if (!userData || !productData) {
    res.status(404).json({
      success: false,
      message: "Invalid User or Product",
    });
  } else {
    const isExist = userData.wishlist.find((item) => item.id === productId);
    if (isExist) {
      req.status(404).send("item is already in wishlist");
    } else {
      userData.wishlist.push(productData);
      await userData.save();
      res.status(201).json({
        userData: userData,
        message: "Product has been added to your WishList",
      });
    }
  }
});

///////////////// view product from wishlist /////////////
const viewFromWishlist = tryCatch(async (req, res) => {
  const { id: userId } = req.params;
  const userData = await userModel.findById(userId);

  if (!userData) {
    req.status(404).json({
      success: false,
      message: "User Not Found",
    });
  } else {
    const wishlistData = userData.wishlist;
    res.status(200).json(wishlistData);
  }
});

/////////////////// Remove From Wishlist Item /////////////
const removeFromWishlist = tryCatch(async (req, res) => {
  const { id: userId } = req.params;

  const userData = await userModel.findById(userId);
  if (!userData) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }

  const { wishlist } = userData;
  const productRemove = wishlist.find((product) =>
    product._id.equals(req.body._id)
  );

  if (productRemove) {
    const updateWishlist = wishlist.filter(
      (product) => product !== productRemove
    );

    userData.wishlist = updateWishlist;
    const updateUser = await userData.save();

    res.status(200).json({
      message: "Product Successfully removed from wishlist",
      data: updateUser.wishlist,
    });
  } else {
    return res.status(404).json({
      success: false,
      message: "The Product is not in your wishlist",
    });
  }
});

///////////////////// order placingOrder ///////////
const placeOrder = tryCatch(async (req, res) => {
  const { id: userId } = req.params;
  const userCheck = await userModel.findById(userId);

  if (!userCheck) {
    return res.status(404).json({
      success: false,
      message: "Invalid User",
    });
  }
  const { cart } = userCheck;
  if(cart.length === 0){
    return res.status(404).json({
        success:false,
        message:'Your Cart Is Empty'
    })
  } else {
    const totalPrice =  cart.reduce((acc,product) => {
        return acc + product.price;
    },0).toFixed(2)
    return res.status(200).json({
        success:true,
        message: `the total amount you have to pay ${totalPrice}`,
        products:`${cart.length},Products`,
        data:cart
    })
  }
});
module.exports = {
  GetProducts,
  getProductById,
  getProductByCategory,
  addToCart,
  viewFromCart,
  addToWishlist,
  viewFromWishlist,
  removeFromWishlist,
  placeOrder
};
