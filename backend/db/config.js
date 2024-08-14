import mongoose from "mongoose";
import dotenv from 'dotenv';
import { URL } from "url";
dotenv.config();

const connectDB = async () => {
    // const db_URL = new URL(process.env.MONGODB_URI)
    // console.log(db_URL)
    try {
        const connectionInstance = await mongoose.connect(process.env.MONGODB_URI)
        console.log("Databse connected SucessFully")
    } catch (error) {
        console.log("MONGODB connection FAILED ", error);
        process.exit(1)
    }
}

export default connectDB