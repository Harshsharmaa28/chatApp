import React, { useEffect, useState, useRef } from 'react';
import { ArrowRight } from 'lucide-react';
import { EditProfile } from './EditProfile';
import { io } from "socket.io-client";

const Messages = ({ selectedChat, selectedUserName }) => {
    const BASE_URL = process.env.REACT_APP_BASE_URL;
    const token = JSON.parse(localStorage.getItem('userInfo')).accessToken;
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    const [socketConnected, setSocketConnected] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [curUser, setCurrentUser] = useState({
        name: 'Harsh Sharma',
        avatar: 'https://via.placeholder.com/40', // Placeholder avatar
    });

    const messagesEndRef = useRef(null);
    const socket = useRef(null); // Use useRef to keep the socket instance
    const currentUser = JSON.parse(localStorage.getItem("userInfo")).loggedInUser._id;
    const User = JSON.parse(localStorage.getItem("userInfo"));
    const endPoint = process.env.REACT_APP_END_POINT;
    // console.log(endPoint)

    useEffect(() => {
        // Initialize socket connection
        socket.current = io(endPoint);
        socket.current.emit("setup", User);

        socket.current.on("connected", () => {
            // console.log("Socket connected");
            setSocketConnected(true);
        });

        // Listen for real-time messages
        socket.current.on("message received", (newMessageReceived) => {
            console.log("Real-time message received:", newMessageReceived);
            setMessages((prevMessages) => [...prevMessages, newMessageReceived]);
        });

        // Clean up the socket connection when the component unmounts
        return () => {
            if (socket.current) {
                socket.current.disconnect();
            }
        };
    }, []);

    useEffect(() => {
        if (socket.current && socketConnected && selectedChat) {
            // console.log("Joining chat room:", selectedChat);
            socket.current.emit("join chat", selectedChat);
        }
    }, [socketConnected, selectedChat]);

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    const getChat = async () => {
        if (!selectedChat) return;
        try {
            const fetchMessages = await fetch(`${BASE_URL}/messages/${selectedChat}`, {
                headers: {
                    'Content-type': 'Application/json',
                    'Authorization': `Bearer ${token}`
                },
                credentials: 'include',
            });
            const data = await fetchMessages.json();
            setMessages(data);
            // console.log("Chat messages loaded");
        } catch (error) {
            console.error(error.message);
        }
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!inputMessage.trim()) return;

        try {
            const send = await fetch(`${BASE_URL}/messages/send`, {
                method: "POST",
                headers: {
                    'Content-type': 'Application/json',
                    'Authorization': `Bearer ${token}`
                },
                credentials: 'include',
                body: JSON.stringify({
                    content: inputMessage,
                    chatId: selectedChat,
                })
            });

            const newMessage = { sender: { _id: currentUser }, content: inputMessage, chatId: selectedChat };
            setMessages([...messages, newMessage]);
            setInputMessage('');

            // Emit the message to the server
            if (socket.current && socketConnected) {
                // console.log("Emitting new message:", newMessage);
                socket.current.emit("new message", newMessage);
            } else {
                // console.log("Socket not connected");
            }

            const response = await send.json();
            console.log(response);
        } catch (error) {
            console.error(error.message);
        }
    };

    useEffect(() => {
        getChat();
    }, [selectedChat]);

    const handleAvatarClick = () => {
        setIsModalOpen(true);
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
    };

    const handleSaveProfile = (updatedUser) => {
        setCurrentUser(updatedUser);
    };

    return (
        <div className='h-screen flex flex-col'>
            <div className="p-4 bg-gray-700 border-b border-gray-400">
                <div className='flex gap-2'>
                    <img onClick={handleAvatarClick} className='hover:cursor-pointer w-10 h-10 rounded-full object-cover' src="https://w7.pngwing.com/pngs/340/946/png-transparent-avatar-user-computer-icons-software-developer-avatar-child-face-heroes-thumbnail.png" alt="" />
                    <h3 className="text-xl py-1 text-white font-semibold">{selectedUserName}</h3>
                </div>
            </div>
            <div className="flex-1 p-4 overflow-y-auto h-auto bg-gray-100">
                {messages && messages?.map((message, index) => (
                    <div
                        key={index}
                        className={`${message.sender._id === currentUser ? 'justify-end' : 'justify-start'} flex mb-2`}
                    >
                        <div className={`overflow-auto p-2 rounded-lg ${message.sender._id === currentUser ? 'bg-blue-500 text-white' : 'bg-gray-300 text-black'}`}>
                            <p className=''>{message.content}</p>
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>
            <form onSubmit={handleSendMessage} className="p-4 bg-gray-200 border-t border-gray-300">
                <div className="flex items-center">
                    <input
                        type="text"
                        placeholder="Type a message"
                        className="flex-1 p-2 rounded-lg border border-gray-300"
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                    />
                    <button type="submit" className="ml-2 p-2 flex  bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                        Send <ArrowRight className='w-5' />
                    </button>
                </div>
            </form>
            <EditProfile
                isOpen={isModalOpen}
                onClose={handleModalClose}
                user={curUser}
                onSave={handleSaveProfile}
            />
        </div>
    );
};

export default Messages;
