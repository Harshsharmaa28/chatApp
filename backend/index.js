import express from "express"
import connectDB from "./db/config.js";
import cors from "cors"
import cookieParser from "cookie-parser"
import dotenv from 'dotenv';
import userRoutes from './routes/user.route.js'
import charRoutes from "./routes/chat.routes.js"
import messageRoutes from "./routes/message.routes.js"
import { Server } from "socket.io";
import { createServer } from "http";


dotenv.config();
const app = express();
// const server = createServer(app);
const server = app.listen(process.env.PORT, () => {
    console.log(`server is Running succesfully on port ${process.env.PORT}`)
})

const io = new Server(server, {
    pingTimeout: 6000,
    cors: {
        origin: "http://localhost:3000",
        credentials: true,
    },
})
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


app.use("/api/v1/users", userRoutes);
app.use("/api/v1/chats", charRoutes);
app.use("/api/v1/messages", messageRoutes)

io.on("connection", (socket) => {
    console.log("User connnected with id :", socket.id)

    socket.on("setup", (userData) => {
        console.log(userData.loggedInUser.name)
        socket.join(userData.loggedInUser._id);
        socket.emit("connected");
    });

    socket.on("join chat", (room) => {
        console.log("join kar liya hai")
        socket.join(room);
        console.log("User joined room :", room);
    })

    socket.on("new message", (newMessageRecieved) => {
        // console.log("server received message:", newMessageRecieved);
        // Broadcast to everyone in the room except the sender
        socket.to(newMessageRecieved.chatId).emit("message received", newMessageRecieved);
        console.log("aage bhej diya hai")
    });


    socket.on("disconnect", () => {
        console.log("User Disconnected", socket.id);
    });
})