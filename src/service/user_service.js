import db from "../models"
import { genSaltSync, hashSync, compareSync } from 'bcrypt'
import jwt from 'jsonwebtoken'

let createNewUser = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.email) {
                resolve("Missing param")
            }
            else {
                let salt = genSaltSync(10)
                let password = hashSync(data.password, salt)
                const [object, created] = await db.User.findOrCreate({
                    where: {
                        email: data.email
                    },
                    defaults: {
                        password: password,
                        phone_number: data.phone_number,
                        role_id: data.role_id
                    }
                })
                if (!created) {
                    resolve("Email already exists")
                }
                else {
                    resolve("Create new user success")
                }
            }
        } catch (e) {
            reject(e)
        }
    })
}


let getAllUser = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let data = db.User.findAll({
                attributes: {
                    exclude: ["role_id"]
                },
                include: {
                    model: db.Role,
                    attributes: {
                        exclude: ["createdAt", "updatedAt"]
                    }
                },
                raw: true,
                nest: true
            })
            resolve(data)
        } catch (err) {
            reject(err)
        }
    })
}

let getDetailUser = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!id) {
                resolve({
                    message: "Missing required parameter!"
                })
            } else {
                let data = await db.User.findOne({
                    subQuery: false,
                    where: {
                        id: id
                    },
                    attributes: ["email", "password", "phone_number", "role_id"],
                    include: [
                        {
                            model: db.Role,
                        }
                    ],
                })
                resolve({ user: data })
            }
        } catch (err) {
            reject(err)
        }
    })
}

let login = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.email || !data.password) {
                resolve({
                    message: "Missing required parameter!"
                })
            }
            else {
                let user = await db.User.findOne({
                    where: {
                        email: data.email
                    }
                })
                if (!user) {
                    resolve({
                        message: "Your email invalid!"
                    })
                }
                else {
                    let resultCompare = compareSync(data.password, user.password)
                    if (!resultCompare) {
                        resolve({
                            message: "Your email/password incorrect"
                        })
                    }
                    else {
                        let token = jwt.sign({ data: user }, process.env.JWT_KEY, { expiresIn: "1h" })
                        resolve({
                            message: "Login success!",
                            token: token,
                        })
                    }
                }
            }
        } catch (e) {
            reject(e)
        }
    })
}

module.exports = {
    getAllUser,
    createNewUser,
    getDetailUser,
    login
}
