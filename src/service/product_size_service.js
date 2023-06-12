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
                        attributes: ["amount"],
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
                        model: db.ProductSize,
                        as: "size_data",
                        attributes: ["amount"],
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
                    message: "Server error"
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


let createNewProductSize = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.size_id || !data.product_id || !data.amount) {
                resolve({
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
                        resolve({ message: "Increase amount of Product Size" })
                    }
                }
                else {
                    resolve({ message: "Create new size of product success" })
                }
            }
        } catch (error) {
            reject({
                error: error
            })
        }
    })
}


let deleteProduct = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!id) {
                resolve({
                    message: "Invalid id"
                })
            }
            else {
                let count = await db.Product.update({
                    delete_flag: true,
                },
                    {
                        where: {
                            id: id
                        }
                    })
                if (count > 0) {
                    resolve({
                        message: "Delete success"
                    })
                }
                else {
                    resolve({
                        message: "Delete fail"
                    })
                }
            }
        } catch (error) {
            reject({
                error: error
            })
        }
    })
}



module.exports = {
    getAllProductSize,
    createNewProductSize,
    getSizeOfProduct,
    // updateProduct,
    // deleteProduct
}