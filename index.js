import express from "express"
import dotenv from 'dotenv';

dotenv.config();

const app = express()
const PORT = process.env.PORT

//body parser middleware
app.use(express.json({limit: "10kb"}))
app.use(express.urlencoded({extended: true, limit: "10kb"}))

//404 handler
app.use((req, res) => {
    res.status(404).json({
        status: "error",
        message: "Route not found"
    })
})

app.listen(PORT, () => {
    console.log(`Server is running at ${PORT} in ${process.env.NODE_ENV} mode`)
})