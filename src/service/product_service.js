
import db from "../models"
const { Op } = require("sequelize");

let getAllProduct = () => {
    return new Promise(async (resolve, reject) => {
        try {
            await db.Product.findAll({
                attributes: {
                    exclude: ["createdAt", "updatedAt"]
                },
                include: [
                    {
                        model: db.Category,
                        attributes: {
                            exclude: ["createdAt", "updatedAt"]
                        },

                    },

                ],
                raw: false
            }).then(product => {
                resolve({
                    statusCode: 200,
                    data: product
                })
            }).catch(error => {
                resolve({
                    statusCode: 400,
                    message: error.message
                })
            })
        } catch (error) {
            resolve({
                statusCode: 400,
                message: "Server Error"
            })
        }
    })
}

let searchProduct = (category_id, text) => {
    return new Promise(async (resolve, reject) => {
        console.log(text)
        try {
            await db.Product.findAll({
                attributes: {
                    exclude: ["createdAt", "updatedAt"]
                },
                where: {
                    category_id: category_id,

                    name: {
                        [Op.like]: "%" + text + "%",
                    },
                },
                include: {
                    model: db.Category,
                    attributes: {
                        exclude: ["createdAt", "updatedAt"]
                    }
                },
                raw: false
            }).then(product => {
                resolve({
                    statusCode: 200,
                    data: product
                })
            }).catch(error => {
                console.log(error)
                resolve({
                    statusCode: 400,
                    message: error.message
                })
            })
        } catch (error) {

            resolve({
                statusCode: 400,
                message: error.message
            })
        }
    })
}

let getAllProductByCategory = (category_id) => {
    return new Promise(async (resolve, reject) => {
        try {
            await db.Product.findAll({
                attributes: {
                    exclude: ["createdAt", "updatedAt", "category_id"]
                },
                where: {
                    category_id: category_id
                },
                include: {
                    model: db.Category,
                    attributes: {
                        exclude: ["createdAt", "updatedAt"]
                    }
                },
                raw: false
            }).then(product => {
                resolve({
                    statusCode: 200,
                    data: product
                })
            }).catch(error => {
                resolve({
                    statusCode: 400,
                    message: "Server Error"
                })
            })
        } catch (error) {
            resolve({
                statusCode: 400,
                message: "Server Error"
            })
        }
    })
}

let createNewProduct = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.category_id || !data.name || !data.image_origin || !data.price) {
                resolve({
                    statusCode: 400,
                    message: "Missing required parameter!"
                })
            }
            else {
                let [object, created] = await db.Product.findOrCreate({
                    where: {
                        name: data.name
                    },
                    defaults: {
                        category_id: data.category_id,
                        image_origin: data.image_origin,
                        description: data.description,
                        price: data.price,
                    }
                })
                if (!created) {
                    resolve({
                        statusCode: 400,

                        message: "Product already exists"
                    })
                }
                else {
                    resolve({
                        statusCode: 200,

                        message: "Create new product success"
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

let updateProduct = (id, data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!id || !data.category_id || !data.image_origin || !data.price) {
                resolve({
                    message: "Missing required parameter!"
                })
            }
            else {
                let count = await db.Size.update({
                    category_id: data.category_id,
                    image_origin: data.image_origin,
                    description: data.description,
                    price: data.price
                },
                    {
                        where: {
                            id: id,
                            delete_flag: 0
                        }
                    })

                if (count > 0) {
                    resolve({
                        message: "Update success"
                    })
                }
                else {
                    resolve({
                        message: "Update fail"
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
    getAllProduct,
    createNewProduct,
    updateProduct,
    deleteProduct,
    getAllProductByCategory,
    searchProduct

}