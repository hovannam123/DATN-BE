import { raw } from "body-parser"
import db from "../models"

let getTotal_oririgin = async (data) => {
    let total = 0
    let products = []
    for (let i = 0; i < data.length; i++) {
        let product = await db.Product.findOne({
            include: {
                model: db.ProductSize,
                as: 'size_data',
                where: {
                    id: data[i].product_size_id
                }
            },
            raw: false
        }).catch((err) => console.log(err.message))

        total += product.price * data[i].quantity
    }
    // console.log(total.toFixed(2))
    return total
}

let createNewBillItem = (user_id) => {
    return new Promise(async (resolve, reject) => {
        try {
            await db.Bill.create({
                user_id: user_id,
                total_origin: 0,
                total_voucher: 0,
                total_payment: 0,
            }).then(async (bill) => {
                await db.Payment.create({
                    bill_id: bill.id,
                    payment_infor: ""
                })
                let cart_item = await db.CartItem.findAll({
                    where: {
                        user_id: user_id
                    }
                })
                console.log(cart_item)
                let mappedBillItems = cart_item.map((billItem) => {
                    return {
                        bill_id: bill.id,
                        product_size_id: billItem.product_size_id,
                        quantity: billItem.quantity,
                    }
                })
                await db.BillItem.bulkCreate(
                    mappedBillItems
                ).then(async (bill_items) => {
                    let total_origin = await getTotal_oririgin(bill_items);
                    await bill.update({
                        total_origin: total_origin,
                        total_voucher: 0,
                        total_payment: total_origin
                    })
                    resolve({
                        message: "successs"
                    })
                }).catch(err => {
                    resolve({
                        message: err.message
                    })
                })
            }).catch(err => {
                resolve({
                    message: err.message
                })
            })
        } catch (err) {
            console.log(err)

            resolve({
                err
            })
        }
    })
}

let getAllBillPeding = () => {
    return new Promise(async (resolve, reject) => {
        try {
            await db.Bill.findAll({
                where: {
                    status: "PENDING"
                },

                attributes: {
                    exclude: ["updatedAt", "bill_id"]
                },
                include: [
                    {
                        model: db.User,
                        attributes: {
                            exclude: ["createdAt", "updatedAt"]
                        }
                    },
                ],
                raw: false,
            }).then((bill) => {
                resolve({
                    statusCode: 200,
                    data: bill
                })
            }).catch((err) => {
                console.log(err)
                resolve({
                    statusCode: 400,
                    message: err.message
                })
            })
        } catch (err) {
            resolve({
                statusCode: 400,
                message: err.message
            })
        }
    })
}

let getAllBill = () => {
    return new Promise(async (resolve, reject) => {
        try {
            await db.Bill.findAll({
                attributes: {
                    exclude: ["updatedAt", "bill_id"]
                },
                include: [
                    {
                        model: db.User,
                        attributes: {
                            exclude: ["createdAt", "updatedAt"]
                        }
                    },
                ],
                raw: false,
            }).then((bill) => {
                resolve({
                    statusCode: 200,
                    data: bill
                })
            }).catch((err) => {
                console.log(err)
                resolve({
                    statusCode: 400,
                    message: err.message
                })
            })
        } catch (err) {
            resolve({
                statusCode: 400,
                message: err.message
            })
        }
    })
}

module.exports = {
    getTotal_oririgin,
    createNewBillItem,
    getAllBillPeding,
    getAllBill
}



