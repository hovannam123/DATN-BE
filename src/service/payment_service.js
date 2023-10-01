const paypal = require('paypal-rest-sdk');
import db from "../models"
import BillItemService from "../service/bill_item_service"



let map_cart_item = {}
let getTotal = (map) => {

    let total = 0;
    for (let i = 0; i < map.length; i++) {
        total += map[i].quantity * map[i].price
    }

    return total.toFixed(2)
}

let getPercent = async (voucher_user_id) => {
    let percent = 0
    if (voucher_user_id == undefined) {
        percent = 0
    }
    else {
        let voucher = await db.VoucherUser.findOne(
            {
                where: {
                    id: voucher_user_id
                },
                include: {
                    model: db.Voucher
                },
                raw: false
            }
        )
        if (voucher) {
            percent = voucher.Voucher.value_percent
        }
    }

    return percent
}



let payment = (user_id, voucher_user_id) => {
    return new Promise(async (resolve, reject) => {
        try {
            await db.CartItem.findAll({
                where: {
                    user_id: user_id
                },
                attributes: {
                    exclude: ["createdAt", 'updatedAt', "product_size_id", "user_id"]
                },
                include: [
                    {
                        model: db.ProductSize,
                        as: "product_size",
                        attributes: ["amount"],
                        include: [
                            {
                                model: db.Product,
                                attributes: {
                                    exclude: ["status", "updatedAt", "createdAt", 'delete_flag']
                                }
                            },
                            {
                                model: db.Size,
                                attributes: {
                                    exclude: ["updatedAt", "createdAt", 'delete_flag']
                                }
                            },

                        ]
                    },

                ],
                raw: false
            }).then(async (cart_item) => {

                if (cart_item.length == 0) {
                    resolve({
                        statusCode: 400,
                        message: "Cart item null"
                    })
                }
                else {
                    map_cart_item = cart_item.map((item) => {
                        return {
                            name: item.product_size.Product.name,
                            price: (item.product_size.Product.price / 23000).toFixed(2),
                            currency: "USD",
                            quantity: item.quantity,
                        }
                    })

                    let total = getTotal(map_cart_item)
                    let voucher_price = (await getPercent(voucher_user_id) * total).toFixed(2)

                    const create_payment_json = {
                        "intent": "sale",
                        "payer": {
                            "payment_method": "paypal"
                        },
                        "redirect_urls": {
                            "return_url": voucher_user_id != undefined ? ("http://localhost:3000/api/v1/success?user_id=" + user_id + "&voucher_user_id=" + voucher_user_id) : ("http://localhost:3000/api/v1/success?user_id=" + user_id),
                            "cancel_url": "http://localhost:3000/api/v1/cancel"

                            // "return_url": ("https://api.safefood.fun/api/v1/success?user_id=" + user_id + "&voucher_user_id=" + voucher_user_id),
                            // "cancel_url": "https://api.safefood.fun/api/v1/cancel"


                        },
                        "transactions": [{
                            "item_list": {
                                "items": map_cart_item
                            },

                            "amount": {
                                "currency": "USD",
                                "total": (total - voucher_price).toFixed(2),
                                "details": {
                                    "subtotal": total,
                                    "discount": voucher_price // Discount amount
                                }
                            },
                        }]
                    };

                    paypal.payment.create(create_payment_json, function (error, payment) {
                        if (error) {
                            throw error;
                        } else {
                            for (let i = 0; i < payment.links.length; i++) {
                                if (payment.links[i].rel === 'approval_url') {
                                    resolve({
                                        statusCode: 200,
                                        url: payment.links[i].href
                                    })
                                }
                            }
                        }
                    });
                }
            })
        }
        catch (err) {
            resolve({
                statusCode: 400,
                message: err.message
            })
        }
    })
}


let paymentSuccess = (payerId, paymentId, user_id, voucher_user_id) => {
    return new Promise(async (resolve, reject) => {
        let total = getTotal(map_cart_item)
        let voucher_price = (await getPercent(voucher_user_id) * total).toFixed(2)
        const execute_payment_json = {
            "payer_id": payerId,
            "transactions": [{
                "amount": {
                    "currency": "USD",
                    "total": (total - voucher_price).toFixed(2),
                }
            }]
        };

        // Obtains the transaction details from paypal
        paypal.payment.execute(paymentId, execute_payment_json, async function (error, payment) {
            //When error occurs when due to non-existent transaction, throw an error else log the transaction details in the console then send a Success string reposponse to the user.
            if (error) {
                resolve({
                    statusCode: 400,
                    message: error.message
                })
            } else {

                await BillItemService.createNewBillItem(user_id, voucher_user_id).then(async (bill) => {
                    await db.CartItem.destroy({
                        where: {
                            user_id: user_id
                        }
                    })

                    resolve({
                        statusCode: 200,
                        message: "Success"
                    })
                })

            }
        });
    })
}

module.exports = {
    payment,
    paymentSuccess
}
