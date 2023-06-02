// import db from "../src/models"

// let checkCodeVerify = async (req, res, next) => {
//     let code = req.body.code
//     let email = req.body.email
//     if (code) {
//         await db.User.findOne({
//             where: {
//                 email: email
//             }
//         }).then(user => {
//             if (user.verify_code == code) {
//                 next()
//             }
//             else {
//                 return res.json({
//                     message: "Code is not correct"
//                 })
//             }
//         })
//     }
//     else {
//         return res.json({
//             message: "Missing parameter!"
//         })
//     }
// }

// module.exports = {
//     checkCodeVerify
// }
"use strict";