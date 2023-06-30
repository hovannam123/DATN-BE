import db from "../models"
import { genSaltSync, hashSync, compareSync } from 'bcrypt'
import jwt from 'jsonwebtoken'
import { generateDigitCode, sendMail } from "../service/email_service"
const { Op } = require("sequelize");

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
                    await db.UserInformation.create({
                        user_id: user.id,
                    })
                    sendMail(user.email, code)
                    resolve({
                        statusCode: 200,
                        message: "Create new user success"
                    })
                }
            }
        } catch (e) {
            resolve({
                statusCode: 400,
                message: e.message
            })
        }
    })
}


let getAllUser = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const currentDate = new Date();
            const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
            const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
            await db.User.findAll({
                where: {
                    role_id: 2,

                },
                attributes: {
                    exclude: ['role_id', 'expired_time', 'verify_code', 'createdAt', 'updatedAt'],
                },
                include: [
                    {
                        model: db.UserInformation,

                    },

                    {
                        model: db.Bill,
                        as: 'bill_data',
                        where: {
                            createdAt: {
                                [Op.between]: [startOfMonth, endOfMonth]
                            }
                        },
                        attributes: [
                            [db.sequelize.fn('COUNT', db.sequelize.col('bill_data.id')), 'total_bill'],
                            [db.sequelize.fn('SUM', db.sequelize.col('bill_data.total_payment')), 'total_payment'],
                        ]


                    },
                ],

                group: ['User.id'],
                order: [[db.sequelize.literal('COUNT(`bill_data`.`id`)'), 'DESC']],
                // order: db.sequelize.literal('counts DESC'),
                raw: false
            }).then(data => {
                resolve({
                    statusCode: 200,
                    data: data
                })
            }).catch(err => {
                console.log(err)

                resolve({
                    statusCode: 400,
                    error: err.message
                })
            })
        } catch (err) {
            resolve({
                statusCode: 400,
                error: err.message
            })
        }
    })
}


let getDetailUser = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!id) {
                resolve({
                    statusCode: 400,
                    message: "Missing required parameter!"
                })
            } else {
                await db.User.findOne({
                    where: {
                        id: id
                    },
                    attributes: {
                        exclude: ["expired_time", "verify_code", "createdAt", "updatedAt"]
                    },
                    include: [
                        {
                            model: db.UserInformation,
                            attributes: {
                                exclude: ["createdAt", "updatedAt"]
                            },
                        }

                    ],
                    raw: false
                }).then(data => {
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


let updateUserInformation = (data, user_id) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!user_id) {
                resolve({
                    statusCode: 400,
                    message: "Missing required parameter!"
                })
            } else {
                await db.UserInformation.update(

                    {
                        first_name: data.first_name,
                        last_name: data.last_name,
                        gender: data.gender,
                        birthday: data.birthday,
                        user_image: data.user_image
                    },
                    { where: { user_id: user_id } }
                ).then((_) => {
                    resolve({
                        statusCode: 200,
                        message: "Update success"
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
                statusCode: 200,
                message: err.message
            })
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
            resolve(
                {
                    statusCode: 200,

                    message: e.message
                })
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
            console.log(data.email)
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
                    await db.User.update({ expired_time: new Date() }, { where: { id: user.id } })
                    sendMail(user.email, user.verify_code)
                    resolve({
                        statusCode: 200,
                        message: "Send verify code to your email success"
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
    updateUserInformation,
}
