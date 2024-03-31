const express = require('express');
const router = express.Router();
const adminController = require('../controller/adminForms');
const upload = require('../utils/multer')


///////////// Admin Registarion ////////////
router.route('/admin/login').post(adminController.adminLogin);
router.route('/admin/users').get(adminController.allUsers);
router.route('/admin/user/:id').get(adminController.useridFind);
router.route('/admin/product').get(adminController.displayProduct);
router.route('/admin/product/:id').get(adminController.ProductById);
router.route('/admin/product/category/:id').get(adminController.productsCategory);
router.route('/admin/addproduct').post(upload.single( 'image' ),adminController.addproducts);
router.route("/admin/updateproduct").put(upload.single("image"), adminController.updateProducts)
router.route('admin/deleteproduct/:id').delete(adminController.productDelete)

module.exports = router;