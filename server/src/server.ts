require('dotenv').config()
require('./config/db')

import express, { NextFunction, Request, Response } from "express"
import cors from "cors"
import router from "./routes/index"
const app = express()
const PORT = 3001

app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: true }))

app.use('/api', router)



app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`)
})