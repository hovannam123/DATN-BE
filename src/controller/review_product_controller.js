
import ReviewProductService from "../service/review_product_service"


let createNewComment = async (req, res) => {
    let result = await ReviewProductService.createNewComment(req.body, req.query.user_id, req.query.product_id)
    if (result.statusCode == 200) {
        res.status(200).json(result);
    } else {
        res.status(400).json(result);
    }

}


let getAllComment = async (req, res) => {
    let result = await ReviewProductService.getAllComment(req.query.product_id)
    if (result.statusCode == 200) {
        res.status(200).json(result);
    } else {
        res.status(400).json(result);
    }
}


module.exports = {
    createNewComment,
    getAllComment,
}