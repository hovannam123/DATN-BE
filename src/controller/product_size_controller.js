
import ProductSizeService from "../service/product_size_service"


let createNewProductSize = async (req, res) => {
    let result = await ProductSizeService.createNewProductSize(req.body)
    if (result.statusCode == 200) {
        res.status(200).json(result);
    } else {
        res.status(400).json(result);
    }
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
    let result = await ProductSizeService.getAllProductSize()
    if (result.statusCode == 200) {
        res.status(200).json(result);
    } else {
        res.status(400).json(result);
    }
}

let deleteProductSize = async (req, res) => {
    let result = await ProductSizeService.deleteProductSize(req.body)
    if (result.statusCode == 200) {
        res.status(200).json(result);
    } else {
        res.status(400).json(result);
    }
}

let importAmount = async (req, res) => {
    let result = await ProductSizeService.importAmount(req.body, req.query.product_size_id)
    if (result.statusCode == 200) {
        res.status(200).json(result);
    } else {
        res.status(400).json(result);
    }
}


module.exports = {
    createNewProductSize,
    getAllProductSize,
    getSizeOfProduct,
    importAmount,
    deleteProductSize
}