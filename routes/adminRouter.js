const express = require('express');
const router = express.Router();
const adminController = require('../controller/adminForms');


///////////// Admin Registarion ////////////
router.route('/admin/login').post(adminController.adminLogin);
router.route('/admin/users').get(adminController.allUsers);
router.route('/admin/user/:id').get(adminController.useridFind);
router.route('/admin/product').get(adminController.displayProduct);
router.route('/admin/product/:id').get(adminController.ProductById);
router.route('/admin/product/category/:id').get(adminController.productsCategory);
router.route('admin/deleteproduct/:id').delete(adminController.productDelete)

module.exports = router;