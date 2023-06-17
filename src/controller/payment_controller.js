import PaymentService from "../service/payment_service"
const paypal = require('paypal-rest-sdk');


let payment = async (req, res) => {

    let result = await PaymentService.payment(req.query.user_id, req.query.voucher_user_id)
    if (result.statusCode == 200) {
        return res.status(200).json(result)
    }
    else {
        return res.status(400).json(result)
    }

}

let paymentSuccess = async (req, res) => {
    let result = await PaymentService.paymentSuccess(req.query.PayerID, req.query.paymentId, req.query.user_id, req.query.voucher_user_id)
    if (result.statusCode == 200) {
        return res.send(
            result.message
        )
    }
    else {
        return res.send(
            result.message
        )
    }
}


module.exports = {
    payment,
    paymentSuccess
}