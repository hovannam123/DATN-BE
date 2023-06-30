import db from "../models"


const { Op } = require("sequelize");

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
    return total
}


let createNewBillItem = (user_id, voucher_user_id) => {
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
                    let percent = 0
                    if (voucher_user_id != undefined) {
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
                        percent = voucher.Voucher.value_percent

                    }
                    else {
                        percent = 0
                    }


                    let total_origin = await getTotal_oririgin(bill_items);
                    await bill.update({
                        total_origin: total_origin,
                        total_voucher: total_origin * percent,
                        total_payment: total_origin - total_origin * percent
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

let getBillCount = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const currentDate = new Date();
            const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
            const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

            await db.Bill.findAll({
                where: {
                    createdAt: {
                        [Op.between]: [startOfMonth, endOfMonth]
                    }
                },
                attributes: {
                    exclude: ["bill_id", "id", "user_id", "total_origin", "total_voucher", "total_payment", "status", "createdAt", "updatedAt"],
                    include: [
                        [db.sequelize.fn('DATE', db.sequelize.col('Bill.createdAt')), 'date'],
                        [db.sequelize.fn('COUNT', db.sequelize.col('Bill.id')), 'count'],
                        [db.sequelize.fn('SUM', db.sequelize.col('Bill.total_payment')), 'total_payment'],
                    ]
                },
                group: [db.sequelize.fn('DATE', db.sequelize.col('Bill.createdAt'))],
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
            console.log(err)
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

let getAllBilItemUser = (user_id) => {
    return new Promise(async (resolve, reject) => {
        try {

            await db.Bill.findAll({
                attributes: {
                    exclude: ["bill_id"]
                },
                where: {
                    user_id: user_id
                },
                include: [
                    {
                        model: db.BillItem,
                        attributes: {
                            exclude: ["product_size_id", "bill_id", "id"]
                        },
                        include: [
                            {
                                model: db.ProductSize,
                                attributes: {
                                    exclude: ["createdAt", "updatedAt", "size_id", "product_id"]
                                },
                                include: [
                                    {
                                        model: db.Product,
                                        attributes: {
                                            exclude: ["createdAt", "updatedAt"]
                                        }
                                    },
                                    {
                                        model: db.Size,
                                        attributes: {
                                            exclude: ["createdAt", "updatedAt"]
                                        }
                                    },
                                ],
                            },
                        ],
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

let getAllBillItem = () => {
    return new Promise(async (resolve, reject) => {
        try {

            await db.Bill.findAll({
                attributes: {
                    exclude: ["bill_id"]
                },
                include: [
                    {
                        model: db.BillItem,
                        attributes: {
                            exclude: ["createdAt", "updatedAt"]
                        },
                        include: [
                            {
                                model: db.ProductSize,
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
                    },
                    {
                        model: db.User,
                        attributes: ["id", "email", "phone_number"]
                    }
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

let getAllBillItemPending = () => {
    return new Promise(async (resolve, reject) => {
        try {

            await db.Bill.findAll({
                where: {
                    status: "PENDING"
                },
                attributes: {
                    exclude: ["bill_id"]
                },
                include: [
                    {
                        model: db.BillItem,
                        attributes: {
                            exclude: ["createdAt", "updatedAt"]
                        },
                        include: [
                            {
                                model: db.ProductSize,
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
                    },
                    {
                        model: db.User,
                        attributes: ["id", "email", "phone_number"]
                    }
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

let verifyOrder = (bill_id) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!bill_id) {
                resolve({
                    statusCode: 400,
                    message: "Missing required params"
                })
            }
            else {
                await db.Bill.update(
                    {
                        status: "VERIFY"
                    },
                    {
                        where: {
                            id: bill_id
                        }
                    }
                ).then((_) => {
                    resolve({
                        statusCode: 200,
                        message: "Verify order success!"
                    })
                }).catch((err) => {
                    resolve({
                        statusCode: 400,
                        message: err.message
                    })
                })
            }

        }
        catch (err) {
            resolve({
                statusCode: 400,
                message: err.message
            })
        }
    })
}


let verifyAllOrder = () => {
    return new Promise(async (resolve, reject) => {
        try {
            await db.Bill.update(
                {
                    status: "VERIFY"
                },
                {
                    where: {
                        status: "PENDING"
                    }
                }

            ).then((_) => {
                resolve({
                    statusCode: 200,
                    message: "Verify all order success!"
                })
            }).catch((err) => {
                resolve({
                    statusCode: 400,
                    message: err.message
                })
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

let getTopSellingProducts = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const currentDate = new Date();
            const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
            const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);


            const topSellingProducts = await db.BillItem.findAll({
                where: {
                    createdAt: {
                        [Op.between]: [startOfMonth, endOfMonth]
                    }
                },
                attributes: [
                    [db.sequelize.fn('SUM', db.sequelize.col('quantity')), 'total_quantity']
                ],
                group: ['product_id'],
                order: db.sequelize.literal('total_quantity DESC'),
                limit: 6,
                include: [
                    {
                        model: db.ProductSize,
                        attributes: ['id'],
                        include: [
                            {
                                model: db.Product,
                                attributes: ['id', 'name', 'image_origin', 'description', 'price', 'category_id']
                            },
                        ]
                    },

                ],
                raw: false,
            });
            resolve({
                statusCode: 200,
                data: topSellingProducts
            })
        } catch (error) {
            resolve({
                statusCode: 400,
                message: error.message
            })
        }
    })
}


module.exports = {
    getTotal_oririgin,
    createNewBillItem,
    getAllBillPeding,
    getAllBill,
    getBillCount,
    getAllBillItem,
    getAllBillItemPending,
    verifyOrder,
    verifyAllOrder,
    getTopSellingProducts,
    getAllBilItemUser
}



