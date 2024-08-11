import React, { useState, useRef, useEffect } from 'react';
import { ArrowRight, ClipboardListIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import CreateGroup from './CreateGroup';
import Messages from './Messages';
import { toast } from 'react-toastify';

export const Chat = () => {
    const navigate = useNavigate();

    const [selectedChat, setSelectedChat] = useState(null);
    const [selectedUserName, setselectedUserName] = useState("");
    const [searchQuery, setSearchQuery] = useState('');
    const [isDragging, setIsDragging] = useState(false);
    const [sidebarWidth, setSidebarWidth] = useState(400);
    const [contacts, setContacts] = useState([]);
    const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);
    const sidebarRef = useRef(null);


    // useEffect(() => {
    //     const getUserchats = async () => {
    //         try {
    //             const userChats = await fetch("http://localhost:8000/api/v1/chats/getChats", {
    //                 method: "GET",
    //                 headers: {
    //                     'Content-type': 'Application/json',
    //                 },
    //                 credentials: 'include'
    //             })

    //             const data = await userChats.json();
    //             setContacts(data);
    //             console.log(data)
    //         } catch (error) {
    //             toast.error(error.message)
    //         }
    //     }
    // }, [])

    const handleUserSearch = async (e) => {
        try {
            const query = e.target.value || "";
            setSearchQuery(query);

            const result = await fetch(`http://localhost:8000/api/v1/users/?search=${encodeURIComponent(query)}`, {
                method: "GET",
                headers: {
                    'Content-type': 'Application/json',
                },
                credentials: 'include'
            });

            const data = await result.json();
            setContacts(data.users);
        } catch (error) {
            toast.error(error.message)
            console.error(error.message);
        }
    };
    const filteredContacts = contacts?.filter((contact) =>
        contact.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleChatSelect = async (contact) => {
        // setSelectedChat(contact);
        // console.log(contact);
        try {
            setselectedUserName(contact.name)
            const createChat = await fetch("http://localhost:8000/api/v1/chats/", {
                method: "POST",
                headers: {
                    'Content-type': 'Application/json',
                },
                credentials: 'include',
                body: JSON.stringify({ userId: contact })
            })
            const data = await createChat.json();
            console.log("Created chat : ", data)
            setSelectedChat(data._id)
            // console.log(selectedChat)
        } catch (error) {
            toast.error(error.message)
            console.error(error.message)
        }
    };

    // const handleSendMessage = (e) => {
    //     e.preventDefault();
    //     if (inputMessage.trim()) {
    //         setMessages([...messages, { sender: 'You', text: inputMessage }]);
    //         setInputMessage('');
    //     }
    // };
    const handleLogout = () => {
        localStorage.removeItem('userInfo');
        navigate('/login');
        toast.info("Loged out Successfully")
    };

    const handleMouseDown = (e) => {
        setIsDragging(true);
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    const handleMouseMove = (e) => {
        if (isDragging) {
            setSidebarWidth(Math.max(200, e.clientX));
        }
    };

    const handleCreateGroupClick = () => {
        setIsGroupModalOpen(true);
    };

    useEffect(() => {
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging]);

    return (
        <div className="flex h-screen">
            {/* Sidebar */}
            <div
                ref={sidebarRef}
                style={{ width: sidebarWidth }}
                className="relative bg-gray-800 text-white flex flex-col"
            >
                <div className="flex justify-between items-center p-4 border-b border-gray-700">
                    <h2 className="text-lg font-semibold">Chats</h2>
                    <button onClick={handleLogout} className="text-red-400 hover:text-red-600">
                        Logout
                    </button>
                </div>
                <div className="p-4">
                    <input
                        type="text"
                        placeholder="Search contacts"
                        className="w-full p-2 rounded-lg bg-gray-700 text-white border border-gray-600"
                        value={searchQuery}
                        onChange={handleUserSearch}
                    />
                </div>
                <div className="flex-1 overflow-y-auto">
                    {filteredContacts?.map((contact) => (
                        <div
                            key={contact._id}
                            onClick={() => handleChatSelect(contact)}
                            className={`cursor-pointer p-4 flex items-center border-b border-gray-700 ${selectedChat?._id === contact._id ? 'bg-gray-700' : ''}`}
                        >
                            <img src={contact.avatar} alt="avatar" className="w-10 h-10 rounded-full mr-4" />
                            <div>
                                <h3 className="font-semibold">{contact.name}</h3>
                                <p className="text-sm text-gray-400">{contact.lastMessage}</p>
                            </div>
                        </div>
                    ))}
                </div>
                <button
                    onClick={handleCreateGroupClick}
                    className="bg-blue-500 text-white p-4 rounded-lg m-4"
                >
                    Create Group
                </button>
                <div
                    className="absolute right-0 top-0 bottom-0 w-2 bg-gray-600 cursor-col-resize"
                    onMouseDown={handleMouseDown}
                ></div>
            </div>

            {/* Chat Area */}
            <div className="w-full flex flex-col">
                {selectedChat ? (
                    <Messages selectedChat={selectedChat} selectedUserName={selectedUserName} />
                ) : (
                    <div className="flex items-center flex-col justify-center h-full text-gray-500">
                        <p>Select a chat to start messaging</p>
                        <p>Send and Receive Message without keeping your phone online.</p>
                    </div>
                )}
            </div>

            {/* Group Creation Modal */}
            {isGroupModalOpen && (
                <CreateGroup contacts={contacts} setIsGroupModalOpen={setIsGroupModalOpen} />
            )}
        </div>
    );
};

export default Chat;
