"use strict";

var _express = _interopRequireDefault(require("express"));
var _user_controller = _interopRequireDefault(require("../controller/user_controller.js"));
var _size_controller = _interopRequireDefault(require("../controller/size_controller.js"));
var _category_controller = _interopRequireDefault(require("../controller/category_controller.js"));
var _product_controller = _interopRequireDefault(require("../controller/product_controller.js"));
var _product_size_controller = _interopRequireDefault(require("../controller/product_size_controller.js"));
var _cart_item_controller = _interopRequireDefault(require("../controller/cart_item_controller.js"));
var _token_validation = require("../middleware/auth/token_validation.js");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
var router = _express["default"].Router();
var initApiRoutes = function initApiRoutes(app) {
  //user, admin
  router.post('/create-user', _user_controller["default"].createNewUser);
  router.post('/login', _user_controller["default"].login);
  router.get('/all-size', _token_validation.checkToken, _token_validation.userPermit, _size_controller["default"].getAllSize);

  //admin
  router.get('/all-user', _user_controller["default"].getAllUser);
  router.post('/create-size', _size_controller["default"].createNewSize);
  router.get('/get-detail-user', _token_validation.checkToken, _token_validation.adminPermit, _user_controller["default"].getDetailUser);
  router.get('/all-category', _category_controller["default"].getAllCategory);
  router.post('/create-category', _category_controller["default"].createNewCategory);
  router.patch('/delete-size', _size_controller["default"].deleteSize);
  router.put('/update-size', _size_controller["default"].updateSize);
  router.post('/create-product', _product_controller["default"].createNewProduct);
  router.get('/all-product', _product_controller["default"].getAllProduct);
  router.post('/create-product-size', _product_size_controller["default"].createNewProductSize);
  router.get('/all-product-size', _product_size_controller["default"].getAllProductSize);
  router.get('/detail-product-size', _product_size_controller["default"].getSizeOfProduct);
  router.post('/verify', _user_controller["default"].verify);
  router.post('/forget-password', _user_controller["default"].forgetPassword);
  router.put('/reset-password', _user_controller["default"].resetPassword);
  router.post('/add-to-cart', _cart_item_controller["default"].createNewCartItem);
  router.get('/all-cart-item', _cart_item_controller["default"].getAllCartItem);
  return app.use('/api/v1', router);
};
module.exports = initApiRoutes;