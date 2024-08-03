import express from "express"
import connectDB from "./db/config.js";
import cors from "cors"
import cookieParser from "cookie-parser"
import dotenv from 'dotenv';
dotenv.config();
import userRoutes from './routes/user.route.js'
import charRoutes from "./routes/chat.routes.js"
import messageRoutes from "./routes/message.routes.js"



const app = express();
app.use(express.json());
app.use(cors({
    // origin: process.env.CORS_ORIGIN,
    origin: 'http://localhost:3000',
    credentials: true
}))

app.use(cookieParser())
connectDB();

// app.use('/', (req, res) => {
//     res.send('Hello, Server is Running');
// });

app.listen(process.env.PORT, () => {
    console.log(`server is Running succesfully on port ${process.env.PORT}`)
})

app.use("/api/v1/users", userRoutes);
app.use("/api/v1/chats",charRoutes);
app.use("/api/v1/messages",messageRoutes)