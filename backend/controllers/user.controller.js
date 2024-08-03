import { compareSync } from "bcrypt";
import { User } from "../models/user.model.js";
import asyncHandler from 'express-async-handler'



const getAllUser = asyncHandler(async (req, res) => {
    const keyword = req.query.search
        ? {
            $or: [
                { name: { $regex: req.query.search, $options: "i" } },
                { email: { $regex: req.query.search, $options: "i" } },
            ],
        }
        : {} 

        // console.log(keyword)
    const users = await User.find(keyword).find({ _id: { $ne: req.user._id } });
    return res.status(200).json({
        success: true,
        users
    })
})

const registerUSer = asyncHandler(async (req, res) => {
    const { name, email, password, avatar } = req.body;
    if (!name || !email || !password) {
        return res.status(400).json({
            message: "All fields are required"
        })
        // console.log("All the field are required");
    }

    const exsistedUser = await User.findOne({ email });

    if (exsistedUser) {
        return res.status(400).json({
            success: false,
            message: "User Already Exsist"
        })
    }

    const user = await User.create({
        name,
        email,
        password,
        avatar,
    })

    // const createdUser = await User.findById(User._id).select("-password")

    // if (!createdUser) {
    //     res.status(500)
    //     throw new Error("Something went Wrong try again later")
    // }

    return res.status(201).json({
        success: true,
        user,
    })

})

const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body

    if (!email || !password) {
        res.status(400).json({
            message: "All fields are required"
        })
    }
    const user = await User.findOne({ email });

    if (!user) {
        res.status(400).json({
            message: "User not Exsist"
        })
    }

    const isPasswordValid = await user.isPasswordCorrect(password);
    

    if (!isPasswordValid) {
        res.status(400).json({
            success: false,
            message: "Password is not correct"
        })
    }

    const accessToken = await user.generateAccessToken();

    const loggedInUser = await User.findById(user._id).select("-password");

    const options = {
        httpOnly: true,
        secure: true,
    }

    return res
        .status(200)
        .cookie("accessToken", accessToken,options)
        .json({
            success: true,
            message: "User logged In successfully",
            loggedInUser,
            accessToken,
        })
})


const logoutUser = asyncHandler(async (_,res) => {

    const options = {
        httpOnly: true,
        secure: true,
    }

    res.status(200)
        .clearCookie("accessToken", options)
        .json({
            success: true,
            message: "user logged Out Succesfully"
        })
})

export {
    getAllUser,
    registerUSer,
    loginUser,
    logoutUser,
}