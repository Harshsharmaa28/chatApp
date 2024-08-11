import asyncHandler from "express-async-handler";
import { User } from "../models/user.model.js";
import { Chat } from "../models/chat.model.js";
import { Message } from "../models/message.model.js";

const allMessage = asyncHandler(async (req, res) => {
    try {
        const message = await Message.find({ chat: req.params.chatId })
            .populate("sender", "name pic email")
            .populate("chat");

        res.json(message);
    } catch (error) {
        return res.status(400).json({
            success: false,
            message : error.message
        })
    }
});

const sendMessage = asyncHandler( async(req,res) => {
    const {content, chatId} = req.body;
    
    if(!chatId || !content){
        res.status(400).json({
            success: false,
            message: "Invalid data passed in the request"
        })
    }

    let newMessage = {
        sender: req.user._id,
        content : content,
        chat : chatId,
    };

    try {
        let message = await Message.create(newMessage);
        message = await message.populate("sender","name pic")
        message = await message.populate("chat")
        message = await User.populate(message,{
            path: "chat.users",
            select: "name pic email"
        });
        // console.log(message)
        await Chat.findByIdAndUpdate(req.body.chatId,{ latestMessage : message});

        res.json({
            success : true,
            message,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: "Some error occurs",
            error: error.message
        })
    }
})

export {
    allMessage,
    sendMessage,
}