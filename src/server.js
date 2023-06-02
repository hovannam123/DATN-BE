import express from 'express'
import * as dotenv from 'dotenv'
import connectDB from './config/connectDB'
import initAPIRoute from './router/routers'
const paypal = require('paypal-rest-sdk');

dotenv.config({
    path: './.env'
})

const app = express()

app.use(express.urlencoded({ extended: true }));
app.use(express.json());



paypal.configure({
    'mode': 'sandbox', //sandbox or live
    'client_id': 'AXMeJ1HaMiTJqoZAXDezOC_NQtXZjYGH55WmJVTvqtrZgkva2xN1NkPQzR8eFyrUWR6TiK9y3YzWLpws',
    'client_secret': 'EDtLfGhK53kOEEbVhTb0kzwcLCwfmRBsgYzTvJ9q3HZ9SgWXL6fGlMWs33hCbKe7RQENxXkGpabYDmok'
});


initAPIRoute(app)

//middleware

// app.use((req, res) => {
//     res.status(404).json({
//         message: 'Not found request'
//     })
// })


connectDB()

const port = process.env.POST

app.listen(port, () => {
    console.log(`server is running: ${port}`)
})