import React, { useState, useRef, useEffect } from 'react';
import { AlignJustify, ArrowRight, BellDot, ClipboardListIcon, Search, Square, SquareX, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import CreateGroup from './CreateGroup';
import Messages from './Messages';
import { toast } from 'react-toastify';
import { CircleX } from 'lucide-react';

export const Chat = () => {
    const BASE_URL = process.env.REACT_APP_BASE_URL;
    const token = JSON.parse(localStorage.getItem('userInfo')).accessToken;
    const navigate = useNavigate();
    const currentUser = JSON.parse(localStorage.getItem("userInfo")).loggedInUser.name;

    const [selectedChat, setSelectedChat] = useState(null);
    const [selectedUserName, setselectedUserName] = useState("");
    const [searchQuery, setSearchQuery] = useState('');
    const [isDragging, setIsDragging] = useState(false);
    const [sidebarWidth, setSidebarWidth] = useState(() => {
        const screenWidth = window.innerWidth;
        if (screenWidth > 780) {
            return 400;
        }
        else {
            return 300;
        }
    });
    const [contacts, setContacts] = useState([]);
    const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);
    const [handlesidebar, setHandlesidebar] = useState(false);
    const sidebarRef = useRef(null);

    const handleUserSearch = async (e) => {
        try {
            const query = e.target.value || "";
            setSearchQuery(query);
            const result = await fetch(`${BASE_URL}/users/?search=${query}`, {
                method: "GET",
                headers: {
                    'Content-type': 'Application/json',
                    'Authorization': `Bearer ${token}`,
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

    useEffect(() => {
        handleUserSearch({ target: { value: "" } });
    }, []);

    const filteredContacts = contacts?.filter((contact) =>
        contact.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleChatSelect = async (contact) => {
        // setSelectedChat(contact);
        // console.log(contact);
        try {
            setselectedUserName(contact.name)
            const createChat = await fetch(`${BASE_URL}/chats/`, {
                method: "POST",
                headers: {
                    'Content-type': 'Application/json',
                    'Authorization': `Bearer ${token}`
                },
                credentials: 'include',
                body: JSON.stringify({ userId: contact })
            })
            const data = await createChat.json();
            console.log("Created chat : ", data)
            setSelectedChat(data._id)
            setHandlesidebar(false)
            // console.log(selectedChat)
        } catch (error) {
            toast.error(error.message)
            console.error(error.message)
        }
    };

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

    // console.log(handlesidebar)

    return (
        <div className="flex h-screen vsm:max-sm:">
            {/* Sidebar */}
            <div
                ref={sidebarRef}
                style={{ width: sidebarWidth }}
                className="relative bg-gray-800 text-white flex flex-col vsm:max-sm:vsm:max-sm:absolute vsm:max-md:hidden"
            >
                <div className="flex justify-between items-center p-4 border-b border-gray-700">
                    <h2 className="text-lg font-semibold">Chats</h2>
                    <button onClick={handleLogout} className="text-red-400 hover:text-red-600">
                        Logout
                    </button>
                </div>
                <div className={`p-4 ${!selectedChat ? 'hidden' : ''} `}>
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
            {
                handlesidebar &&
                <div
                    ref={sidebarRef}
                    style={{ width: sidebarWidth }}
                    className="relative bg-gray-800 text-white flex flex-col vsm:max-sm:vsm:max-sm:absolute vsm:max-sm:h-[100%] md:hidden"
                >
                    <div className="flex justify-between items-center p-4 border-b border-gray-700">
                        <div>
                            <h2 className="text-lg font-semibold">Chats</h2>
                            <button onClick={handleLogout} className="text-red-400 hover:text-red-600">
                                Logout
                            </button>
                        </div>
                        <X onClick={() => setHandlesidebar(false)} />
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

            }

            {/* Chat Area */}
            <div className="w-full flex flex-col vsm:max-md:h-screen">
                {
                    !handlesidebar && <div className=' md:hidden flex h-1 justify-end absolute w-screen py-4 -ml-2'><AlignJustify className={`w-7 text-white h-10 md:hidden absolute ${selectedChat ? '' : ''}`} onClick={() => setHandlesidebar(true)} /></div>
                }
                {selectedChat ? (
                    <Messages selectedChat={selectedChat} selectedUserName={selectedUserName} />
                ) : (
                    <div style={{ backgroundImage: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)" }}
                        className='h-screen flex flex-col overflow-hidden'>
                        <div className='flex md:justify-around bg-gray-700'>
                            <div className="p-4">
                                <input
                                    type="text"
                                    placeholder={` ${'Search Contact'}`}
                                    className="w-full md:w-[30rem] p-2 rounded-lg bg-gray-700 text-white border border-gray-500"
                                    value={searchQuery}
                                    onChange={handleUserSearch}
                                />
                            </div>
                            <div className='flex items-center justify-end vsm:max-sm:justify-start gap-5 md:gap-10 px-10 vsm:max-sm:px-2 py-4'>
                                <BellDot className='text-white vsm:max-sm:hidden' />
                                <img className='vsm:max-sm: w-7 h-7 md:w-10 md:h-10 object-cover rounded-full' src="https://w7.pngwing.com/pngs/340/946/png-transparent-avatar-user-computer-icons-software-developer-avatar-child-face-heroes.png" alt="" />
                                <BellDot className=' text-white sm:hidden' />
                            </div>
                        </div>
                        { searchQuery && <div className="md:hidden flex-1 rounded-b-lg absolute mx-2 h-[50%] justify-center items-center flex-wrap mt-[4.6rem] w-[95%] overflow-y-auto bg-gray-700 border-white px-2">
                            {filteredContacts?.map((contact) => (
                                <div
                                    key={contact._id}
                                    onClick={() => handleChatSelect(contact)}
                                    className={`cursor-pointer p-4 flex items-center text-white border-b border-white ${selectedChat?._id === contact._id ? 'bg-gray-700' : ''}`}
                                >
                                    <img src={contact.avatar} alt="avatar" className="w-10 h-10 rounded-full mr-4" />
                                    <div>
                                        <h3 className="font-semibold">{contact.name}</h3>
                                        <p className="text-sm text-gray-400">{contact.lastMessage}</p>
                                    </div>
                                </div>
                            ))}
                        </div>}
                        <div
                            style={{ backgroundImage: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)" }}
                            className="flex items-center flex-col justify-center h-full text-center text-gray-500">
                            <p>Select a chat from Side Bar to start messaging</p>
                            <p>Send and Receive Message without keeping your phone online.</p>
                        </div>
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
