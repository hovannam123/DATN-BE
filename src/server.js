import express from 'express'
import * as dotenv from 'dotenv'
import connectDB from './config/connectDB'
import initAPIRoute from './route/api.js'

dotenv.config({
    path: './.env'
})

const app = express()

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const post = process.env.POST

initAPIRoute(app)

//middleware

// app.use((req, res) => {
//     res.status(404).json({
//         message: 'Not found request'
//     })
// })


connectDB()

app.listen(post, () => {
    console.log(`server is running: ${post}`)
})