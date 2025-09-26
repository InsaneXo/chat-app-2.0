import express, {Request, Response} from "express"

const app = express()
const PORT = 3001

app.get('/', (req:Request, res:Response)=>{
    res.status(200).json({message: "Server is running successful"})
})

app.listen(PORT, ()=>{
    console.log(`Server running at http://localhost:${PORT}`)
})