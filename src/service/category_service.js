import db from "../models"

let createNewCategory = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.name) {
                resolve({ message: "Missing required parameter!" })
            }
            else {
                let [object, created] = await db.Category.findOrCreate({
                    where: {
                        name: data.name
                    }
                })
                if (!created) {
                    resolve({ message: "Category already exists" })
                }
                else {
                    resolve({ message: "Create new category success" })
                }
            }
        } catch (error) {
            reject({
                error: error
            })
        }
    })
}


let getAllCategory = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let categories = await db.Category.findAll({
                attributes: {
                    exclude: ["createdAt", "updatedAt"]
                },
            })
            if (!categories) {
                resolve({
                    message: "Empty category"
                })
            }
            else {
                resolve({
                    data: categories
                })
            }
        } catch (e) {
            reject(e)
        }
    })
}




module.exports = {
    getAllCategory,
    createNewCategory
}