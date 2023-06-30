import { where } from "sequelize"
import db from "../models"
import user from "../models/user"


let createNewVoucherUser = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.voucher_id || !data.user_id) {
                resolve({ statusCode: 400, message: "Missing required parameter!" })
            }
            else {
                let [object, created] = await db.VoucherUser.findOrCreate({
                    where: {
                        voucher_id: data.voucher_id,
                        user_id: data.user_id,
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
            resolve({ statusCode: 400, message: e.message })
        }
    })
}


let deleteVoucherUser = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.user_id || !data.voucher_id) {
                resolve({
                    statusCode: 400,
                    message: "Invalid voucher id"
                })
            }
            else {
                await db.VoucherUser.destroy({
                    where: {
                        user_id: data.user_id,
                        voucher_id: data.voucher_id
                    },
                }).then(row => {
                    if (row) {
                        resolve({
                            statusCode: 200,
                            message: 'Delete success'
                        })
                    }
                    else {
                        resolve({
                            statusCode: 400,
                            message: 'Delete fail'
                        })
                    }
                })
            }
        } catch (error) {
            console.log(error)
            resolve({
                statusCode: 400,
                message: "Server error"
            })
        }
    })
}



// let updateVoucher = (voucher_id, data) => {
//     return new Promise(async (resolve, reject) => {
//         try {
//             if (!voucher_id || !data.value_percent || !data.start_at || !data.end_at) {
//                 resolve({
//                     statusCode: 400,
//                     message: "Missing required parameter!"
//                 })
//             }
//             else {
//                 let count = await db.Voucher.update({
//                     value_percent: data.value_percent,
//                     start_at: data.start_at,
//                     end_at: data.end_at
//                 },
//                     {
//                         where: {
//                             id: voucher_id
//                         }
//                     })

//                 if (count > 0) {
//                     resolve({
//                         statusCode: 200,
//                         message: "Update success"
//                     })
//                 }
//                 else {
//                     resolve({
//                         statusCode: 400,
//                         message: "Update fail"
//                     })
//                 }
//             }
//         } catch (error) {
//             reject({
//                 error: error
//             })
//         }
//     })
// }

module.exports = {
    createNewVoucherUser,
    deleteVoucherUser
}
