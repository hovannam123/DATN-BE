import db from "../models"


let createNewSize = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.size_name || !data.weigh || !data.height) {
                resolve({
                    statusCode: 400,

                    message: "Missing required parameter!"
                })
            }
            else {
                let [object, created] = await db.Size.findOrCreate({
                    where: {
                        size_name: data.size_name
                    },
                    defaults: {
                        weigh: data.weigh,
                        height: data.height
                    }
                })
                if (!created) {
                    resolve({
                        statusCode: 400,
                        message: "Size already exists"
                    })
                }
                else {
                    resolve({
                        statusCode: 200,

                        message: "Create new size success"
                    })
                }
            }
        } catch (e) {
            reject({ error: e })
        }
    })
}

let getAllSize = () => {
    return new Promise(async (resolve, reject) => {
        try {
            await db.Size.findAll(
                {
                    attributes: {
                        exclude: ["createdAt", "updatedAt"]
                    },
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
        } catch (e) {
            resolve({
                statusCode: 400,
                message: err.message
            })
        }
    })
}

let deleteSize = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!id) {
                resolve({
                    statusCode: 400,
                    message: "Invalid id"
                })
            }
            else {
                await db.Size.destroy(
                    {
                        where: {
                            id: id
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

let updateSize = (id, data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!id || !data.weigh || !data.height) {
                resolve({
                    statusCode: 400,
                    message: "Missing required parameter!"
                })
            }
            else {
                await db.Size.update({
                    weigh: data.weigh,
                    height: data.height
                },
                    {
                        where: {
                            id: id,
                        }
                    }
                ).then((_) => {
                    resolve({
                        statusCode: 200,
                        message: "Update success"
                    })
                }).catch(error => {
                    resolve({
                        statusCode: 400,
                        message: error.message
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
    createNewSize,
    getAllSize,
    updateSize,
    deleteSize
}
