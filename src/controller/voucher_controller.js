
import VoucherService from "../service/voucher_service"


let createNewVoucher = async (req, res) => {
    let result = await VoucherService.createNewVoucher(req.body)
    if (result.statusCode == 200) {
        res.status(200).json(result);
    } else {
        res.status(400).json(result);
    }
}


let getAllVoucher = async (req, res) => {
    let result = await VoucherService.getAllVoucher()
    if (result.statusCode == 200) {
        res.status(200).json(result);
    } else {
        res.status(400).json(result);
    }
}

let deleteVoucher = async (req, res) => {
    let result = await VoucherService.deleteVoucher(req.body)
    if (result.statusCode == 200) {
        res.status(200).json(result);
    } else {
        res.status(400).json(result);
    }
}

let updateVoucher = async (req, res) => {
    let result = await VoucherService.updateVoucher(req.query.id, req.body)
    if (result.statusCode == 200) {
        res.status(200).json(result);
    } else {
        res.status(400).json(result);
    }
}

let getAllVoucherUser = async (req, res) => {
    let result = await VoucherService.getAllVoucherUser(req.query.user_id)
    if (result.statusCode == 200) {
        res.status(200).json(result);
    } else {
        res.status(400).json(result);
    }
}



module.exports = {
    createNewVoucher,
    getAllVoucher,
    updateVoucher,
    deleteVoucher,
    getAllVoucherUser
}