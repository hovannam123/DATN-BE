import { json } from "body-parser"
import UserService from "../service/user_service"
import db from "../models"


let getAllUser = async (req, res) => {
    let data = await UserService.getAllUser()
    return res.status(200).json({
        users: data
    })
}

let createNewUser = async (req, res) => {
    let message = await UserService.createNewUser(req.body)
    console.log(message)
    return res.status(200).json({
        message: message
    })
}

let getDetailUser = async (req, res) => {
    try {
        let infor = await UserService.getDetailUser(req.query.id)
        console.log("----------------")
        console.log(infor)
        return res.status(200).json(infor)
    } catch (e) {
        return res.status(500).json(
            {
                message: e
            }
        )
    }
}
let login = async (req, res) => {
    let message = await UserService.login(req.body)
    return res.status(200).json(message)
}

module.exports = {
    getAllUser,
    createNewUser,
    getDetailUser,
    login
}