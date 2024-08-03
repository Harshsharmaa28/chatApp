import asyncHandler from 'express-async-handler'
import { Chat } from "../models/chat.model.js";
import { User } from "../models/user.model.js";

const accessChat = asyncHandler(async (req, res) => {
    const { userId } = req.body;

    if (!userId) {
        return res.status(400).json({
            sucess: false,
            message: "Please Login First"
        })
    }

    let isChat = await Chat.find({
        isGroupChat: false,
        $and: [
            { users: { $elemMatch: { $eq: req.user._id } } },
            { users: { $elemMatch: { $eq: userId } } },
        ],
    })
        .populate("users", "-password")
        .populate("latestMessage");

    isChat = await User.populate(isChat, {
        path: "latestMessage.sender",
        select: "name pic email",
    })

    if (isChat.length > 0) {
        res.send(isChat[0]);
    }
    else {
        let chatData = {
            chatName: "Sender",
            isGroupChat: false,
            users: [req.user._id, userId],
        }

        try {
            const createdChat = await Chat.create(chatData);
            const fullChat = await Chat.findOne({ _id: createdChat._id }).populate(
                "users",
                "-password"
            );
            res.status(200).json({
                sucess: true,
                message: " Chat created Succesfully",
                fullChat
            })
        } catch (error) {
            res.status(400).json({
                sucess: false,
                message: "Chat can be Created Please Try again later !"
            })
        }
    }
})

const fetchchats = asyncHandler(async (req, res) => {
    try {
        const results = await Chat.find({ users: { $elemMatch: { $eq: req.user._id } } })
            .populate("users", "-password")
            .populate("groupAdmin", "-password")
            .populate("latestMessage")
            .sort({ updatedAt: -1 });

        const populatedResults = await User.populate(results, {
            path: "latestMessage.sender",
            select: "name pic email",
        });

        res.status(200).send(populatedResults);
    } catch (error) {
        res.status(400).json({
            success: false,
            message: "Some error occurred. Please try again later.",
            error: error.message
        });
    }
});


const createdGroupChat = asyncHandler(async (req, res) => {
    console.log(req.body.name)
    if (!req.body.users || !req.body.name) {
        return res.status(400).send({ message: "Please Fill all the feilds" });
    }

    let users = req.body.users;

    if (users.length < 2) {
        res.status(400).json({
            sucess: false,
            message: "Group must have At least 3  members"
        })
    }

    users.push(req.user);
    try {
        const groupChat = Chat.create({
            chatName: req.body.name,
            isGroupChat: true,
            users: users,
            groupAdmin: req.user,
        })

        const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
            .populate("users", "-password")
            .populate("groupAdmin", "-password");

        return res.status(200).json({
            success: true,
            message: "Group Created Successfully",
            fullGroupChat: fullGroupChat
        })
    } catch (error) {
        return res.status(500).json({
            sucess: false,
            message: "Something Went wrong Try again Later",
        })
    }
})

const renameGroup = asyncHandler(async (req, res) => {
    const { chatId, chatName } = req.body;

    const updatedChat = await Chat.findByIdAndUpdate(chatId,
        {
            chatName: chatName
        },
        {
            new: true,
        }
    )
        .populate("users", "-password")
        .populate("groupAdmin", "-password");


    if (!updatedChat) {
        res.status(404);
        throw new Error("Chat Not Found");
    } else {
        res.json(updatedChat);
    }
})


const removeFromGroup = asyncHandler(async (req, res) => {
    const { chatId, userId } = req.body;

    const user = await findOne({ userId });

    if (!user.isAdmin) {
        return res.status(400).json({
            sucess: false,
            message: "Only Admin can Remove people"
        })
    }

    const removed = await Chat.findByIdAndUpdate(
        chatId,
        {
            $pull: { users: userId },
        },
        {
            new: true,
        }
    )
        .populate("users", "-password")
        .populate("groupAdmin", "-password");

    if (!removed) {
        res.status(404);
        throw new Error("Chat Not Found");
    } else {
        res.json(removed);
    }

})

const addToGroup = asyncHandler(async (req, res) => {
    const { chatId, userId } = req.body;

    const user = await findOne({ userId });

    if (!user.isAdmin) {
        return res.status(400).json({
            sucess: false,
            message: "Only Admin can Remove people"
        })
    }

    const added = await Chat.findByIdAndUpdate(
        chatId,
        {
            $push: { users: userId },
        },
        {
            new: true,
        }
    )
        .populate("users", "-password")
        .populate("groupAdmin", "-password");

    if (!added) {
        res.status(404);
        throw new Error("Chat Not Found");
    } else {
        res.json(added);
    }

})


export {
    accessChat,
    fetchchats,
    createdGroupChat,
    renameGroup,
    removeFromGroup,
    addToGroup,
}