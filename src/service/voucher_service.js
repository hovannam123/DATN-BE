import { where } from "sequelize"
import db from "../models"
import user from "../models/user"


let createNewVoucher = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.value_percent || !data.start_at || !data.end_at) {
                resolve({ statusCode: 400, message: "Missing required parameter!" })
            }
            else {
                let [object, created] = await db.Voucher.findOrCreate({
                    where: {
                        value_percent: data.value_percent,
                        start_at: data.start_at,
                        end_at: data.end_at,
                    }
                })
                if (!created) {

                    resolve({ statusCode: 200, message: "Voucher already exists" })
                }
                else {
                    resolve({ statusCode: 200, message: "Create new vouhcer success" })
                }
            }
        } catch (e) {
            console.log(e)
            resolve({ statusCode: 400, message: e.message })
        }
    })
}

let getAllVoucher = () => {
    return new Promise(async (resolve, reject) => {
        try {
            await db.Voucher.findAll(
                {
                    attributes: {
                        exclude: ["createdAt", "updatedAt"]
                    },
                }
            ).then(voucher => {
                resolve({
                    statusCode: 200,
                    data: voucher
                })
            }).catch(err => {
                resolve({
                    statusCode: 400,
                    message: "Server error"
                })
            })
        } catch (e) {
            resolve({
                statusCode: 400,
                message: "Server error"
            })
        }
    })
}

let getAllVoucherUser = (user_id) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!user_id) {
                resolve({
                    statusCode: 400,
                    message: "Missing user id"
                })
            }
            else {
                await db.VoucherUser.findAll(
                    {
                        where: {
                            user_id: user_id
                        },
                        attributes: {
                            exclude: ["createdAt", "updatedAt"]
                        },
                        include: {
                            model: db.Voucher
                        },
                        raw: false
                    },

                ).then(voucher => {
                    resolve({
                        statusCode: 200,
                        data: voucher
                    })
                }).catch(err => {
                    resolve({
                        statusCode: 400,
                        message: err.message
                    })
                })
            }
        } catch (e) {
            resolve({
                statusCode: 400,
                message: "Server error"
            })
        }
    })
}


let deleteVoucher = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.voucher_id) {
                resolve({
                    statusCode: 400,
                    message: "Invalid voucher id"
                })
            }
            else {
                await db.VoucherUser.destroy({
                    where: {
                        voucher_id: data.voucher_id
                    },
                }).then(async (_) => {
                    await db.Voucher.destroy({
                        where: {
                            id: data.voucher_id
                        },
                    })
                    resolve({
                        statusCode: 200,
                        message: 'Delete success'
                    })
                }).catch((error) => {
                    resolve({
                        statusCode: 400,
                        message: error.message
                    })
                })
            }
        } catch (error) {
            console.log(error)
            resolve({
                statusCode: 400,
                message: error.message
            })
        }
    })
}

let updateVoucher = (voucher_id, data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!voucher_id || !data.value_percent || !data.start_at || !data.end_at) {
                resolve({
                    statusCode: 400,
                    message: "Missing required parameter!"
                })
            }
            else {
                let count = await db.Voucher.update({
                    value_percent: data.value_percent,
                    start_at: data.start_at,
                    end_at: data.end_at
                },
                    {
                        where: {
                            id: voucher_id
                        }
                    })

                if (count > 0) {
                    resolve({
                        statusCode: 200,
                        message: "Update success"
                    })
                }
                else {
                    resolve({
                        statusCode: 400,
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
    createNewVoucher,
    getAllVoucher,
    updateVoucher,
    deleteVoucher,
    getAllVoucherUser
}
