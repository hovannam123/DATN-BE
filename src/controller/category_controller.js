
import CategoryService from "../service/category_service"


let createNewCategory = async (req, res) => {
    let message = await CategoryService.createNewCategory(req.body)
    return res.status(200).json(message)
}


let getAllCategory = async (req, res) => {
    let data = await CategoryService.getAllCategory()
    return res.status(200).json(data)
}


module.exports = {
    createNewCategory,
    getAllCategory
}