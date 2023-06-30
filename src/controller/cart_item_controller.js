
import CartItemService from "../service/cart_item_service"


let getAllCartItem = async (req, res) => {
    let result = await CartItemService.getAllCartItem(req.query.user_id)
    if (result.statusCode == 200) {
        res.status(200).json(result);
    } else {
        res.status(400).json(result);
    }
}


let createNewCartItem = async (req, res) => {
    let result = await CartItemService.createNewCartItem(req.body, req.query.user_id)
    if (result.statusCode == 200) {
        res.status(200).json(result);
    } else {
        res.status(400).json(result);
    }
}

let deleteCartItem = async (req, res) => {
    let result = await CartItemService.deleteCartItem(req.body)
    if (result.statusCode == 200) {
        res.status(200).json(result);
    } else {
        res.status(400).json(result);
    }
}

let decreaseQuantity = async (req, res) => {
    let result = await CartItemService.decreaseQuantity(req.body)
    if (result.statusCode == 200) {
        res.status(200).json(result);
    } else {
        res.status(400).json(result);
    }
}

let increaseQuantity = async (req, res) => {
    let result = await CartItemService.increaseQuantity(req.body)
    console.log(result)
    if (result.statusCode == 200) {
        res.status(200).json(result);
    } else {
        res.status(400).json(result);
    }
}


module.exports = {
    createNewCartItem,
    getAllCartItem,
    deleteCartItem,
    decreaseQuantity,
    increaseQuantity
}