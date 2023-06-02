
import UserService from "../service/user_service"

import EmailService from "../service/email_service"


let getAllUser = async (req, res) => {
    let data = await UserService.getAllUser()
    return res.status(200).json(data)
}

let createNewUser = async (req, res) => {
    let message = await UserService.createNewUser(req.body)
    if (message.statusCode == 200) {
        res.status(200).json(message);
    } else {
        res.status(400).json(message);
    }
}

let getDetailUser = async (req, res) => {
    let infor = await UserService.getDetailUser(req.query.id)
    return res.status(200).json(infor)
}
let login = async (req, res) => {
    let result = await UserService.login(req.body)
    if (result.statusCode == 200) {
        res.status(200).json(result);
    } else {
        res.status(400).json(result);
    }
}

let verify = async (req, res) => {
    let result = await UserService.verify(req.body)
    if (result.statusCode == 200) {
        res.status(200).json(result);
    } else {
        res.status(400).json(result);
    }
}

let forgetPassword = async (req, res) => {
    let result = await UserService.forgetPassword(req.body)
    if (result.statusCode == 200) {
        res.status(200).json(result);
    } else {
        res.status(400).json(result);
    }
}

let resetPassword = async (req, res) => {
    let result = await UserService.resetPassword(req.body)
    if (result.statusCode == 200) {
        res.status(200).json(result);
    } else {
        res.status(400).json(result);
    }
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