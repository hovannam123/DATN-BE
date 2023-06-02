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

let payment = (user_id) => {
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
            }).then((cart_item) => {
                map_cart_item = cart_item.map((item) => {
                    return {
                        name: item.product_size.Product.name,
                        price: (item.product_size.Product.price / 23000).toFixed(2),
                        currency: "USD",
                        quantity: item.quantity,
                    }
                })

                const create_payment_json = {
                    "intent": "sale",
                    "payer": {
                        "payment_method": "paypal"
                    },
                    "redirect_urls": {
                        "return_url": "http://localhost:3000/api/v1/success?user_id=" + user_id,
                        "cancel_url": "http://localhost:3000/api/v1/cancel"
                    },
                    "transactions": [{
                        "item_list": {
                            "items": map_cart_item
                        },
                        "amount": {
                            "currency": "USD",
                            "total": getTotal(map_cart_item)
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
            })
        }
        catch (err) {
            resolve({
                err: err.message
            })
        }
    })
}


let paymentSuccess = (payerId, paymentId, user_id) => {
    return new Promise((resolve, reject) => {
        const execute_payment_json = {
            "payer_id": payerId,
            "transactions": [{
                "amount": {
                    "currency": "USD",
                    "total": getTotal(map_cart_item)
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
                await BillItemService.createNewBillItem(user_id)
                await db.CartItem.destroy({
                    where: {
                        user_id: user_id
                    }
                })
                resolve({
                    statusCode: 200,
                    message: "Success"
                })
            }
        });
    })
}

module.exports = {
    payment,
    paymentSuccess
}
