const express = require("express");
const router = express.Router();
const controller = require('../controller/userRegistration');
const userController = require('../controller/userForms')

//////////////  USER REGISTRATION /////////////////////
router.route('/signup').post(controller.userSignUp);
router.route('/otpverify').post(controller.registerUser);
router.route("/login").post(controller.UserLogin);
router.route('/logout').get(controller.logoutUser);

////////////////  API's for UserProfile  //////////////
router.route('/product').get(userController.GetProducts);
router.route('/productId/:id').get(userController.getProductById);
router.route('/product/category/:id').get(userController.getProductByCategory);
router.route('/:id/cart').post(userController.addToCart);
router.route('/:id/cart').get(userController.viewFromCart);
router.route('/:id/wishlist').post(userController.addToWishlist);
router.route('/:id/wishlist').get(userController.viewFromWishlist)
router.route('/:id/wishlist').delete(userController.removeFromWishlist);
router.route('/:id/orderplacing').get(userController.placeOrder);
// router.route('/getuser/:id').get(controller.getUserID);

module.exports = router;