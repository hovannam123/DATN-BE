import express from "express";
import UserController from "../controller/user_controller.js"
import SizeController from "../controller/size_controller.js"
import { checkToken, userPermit, adminPermit } from "../auth/token_validation"


let router = express.Router()

let initApiRoutes = (app) => {

    //user, admin
    router.get('/all-user', checkToken, userPermit, UserController.getAllUser)
    router.post('/create-user', checkToken, userPermit, UserController.createNewUser)
    router.post('/login', checkToken, userPermit, UserController.login)
    router.get('/all-size', checkToken, userPermit, SizeController.getAllSize)


    //admin
    router.post('/create-size', checkToken, adminPermit, SizeController.createNewSize)
    router.get('/get-detail-user', checkToken, adminPermit, UserController.getDetailUser)



    return app.use('/api/v1', router)
}

module.exports = initApiRoutes