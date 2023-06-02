
import ProductSizeService from "../service/product_size_service"


let createNewProductSize = async (req, res) => {
    let message = await ProductSizeService.createNewProductSize(req.body)
    return res.status(200).json(message)
}

let getSizeOfProduct = async (req, res) => {
    let result = await ProductSizeService.getSizeOfProduct(req.query.product_id)
    if (result.statusCode == 200) {
        res.status(200).json(result);
    } else {
        res.status(400).json(result);
    }
}

let getAllProductSize = async (req, res) => {
    let data = await ProductSizeService.getAllProductSize()
    return res.status(200).json(data)
}

let deleteProduct = async (req, res) => {
    let message = await ProductService.deleteProduct(req.query.id)
    return res.status(200).json(message)
}

let updateProduct = async (req, res) => {
    let message = await ProductService.updateProduct(req.query.id, req.body)
    return res.status(200).json(message)
}


module.exports = {
    createNewProductSize,
    getAllProductSize,
    getSizeOfProduct,
    // updateProduct,
    // deleteProduct
}