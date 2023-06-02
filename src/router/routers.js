import express from "express";
import UserController from "../controller/user_controller.js"
import SizeController from "../controller/size_controller.js"
import CategoryController from "../controller/category_controller.js"
import ProductController from "../controller/product_controller.js"
import ProductSizeController from "../controller/product_size_controller.js"
import CartItemController from "../controller/cart_item_controller.js"
import VoucherController from "../controller/voucher_controller.js"
import BillItemController from "../controller/bill_item_controller.js"
import PaymentController from "../controller/payment_controller.js"
import { checkToken, userPermit, adminPermit } from "../middleware/auth/token_validation.js"




let router = express.Router()

let initApiRoutes = (app) => {

    //user, admin
    router.post('/create-user', UserController.createNewUser)
    router.post('/login', UserController.login)
    router.get('/all-size', checkToken, userPermit, SizeController.getAllSize)


    //admin
    router.get('/all-user', UserController.getAllUser)
    router.post('/create-size', SizeController.createNewSize)
    router.get('/get-detail-user', checkToken, adminPermit, UserController.getDetailUser)
    router.get('/all-category', CategoryController.getAllCategory)
    router.post('/create-category', CategoryController.createNewCategory)
    router.patch('/delete-size', SizeController.deleteSize)
    router.put('/update-size', SizeController.updateSize)
    router.post('/create-product', ProductController.createNewProduct)
    router.get('/all-product', ProductController.getAllProduct)


    router.post('/create-product-size', ProductSizeController.createNewProductSize)
    router.get('/all-product-size', ProductSizeController.getAllProductSize)
    router.get('/detail-product-size', ProductSizeController.getSizeOfProduct)
    router.post('/verify', UserController.verify)
    router.post('/forget-password', UserController.forgetPassword)
    router.put('/reset-password', UserController.resetPassword)

    router.post('/add-to-cart', CartItemController.createNewCartItem)
    router.get('/all-cart-item', CartItemController.getAllCartItem)

    router.get('/all-voucher', VoucherController.getAllVoucher)
    router.post('/create-voucher', VoucherController.createNewVoucher)
    router.delete('/delete-voucher', VoucherController.deleteVoucher)

    router.delete('/delete-cart-item', CartItemController.deleteCartItem)
    router.put('/decease-quantity-item', CartItemController.decreaseQuantity)
    router.put('/incease-quantity-item', CartItemController.increaseQuantity)



    router.post('/payment', PaymentController.payment)
    router.get('/success', PaymentController.paymentSuccess)

    router.post('/create-bill-item', BillItemController.createNewBillItem)
    router.get('/all-bill-pending', BillItemController.getAllBillPeding)
    router.get('/all-bill', BillItemController.getAllBill)



    return app.use('/api/v1', router)
}

module.exports = initApiRoutes