import db from "../models"
import { genSaltSync, hashSync, compareSync } from 'bcrypt'
import jwt from 'jsonwebtoken'
import { generateDigitCode, sendMail } from "../service/email_service"
import { raw } from "body-parser"

let createNewUser = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.email || !data.password) {
                resolve({
                    statusCode: 400,
                    message: "Missing required parameter!"
                })
            }
            else {
                let salt = genSaltSync(10)
                let password = hashSync(data.password, salt)
                const code = generateDigitCode()
                console.log("aaa")
                const [user, created] = await db.User.findOrCreate({
                    where: {
                        email: data.email
                    },
                    defaults: {
                        password: password,
                        phone_number: data.phone_number,
                        verify_code: code
                    }
                }).catch((error) => {
                    resolve({
                        statusCode: 400,
                        message: error
                    })
                }
                )
                if (!created) {
                    resolve({
                        statusCode: 400,
                        message: "Email already exists"
                    })
                }
                else {
                    sendMail(user.email, code)
                    resolve({
                        statusCode: 200,
                        message: "Create new user success"
                    })
                }
            }
        } catch (e) {
            reject({ error: e })
        }
    })
}


let getAllUser = () => {
    return new Promise(async (resolve, reject) => {
        try {
            await db.User.findAll({
                where: {
                    role_id: 1
                },
                attributes: {
                    exclude: ["role_id", "verify_code", "expired_time"]
                },

                raw: false
            }).then(data => {
                resolve({ data: data })
            }).catch(err => {
                reject({ error: err })
            })
        } catch (err) {
            reject({ error: err })
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
                await db.User.findOne({
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
                }).then(data => {
                    resolve({ data: data })
                }).catch(err => {
                    reject({ error: err })
                })
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
                    statusCode: 400,
                    message: "Missing required parameter!"
                })
            }
            else {
                let user = await db.User.findOne({
                    where: {
                        email: data.email
                    },
                    raw: false
                })
                console.log(user)
                if (!user) {
                    resolve({
                        statusCode: 400,
                        message: "Your email invalid!"
                    })
                }
                else {
                    let resultCompare = compareSync(data.password, user.password)
                    if (!resultCompare) {
                        resolve({
                            statusCode: 400,
                            message: "Your email/password incorrect"
                        })
                    }
                    else {
                        let token = jwt.sign({ data: user }, process.env.JWT_KEY, { expiresIn: "1h" })
                        resolve({
                            statusCode: 200,
                            token: token,
                            user: user
                        })
                    }
                }
            }
        } catch (e) {
            reject(e)
        }
    })
}

let verify = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.code) {
                resolve({
                    statusCode: 400,
                    message: "Missing required parameter!"
                })
            } else {
                await db.User.findOne({
                    where: {
                        email: data.email
                    }
                }).then(async user => {

                    const currentTime = new Date();

                    if ((currentTime.getTime() - user.expired_time.getTime()) / (1000 * 60) < 5) {
                        if (user.verify_code == data.code) {
                            await db.User.update(
                                {
                                    active: true
                                },
                                {
                                    where: {
                                        id: user.id
                                    },
                                })
                            resolve({
                                statusCode: 200,
                                message: "Verify success!"
                            })
                        }
                        else {
                            resolve({
                                statusCode: 400,
                                message: "The code is not correct"
                            })
                        }

                    }
                    else (
                        resolve({
                            statusCode: 400,
                            message: "Expiration time"
                        })
                    )
                }).catch(error => {
                    resolve({
                        statusCode: 400,
                        error: "No find email"
                    })
                })
            }
        } catch (error) {
            reject({
                error: error
            })
        }
    })
}

let forgetPassword = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.email) {
                resolve({
                    statusCode: 400,
                    message: "Missing required parameter!"
                })
            }
            else {
                await db.User.findOne({
                    where: {
                        email: data.email
                    }
                }).then(async user => {
                    await user.update({ expired_time: new Date() })
                    sendMail(user.email, user.verify_code)
                    resolve({
                        statusCode: 200,
                        message: "Send verify code to your email success"
                    })
                }).catch(error => {
                    resolve({
                        statusCode: 400,
                        message: "No find your email"
                    })
                })
            }
        } catch (error) {
            resolve({
                statusCode: 400,

                message: error
            })
        }
    })
}


let resetPassword = (data) => {
    return new Promise(async (resovle, reject) => {
        try {
            await db.User.findOne({
                where: {
                    email: data.email,
                }
            }).then(async user => {
                let salt = genSaltSync(10)
                let password = hashSync(data.password, salt)
                await user.update(
                    {
                        password: password
                    }
                )
                resovle({
                    statusCode: 200,
                    message: "Reset password success"
                })
            }).catch(error => {
                resovle({
                    statusCode: 400,
                    message: "Error from server"
                })
            })
        } catch (error) {
            resovle({
                statusCode: 400,
                message: "Error from server"

            })
        }
    })
}

module.exports = {
    getAllUser,
    createNewUser,
    getDetailUser,
    login,
    verify,
    forgetPassword,
    resetPassword,
}
