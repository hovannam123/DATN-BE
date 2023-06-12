
import ProductFavouriteService from "../service/product_favourite"


let createNewFavourite = async (req, res) => {
    let result = await ProductFavouriteService.createNewFavourite(req.body, req.query.user_id)
    if (result.statusCode == 200) {
        res.status(200).json(result);
    } else {
        res.status(400).json(result);
    }

}


let getAllProductFavourite = async (req, res) => {
    let result = await ProductFavouriteService.getAllProductFavourite(req.query.user_id)
    if (result.statusCode == 200) {
        res.status(200).json(result);
    } else {
        res.status(400).json(result);
    }
}

let deleteProductFavourite = async (req, res) => {
    let result = await ProductFavouriteService.deleteProductFavourite(req.body, req.query.user_id)
    if (result.statusCode == 200) {
        res.status(200).json(result);
    } else {
        res.status(400).json(result);
    }
}

let getTopProductFavourite = async (req, res) => {
    let result = await ProductFavouriteService.getTopProductFavourite()
    if (result.statusCode == 200) {
        res.status(200).json(result);
    } else {
        res.status(400).json(result);
    }
}


module.exports = {
    createNewFavourite,
    getAllProductFavourite,
    deleteProductFavourite,
    getTopProductFavourite
}