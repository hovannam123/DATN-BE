
import CategoryService from "../service/category_service"


let createNewCategory = async (req, res) => {
    let result = await CategoryService.createNewCategory(req.body)
    if (result.statusCode == 200) {
        res.status(200).json(result);
    } else {
        res.status(400).json(result);
    }
}


let getAllCategory = async (req, res) => {
    let result = await CategoryService.getAllCategory()
    if (result.statusCode == 200) {
        res.status(200).json(result);
    } else {
        res.status(400).json(result);
    }
}


module.exports = {
    createNewCategory,
    getAllCategory
}