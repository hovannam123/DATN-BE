
import SizeService from "../service/size_service"


let createNewSize = async (req, res) => {
    let result = await SizeService.createNewSize(req.body)
    if (result.statusCode == 200) {
        res.status(200).json(result);
    } else {
        res.status(400).json(result);
    }

}


let getAllSize = async (req, res) => {

    let result = await SizeService.getAllSize()
    if (result.statusCode == 200) {
        res.status(200).json(result);
    } else {
        res.status(400).json(result);
    }
}

let deleteSize = async (req, res) => {
    let result = await SizeService.deleteSize(req.query.id)
    if (result.statusCode == 200) {
        res.status(200).json(result);
    } else {
        res.status(400).json(result);
    }
}

let updateSize = async (req, res) => {
    let result = await SizeService.updateSize(req.query.id, req.body)

    if (result.statusCode == 200) {
        res.status(200).json(result);
    } else {
        res.status(400).json(result);
    }
}


module.exports = {
    createNewSize,
    getAllSize,
    updateSize,
    deleteSize
}