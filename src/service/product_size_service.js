import { raw } from "body-parser"
import db from "../models"


let getAllProductSize = () => {
    return new Promise(async (resolve, reject) => {
        try {
            await db.Product.findAll({

                attributes: {
                    exclude: ["createdAt", "updatedAt", "category_id"]
                },
                include: [
                    {
                        model: db.Category,
                        attributes: {
                            exclude: ["createdAt", "updatedAt", "delete_flag"]
                        }
                    },
                    {
                        model: db.ProductSize,
                        as: "size_data",
                        attributes: ["amount", "id"],
                        include: [
                            {
                                model: db.Size,
                                attributes: {
                                    exclude: ["createdAt", "updatedAt", "delete_flag"]
                                }
                            }],
                    },
                ],
                raw: false
            }).then(products => {
                resolve({
                    statusCode: 200,
                    data: products
                })
            }).catch(err => {
                resolve({
                    statusCode: 400,
                    message: err.message
                })
            })
        } catch (error) {
            reject({
                statusCode: 400,
                message: "Server error"
            })
        }
    })
}

let getSizeOfProduct = (product_id) => {
    return new Promise(async (resolve, reject) => {
        try {

            await db.Product.findOne({
                where: {
                    id: product_id
                },

                attributes: {
                    exclude: ["createdAt", "updatedAt", "category_id"]
                },
                include: [
                    {
                        model: db.Category,
                        attributes: {
                            exclude: ["createdAt", "updatedAt", "delete_flag"]
                        }
                    },
                    {
                        model: db.ProductImage,
                        attributes: {
                            exclude: ["createdAt", "updatedAt"]
                        }
                    },
                    {
                        model: db.ProductSize,
                        as: "size_data",
                        attributes: ["id", "amount"],
                        include: [
                            {
                                model: db.Size,
                                attributes: {
                                    exclude: ["createdAt", "updatedAt", "delete_flag"]
                                }
                            },


                        ],
                    },

                ],
                raw: false
            }).then(products => {
                resolve({
                    statusCode: 200,
                    data: products
                })
            }).catch(err => {
                resolve({
                    statusCode: 400,
                    message: err.message
                })
            })
        } catch (error) {
            resolve({
                statusCode: 400,
                message: "Server error"
            })
        }
    })
}


let createNewProductSize = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.size_id || !data.product_id || !data.amount) {
                resolve({
                    statusCode: 400,
                    message: "Missing required parameter!"
                })
            }
            else {
                let [product, created] = await db.ProductSize.findOrCreate({
                    where: {
                        size_id: data.size_id,
                        product_id: data.product_id,
                    },
                    defaults: {
                        amount: data.amount
                    }
                })
                if (!created) {
                    let count = await db.ProductSize.update({
                        amount: product.amount + data.amount,
                    },
                        {
                            where: {
                                id: product.id,
                            }
                        })
                    if (count > 0) {
                        resolve({
                            statusCode: 200,
                            message: "Increase amount of Product Size"
                        })
                    }
                }
                else {
                    resolve({
                        statusCode: 200,
                        message: "Create new size of product success"
                    })
                }
            }
        } catch (error) {
            resolve({
                statusCode: 400,

                message: error.message
            })
        }
    })
}


let deleteProductSize = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.product_size_id) {
                resolve({
                    statusCode: 400,
                    message: "Invalid id"
                })
            }
            else {
                await db.ProductSize.destroy(
                    {
                        where: {
                            id: data.product_size_id,
                        }
                    }).then((row) => {
                        console.log(row)
                        resolve({
                            statusCode: 200,
                            message: "Delete success"
                        })
                    }

                    ).catch(err => {
                        resolve({
                            statusCode: 400,
                            message: err.message
                        })
                    })
            }
        } catch (error) {
            resolve({
                statusCode: 400,

                message: error.message
            })
        }
    })
}

let importAmount = (data, product_size_id) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!product_size_id) {
                resolve({
                    statusCode: 400,
                    message: "Invalid id"
                })
            }
            else {
                await db.ProductSize.findOne({
                    where: {
                        id: product_size_id
                    },
                    raw: false
                }).then(async (product_size) => {
                    await product_size.update({
                        amount: product_size.amount + data.amount,
                    }).then(
                        resolve({
                            statusCode: 200,
                            message: "Import success"
                        })
                    ).catch((error) => {
                        resolve({
                            statusCode: 400,
                            message: error.message
                        })
                    })

                })
            }
        } catch (error) {
            resolve({
                statusCode: 400,
                message: error.message
            })
        }
    })
}



module.exports = {
    getAllProductSize,
    createNewProductSize,
    getSizeOfProduct,
    importAmount,
    deleteProductSize
}