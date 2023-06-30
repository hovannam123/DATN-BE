import BillItemService from "../service/bill_item_service"



let createNewBillItem = async (req, res) => {
    let message = await BillItemService.createNewBillItem(req.query.user_id, req.query.voucher_user_id)
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

let getBillCount = async (req, res) => {
    let result = await BillItemService.getBillCount()
    if (result.statusCode == 200) {
        res.status(200).json(result);
    } else {
        res.status(400).json(result);
    }
}

let getAllBillItem = async (req, res) => {
    let result = await BillItemService.getAllBillItem()
    if (result.statusCode == 200) {
        res.status(200).json(result);
    } else {
        res.status(400).json(result);
    }
}

let getAllBillItemPending = async (req, res) => {
    let result = await BillItemService.getAllBillItemPending()
    if (result.statusCode == 200) {
        res.status(200).json(result);
    } else {
        res.status(400).json(result);
    }
}

let verifyOrder = async (req, res) => {
    let result = await BillItemService.verifyOrder(req.body.id)
    if (result.statusCode == 200) {
        res.status(200).json(result);
    } else {
        res.status(400).json(result);
    }
}

let verifyAllOrder = async (req, res) => {
    let result = await BillItemService.verifyAllOrder()
    if (result.statusCode == 200) {
        res.status(200).json(result);
    } else {
        res.status(400).json(result);
    }
}

let getTopSellingProducts = async (req, res) => {
    let result = await BillItemService.getTopSellingProducts()
    if (result.statusCode == 200) {
        res.status(200).json(result);
    } else {
        res.status(400).json(result);
    }
}

let getAllBilItemUser = async (req, res) => {
    let result = await BillItemService.getAllBilItemUser(req.query.user_id)
    if (result.statusCode == 200) {
        res.status(200).json(result);
    } else {
        res.status(400).json(result);
    }
}

module.exports = {
    createNewBillItem,
    getAllBillPeding,
    getAllBill,
    getBillCount,
    getAllBillItem,
    getAllBillItemPending,
    verifyOrder,
    verifyAllOrder,
    getTopSellingProducts,
    getAllBilItemUser,
}