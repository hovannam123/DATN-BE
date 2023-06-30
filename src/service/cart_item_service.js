
import { where } from "sequelize"
import db from "../models"
import { raw } from "body-parser"

let createNewCartItem = (data, user_id) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.product_id || !data.size_id || !data.quantity) {
                resolve({
                    statusCode: 400,
                    message: "Missing required parameter!"
                })
            }
            else {
                let product = await db.Product.findOne({
                    where: {
                        id: data.product_id
                    }
                })

                let product_size = await db.ProductSize.findOne({
                    where: {
                        product_id: data.product_id,
                        size_id: data.size_id
                    },
                    raw: false
                })

                if (product_size) {
                    let [object, created] = await db.CartItem.findOrCreate({
                        where: {
                            product_size_id: product_size.id,
                            user_id: user_id
                        },
                        defaults: {
                            quantity: data.quantity,
                            total: product.price * data.quantity
                        }
                    })
                    if (!created) {
                        let quantity = object.quantity + data.quantity
                        let total = product.price * quantity
                        await db.CartItem.update({
                            quantity: quantity,
                            total: total
                        },
                            {
                                where: {
                                    product_size_id: product_size.id,
                                    user_id: user_id
                                }
                            }
                        ).then(async (_) => {
                            if (product_size.amount >= data.quantity) {
                                await product_size.update({
                                    amount: product_size.amount - data.quantity
                                })
                            }
                            else {
                                resolve({
                                    statusCode: 400,
                                    message: "Excessive amount"
                                })
                            }

                        })
                        resolve({
                            statusCode: 200,
                            message: "Increase quantity of cart item"
                        })
                    }
                    else {
                        if (product_size.amount >= data.quantity) {
                            await product_size.update({
                                amount: product_size.amount - data.quantity
                            })
                        }
                        else {
                            resolve({
                                statusCode: 400,
                                message: "Excessive amount"
                            })
                        }
                        resolve({
                            statusCode: 200,
                            message: "Add to cart success"
                        })
                    }
                }
                else {
                    resolve({
                        statusCode: 400,

                        message: "Invalid product size"
                    })
                }


            }
        } catch (err) {
            console.log(err)
            resolve({
                statusCode: 400,

                message: err.message
            })
        }
    })
}

let getAllCartItem = (user_id) => {
    return new Promise(async (resolve, reject) => {
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
                {
                    model: db.User,
                    as: "user",
                    attributes: ["id", "email", "phone_number"]
                }
            ],
            raw: false
        }).then(cart_item => {
            resolve({
                statusCode: 200,
                data: cart_item
            })
        }).catch(error => {
            resolve({
                statusCode: 400,
                message: "Server error!"
            })
        })
    })
}

let deleteCartItem = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.cart_item_id) {
                resolve({
                    statusCode: 400,
                    message: "Invalid id"
                })
            }
            else {
                await db.CartItem.findOne(
                    {
                        where: {
                            id: data.cart_item_id
                        },
                        raw: false
                    }
                ).then(async (cart_item) => {
                    let product_size = await db.ProductSize.findOne({
                        where: {
                            id: cart_item.product_size_id
                        },
                        raw: false
                    })
                    await product_size.update({
                        amount: product_size.amount + cart_item.quantity
                    })
                    await cart_item.destroy(

                    ).then((_) => {
                        resolve({
                            statusCode: 200,
                            message: "Delete success"
                        })
                    }).catch((err) => {
                        resolve({
                            statusCode: 400,
                            message: err.message
                        })
                    })


                }).catch((err) => {
                    resolve({
                        statusCode: 400,
                        message: err.message
                    })
                })

            }
        } catch (error) {
            resolve({
                statusCode: 400,
                error: error
            })
        }
    })
}

let decreaseQuantity = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.cart_item_id) {
                resolve({
                    statusCode: 400,

                    message: "Invalid id"
                })
            }
            else {
                let cart_item = await db.CartItem.findOne({
                    where: {
                        id: data.cart_item_id
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
                        {
                            model: db.User,
                            as: "user",
                            attributes: ["id", "email", "phone_number"]
                        }
                    ],
                    raw: false
                })

                if (cart_item.quantity > 1) {
                    let quantity = cart_item.quantity - 1
                    let total = quantity * cart_item.product_size.Product.price
                    await db.CartItem.update({
                        quantity: quantity,
                        total: total
                    },
                        {
                            where: {
                                id: data.cart_item_id,
                            }
                        })
                    resolve({
                        statusCode: 200,
                        message: "Descease quantity success"
                    })
                }
                resolve({
                    statusCode: 400,
                    message: "Exceeding the amount"
                })

            }
        } catch (error) {
            resolve({
                error: error.message
            })
        }
    })
}

let increaseQuantity = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.cart_item_id) {
                resolve({
                    statusCode: 400,
                    message: "Invalid id"
                })
            }
            else {
                let cart_item = await db.CartItem.findOne({
                    where: {
                        id: data.cart_item_id
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
                        {
                            model: db.User,
                            as: "user",
                            attributes: ["id", "email", "phone_number"]
                        }
                    ],
                    raw: false
                })

                if (cart_item) {
                    let quantity = cart_item.quantity + 1
                    let total = quantity * cart_item.product_size.Product.price
                    await db.CartItem.update({
                        quantity: quantity,
                        total: total
                    },
                        {
                            where: {
                                id: data.cart_item_id,
                            }
                        })
                    resolve({
                        statusCode: 200,
                        message: "Inscease quantity success"
                    })
                }
            }
        } catch (error) {
            resolve({
                error: error.message
            })
        }
    })
}


module.exports = {
    createNewCartItem,
    getAllCartItem,
    deleteCartItem,
    decreaseQuantity,
    increaseQuantity
}