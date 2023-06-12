import db from "../models"


let createNewComment = (data, user_id, product_id) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.content || !user_id || !product_id) {

                resolve({
                    statusCode: 400,
                    message: "Missing required parameter!"
                })
            }
            else {
                await db.ReviewProduct.create(
                    {
                        user_id: user_id,
                        product_id: product_id,
                        content: data.content
                    }
                ).then((_) => {
                    resolve({
                        statusCode: 200,
                        message: "Create new comment"
                    })
                }).catch(err => {
                    resolve({
                        statusCode: 400,
                        message: err.message
                    })
                })
            }
        } catch (e) {
            reject({ error: e })
        }
    })
}

let getAllComment = (product_id) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!product_id) {
                resolve({
                    statusCode: 400,
                    message: "Missing required parameter!"
                })
            }
            else {
                await db.ReviewProduct.findAll(
                    {
                        where: {
                            product_id: product_id
                        },
                        attributes: {
                            exclude: ["user_id", "updatedAt"]
                        },
                        include: [
                            {
                                model: db.User,
                                attributes: {
                                    exclude: ["createdAt", "updatedAt", "active", "expired_time", "verify_code"]
                                },
                                include: {
                                    model: db.UserInformation,
                                    attributes: {
                                        exclude: ["createdAt", "updatedAt"]
                                    },
                                }
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
                        error: err.message
                    })
                })
            }
        } catch (err) {
            resolve({
                statusCode: 400,
                error: err.message
            })
        }
    })
}

module.exports = {
    createNewComment,
    getAllComment
}
