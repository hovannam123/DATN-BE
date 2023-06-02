import BillItemService from "../service/bill_item_service"



let createNewBillItem = async (req, res) => {
    let message = await BillItemService.createNewBillItem(req.query.user_id)
    return res.status(200).json(message)
}

let getAllBillPeding = async (req, res) => {
    let result = await BillItemService.getAllBillPeding()
    if (result.statusCode == 200) {
        res.status(200).json(result);
    } else {
        res.status(400).json(result);
    }
}

let getAllBill = async (req, res) => {
    let result = await BillItemService.getAllBill()
    if (result.statusCode == 200) {
        res.status(200).json(result);
    } else {
        res.status(400).json(result);
    }
}

module.exports = {
    createNewBillItem,
    getAllBillPeding,
    getAllBill
}