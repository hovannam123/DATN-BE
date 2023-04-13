import db from "../models"


let createNewSize = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.size_name || !data.weigh || !data.height) {
                resolve("Missing required parameter!")
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
                    resolve("Size already exists")
                }
                else {
                    resolve("Create new size success")
                }
            }
        } catch (e) {
            reject(e)
        }
    })
}

let getAllSize = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let sizes = await db.Size.findAll()
            if (!sizes) {
                resolve({
                    message: "Khong ton tai size"
                })
            }
            else {
                resolve({
                    sizes
                })
            }
        } catch (e) {
            reject(e)
        }
    })
}



module.exports = {
    createNewSize,
    getAllSize
}
