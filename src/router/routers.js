import express from "express";
import UserController from "../controller/user_controller.js"
import SizeController from "../controller/size_controller.js"
import CategoryController from "../controller/category_controller.js"
import ProductController from "../controller/product_controller.js"
import ProductSizeController from "../controller/product_size_controller.js"
import CartItemController from "../controller/cart_item_controller.js"
import VoucherController from "../controller/voucher_controller.js"
import VoucherUserController from "../controller/voucher_user_controller.js"
import BillItemController from "../controller/bill_item_controller.js"
import PaymentController from "../controller/payment_controller.js"
import ProductFavouriteController from "../controller/product_favourite_controller.js"
import ReviewProductController from "../controller/review_product_controller.js"
import { checkToken, userPermit, adminPermit } from "../middleware/auth/token_validation.js"




let router = express.Router()

let initApiRoutes = (app) => {

    //user, admin
    router.post('/create-user', UserController.createNewUser)
    router.post('/login', UserController.login)
    router.get('/all-size', SizeController.getAllSize)


    //admin
    router.get('/all-user', UserController.getAllUser)
    router.post('/create-size', SizeController.createNewSize)
    router.get('/get-user-detail', UserController.getDetailUser)
    router.post('/update-user', UserController.updateUserInformation)
    router.get('/all-category', CategoryController.getAllCategory)
    router.post('/create-category', CategoryController.createNewCategory)
    router.delete('/delete-size', SizeController.deleteSize)
    router.put('/update-size', SizeController.updateSize)
    router.post('/create-product', ProductController.createNewProduct)
    router.get('/all-product', ProductController.getAllProduct)
    router.get('/search-product', ProductController.searchProduct)
    router.get('/all-product-category', ProductController.getAllProductByCategory)


    router.post('/create-product-size', ProductSizeController.createNewProductSize)
    router.get('/all-product-size', ProductSizeController.getAllProductSize)
    // router.delete('/delete-product-size', ProductSizeController.deleteProductSize)
    router.post('/import-product-size', ProductSizeController.importAmount)
    router.get('/detail-product-size', ProductSizeController.getSizeOfProduct)
    router.post('/verify', UserController.verify)
    router.post('/forget-password', UserController.forgetPassword)
    router.put('/reset-password', UserController.resetPassword)

    router.post('/add-to-cart', CartItemController.createNewCartItem)
    router.get('/all-cart-item', CartItemController.getAllCartItem)

    router.get('/all-voucher', VoucherController.getAllVoucher)
    router.get('/all-voucher-user', VoucherController.getAllVoucherUser)
    router.post('/create-voucher', VoucherController.createNewVoucher)
    router.post('/create-voucher-user', VoucherUserController.createNewVoucherUser)
    router.delete('/delete-voucher', VoucherController.deleteVoucher)
    router.delete('/delete-voucher-user', VoucherUserController.deleteVoucherUser)

    router.delete('/delete-cart-item', CartItemController.deleteCartItem)
    router.put('/decrease-quantity-item', CartItemController.decreaseQuantity)
    router.put('/increase-quantity-item', CartItemController.increaseQuantity)

    router.post('/create-product-favourite', ProductFavouriteController.createNewFavourite)
    router.get('/all-product-favourite', ProductFavouriteController.getAllProductFavourite)
    router.delete('/delete-product-favourite', ProductFavouriteController.deleteProductFavourite)
    router.get('/top-product-favourite', ProductFavouriteController.getTopProductFavourite)


    router.get('/all-review-product', ReviewProductController.getAllComment)
    router.post('/create-comment', ReviewProductController.createNewComment)



    router.post('/payment', PaymentController.payment)
    router.get('/success', PaymentController.paymentSuccess)

    router.post('/create-bill-item', BillItemController.createNewBillItem)
    router.get('/all-bill-pending', BillItemController.getAllBillPeding)
    router.get('/all-bill', BillItemController.getAllBill)
    router.get('/all-bill-item-user', BillItemController.getAllBilItemUser)
    router.get('/bill-count', BillItemController.getBillCount)
    router.get('/all-bill-item', BillItemController.getAllBillItem)
    router.get('/all-bill-item-pending', BillItemController.getAllBillItemPending)
    router.put('/verify-order', BillItemController.verifyOrder)
    router.put('/verify-all-order', BillItemController.verifyAllOrder)
    router.get('/top-selling-product', BillItemController.getTopSellingProducts)



    return app.use('/api/v1', router)
}

module.exports = initApiRoutes