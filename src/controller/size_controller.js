import { json } from "body-parser"
import SizeService from "../service/size_service"


let createNewSize = async (req, res) => {
    let message = await SizeService.createNewSize(req.body)
    return res.status(200).json({
        message: message
    })
}


let getAllSize = async (req, res) => {
    let data = await SizeService.getAllSize()
    return res.status(200).json(data)
}


module.exports = {
    createNewSize,
    getAllSize
}