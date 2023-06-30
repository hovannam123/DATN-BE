
import ProductService from "../service/product_service"


let createNewProduct = async (req, res) => {
    let result = await ProductService.createNewProduct(req.body)
    if (result.statusCode == 200) {
        res.status(200).json(result);
    } else {
        res.status(400).json(result);
    }
}


let getAllProduct = async (req, res) => {
    let result = await ProductService.getAllProduct()
    if (result.statusCode == 200) {
        res.status(200).json(result);
    } else {
        res.status(400).json(result);
    }
}

let deleteProduct = async (req, res) => {
    let message = await ProductService.deleteProduct(req.query.id)
    return res.status(200).json(message)
}

let updateProduct = async (req, res) => {
    let message = await ProductService.updateProduct(req.query.id, req.body)
    return res.status(200).json(message)
}

let getAllProductByCategory = async (req, res) => {
    let result = await ProductService.getAllProductByCategory(req.query.category_id)
    if (result.statusCode == 200) {
        res.status(200).json(result);
    } else {
        res.status(400).json(result);
    }
}

let searchProduct = async (req, res) => {
    let result = await ProductService.searchProduct(req.query.category_id, req.query.text)
    if (result.statusCode == 200) {
        res.status(200).json(result);
    } else {
        res.status(400).json(result);
    }
}


module.exports = {
    createNewProduct,
    getAllProduct,
    updateProduct,
    getAllProductByCategory,
    deleteProduct,
    searchProduct
}