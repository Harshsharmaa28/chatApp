import express from "express"
import connectDB from "./db/config.js";
import cors from "cors"
import cookieParser from "cookie-parser"
import dotenv from 'dotenv';
dotenv.config();
import userRouter from './routes/user.route.js'



const app = express();
app.use(express.json());
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))
app.use(cookieParser())
connectDB();

// app.use('/', (req, res) => {
//     res.send('<h1>Hello, Server is Running</h1>');
// });

app.listen(process.env.PORT, () => {
    console.log(`server is Running succesfully on port ${process.env.PORT}`)
})

app.use("/api/v1/users", userRouter)