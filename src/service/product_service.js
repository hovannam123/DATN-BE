
import db from "../models"


let getAllProduct = () => {
    return new Promise(async (resolve, reject) => {
        try {
            await db.Product.findAll({
                attributes: {
                    exclude: ["createdAt", "updatedAt"]
                },
                include: {
                    model: db.Category,
                    attributes: {
                        exclude: ["createdAt", "updatedAt"]
                    }
                },
                raw: true,
                nest: true
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
                    resolve({ message: "Product already exists" })
                }
                else {
                    resolve({ message: "Create new product success" })
                }
            }
        } catch (error) {
            reject({ error: error })
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
    deleteProduct
}