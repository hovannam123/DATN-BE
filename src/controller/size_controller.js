
import SizeService from "../service/size_service"


let createNewSize = async (req, res) => {
    let message = await SizeService.createNewSize(req.body)
    return res.status(200).json(message)
}


let getAllSize = async (req, res) => {
    let data = await SizeService.getAllSize()
    return res.status(200).json(data)
}

let deleteSize = async (req, res) => {
    let message = await SizeService.deleteSize(req.query.id)
    return res.status(200).json(message)
}

let updateSize = async (req, res) => {
    let message = await SizeService.updateSize(req.query.id, req.body)
    return res.status(200).json(message)
}


module.exports = {
    createNewSize,
    getAllSize,
    updateSize,
    deleteSize
}