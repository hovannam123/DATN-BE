import { raw } from "body-parser"
import db from "../models"
const { Op } = require("sequelize");


let createNewFavourite = (data, user_id) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!user_id || !data.product_id) {
                resolve({
                    statusCode: 400,
                    message: "Missing required parameter!"
                })
            }
            else {
                let [object, created] = await db.ProductFavourite.findOrCreate({
                    where: {
                        user_id: user_id,
                        product_id: data.product_id

                    },
                })
                if (!created) {
                    resolve({
                        statusCode: 400,
                        message: "Product already exists in your favourite"
                    })
                }
                else {
                    resolve({
                        statusCode: 200,
                        message: "Add product favourite success"
                    })
                }
            }
        } catch (err) {
            resolve({
                statusCode: 400,
                message: err
            })
        }
    })
}

let getAllProductFavourite = (user_id) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!user_id) {
                resolve({
                    statusCode: 400,
                    message: "Missing required parameter!"
                })
            }
            else {
                await db.ProductFavourite.findAll(
                    {
                        where: {
                            user_id: user_id
                        },
                        attributes: {
                            exclude: ["createdAt", "updatedAt", "product_id"]
                        },
                        include: [
                            {
                                model: db.Product,
                                attributes: {
                                    exclude: ["updatedAt", "createdAt", "delete_flag"]
                                },
                            },

                        ],
                        raw: false
                    }
                ).then(data => {
                    resolve({
                        statusCode: 200,
                        data: data
                    })
                }).catch(err => {
                    resolve({
                        statusCode: 400,
                        message: err.message
                    })
                })
            }
        } catch (err) {
            resolve({
                statusCode: 400,
                message: err.message
            })
        }
    })
}

let deleteProductFavourite = (data, user_id) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.product_id || !user_id) {
                resolve({
                    statusCode: 400,
                    message: "Missing required parameter!"
                })
            }
            else {
                await db.ProductFavourite.destroy(
                    {
                        where: {
                            user_id: user_id,
                            product_id: data.product_id
                        }
                    }).then(
                        resolve({
                            statusCode: 200,
                            message: "Delete success"
                        })
                    ).catch(err => {
                        resolve({
                            statusCode: 400,
                            message: "Delete fail"
                        })
                    })
            }
        } catch (error) {
            reject({
                statusCode: 400,
                error: error.message
            })
        }
    })
}

let getTopProductFavourite = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const currentDate = new Date();
            const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
            const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);


            const topProductFavourite = await db.ProductFavourite.findAll({

                attributes: [
                    [db.sequelize.fn('COUNT', db.sequelize.col('ProductFavourite.id')), 'total_favourite']
                ],
                group: ['product_id'],
                order: db.sequelize.literal('total_favourite DESC'),
                limit: 10,
                include: [
                    {
                        model: db.Product,

                    },

                ],
                raw: false,
            });
            console.log('topProductFavourite')
            console.log(topProductFavourite)
            resolve({
                statusCode: 200,
                data: topProductFavourite
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
    createNewFavourite,
    getAllProductFavourite,
    deleteProductFavourite,
    getTopProductFavourite
}