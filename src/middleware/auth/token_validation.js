import jwt from 'jsonwebtoken'
import * as dotenv from 'dotenv'
dotenv.config()


let checkToken = (req, res, next) => {
    let token = req.get("authorization")
    if (token) {
        token = token.slice(7)
        jwt.verify(token, process.env.JWT_KEY, (err, decode) => {
            if (err) {
                return res.json({
                    message: "Invalid token"
                })
            }
            else {
                req.data = decode.data
                // console.log("decodeeeeeeeeeeeeeeee:" + decode.data.role_id)
                next()
            }
        })
    }
    else {
        return res.json({
            message: "Access denied!"
        })
    }
}

let userPermit = (req, res, next) => {
    let role_id = req.data.role_id
    if (role_id === 1 || role_id === 2) {
        next()
    }
    else {
        return res.json({
            message: "Permition denied!"
        })
    }
}

let adminPermit = (req, res, next) => {
    let role_id = req.data.role_id
    if (role_id === 2) {
        next()
    }
    else {
        return res.json({
            message: "Permition denied!"
        })
    }
}


module.exports = {
    checkToken,
    userPermit,
    adminPermit
}