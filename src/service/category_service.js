import db from "../models"

let createNewCategory = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.name) {
                resolve({
                    statusCode: 400,
                    message: "Missing required parameter!"
                })
            }
            else {
                let [object, created] = await db.Category.findOrCreate({
                    where: {
                        name: data.name
                    }
                })
                if (!created) {
                    resolve({
                        statusCode: 400,

                        message: "Category already exists"
                    })
                }
                else {
                    resolve({
                        statusCode: 200,

                        message: "Create new category success"
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


let getAllCategory = () => {
    return new Promise(async (resolve, reject) => {
        try {
            await db.Category.findAll({
                attributes: {
                    exclude: ["createdAt", "updatedAt"]
                },
                raw: false
            }).then((data) => {
                resolve({
                    statusCode: 200,
                    data: data
                })
            }).catch((error) => {
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




module.exports = {
    getAllCategory,
    createNewCategory
}