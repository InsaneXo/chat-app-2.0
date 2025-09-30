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


app.use(
    (error: any, req: Request, res: Response, next: NextFunction) => {
        console.error("errorHandler", {
            query: req.query,
            params: req.params,
            body: req.body,
            route: (req as any)._parsedUrl?.pathname,
            method: req.method,
        }, error);

        return res.status(500).send(error?.message || "Internal Server Error");
    }
);

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`)
})