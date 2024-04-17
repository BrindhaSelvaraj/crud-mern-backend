require('dotenv').config()

const mongoose = require('mongoose')
const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const router = require('./routes')

//using cors for the cross origin
//using cookieparser to store tokens in user's cookie section

const app = express()

mongoose.connect(process.env.MONGO)
.then(() => {
    console.log('Database Connected')
    app.use(express.json())
    app.use(cors({
        origin: 'http://localhost:3000',
        methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
        credentials: true
    }));
    app.use(cookieParser())
    app.use('/api', router)
    app.listen(5000, () => console.log('server is running on port 5000'))

})
.catch((err) => console.error(err) )