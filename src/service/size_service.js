import db from "../models"


let createNewSize = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.size_name || !data.weigh || !data.height) {
                resolve({ message: "Missing required parameter!" })
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
                    resolve({ message: "Size already exists" })
                }
                else {
                    resolve({ message: "Create new size success" })
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
            db.Size.findAll(
                {
                    attributes: {
                        exclude: ["createdAt", "updatedAt"]
                    },
                }
            ).then(data => {
                resolve({
                    sizes: data
                })
            }).catch(err => {
                reject({ error: err })
            })
        } catch (e) {
            reject(e)
        }
    })
}

let deleteSize = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!id) {
                resolve({
                    message: "Invalid id"
                })
            }
            else {
                let count = await db.Size.update({
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

let updateSize = (id, data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!id || !data.size_name || !data.weigh || !data.height) {
                resolve({
                    message: "Missing required parameter!"
                })
            }
            else {
                let count = await db.Size.update({
                    size_name: data.size_name,
                    weigh: data.weigh,
                    height: data.height
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
    createNewSize,
    getAllSize,
    updateSize,
    deleteSize
}
