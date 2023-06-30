
import VoucherUserService from "../service/voucher_user_service"


let createNewVoucherUser = async (req, res) => {
    let result = await VoucherUserService.createNewVoucherUser(req.body)
    if (result.statusCode == 200) {
        res.status(200).json(result);
    } else {
        res.status(400).json(result);
    }
}

let deleteVoucherUser = async (req, res) => {
    let result = await VoucherUserService.deleteVoucherUser(req.body)
    if (result.statusCode == 200) {
        res.status(200).json(result);
    } else {
        res.status(400).json(result);
    }
}




module.exports = {
    createNewVoucherUser,
    deleteVoucherUser
}