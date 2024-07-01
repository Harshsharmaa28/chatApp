import asyncHandler from 'express-async-handler'
import jwt from 'jsonwebtoken'
import { User } from '../models/user.model.js'
import dotenv from 'dotenv';
dotenv.config();

export const verifyJWT = asyncHandler( async(req,res,next) => {
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")

        if(!token){
            throw new Error("Please logIn First");
        }

        const decodeToken = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)

        const user = await User.findById(decodeToken?._id).select("-password")

        if(!user){
            throw new Error("Invalid Access Token")
        }

        req.user = user;
        next()
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: "Please login First"
        })
    }
})