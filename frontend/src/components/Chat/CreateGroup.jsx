import React from 'react'
import { useState } from 'react';

const CreateGroup = ({contacts, setIsGroupModalOpen}) => {
    const BASE_URL = process.env.REACT_APP_BASE_URL;
    const token = JSON.parse(localStorage.getItem('userInfo')).accessToken;
    const [groupName, setGroupName] = useState('');
    const [selectedMembers, setSelectedMembers] = useState([]);

    const handleGroupCreation = async () => {
        // console.log(selectedMembers)
        if (groupName && selectedMembers?.length) {
            console.log('Group Created:', groupName, selectedMembers);
            // Here you would handle the group creation logic
            try {
                const createGroup = await fetch(`${BASE_URL}/chats/group`,{
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                    credentials: 'include',
                    body: JSON.stringify({
                        name: groupName,
                        users: selectedMembers,
                    })
                })
                const data = await createGroup.json();
                // console.log(data)
            } catch (error) {
                console.error(error.message);
            }
            setIsGroupModalOpen(false);
            setGroupName('');
            setSelectedMembers([]);
        }
    };

    const toggleMemberSelection = (memberId) => {
        setSelectedMembers((prev) =>
            prev.includes(memberId) ? prev.filter((id) => id !== memberId) : [...prev, memberId]
        );
    };

    return (
        <div>
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                <div className="bg-white p-4 rounded-lg w-96">
                    <h3 className="text-xl font-semibold mb-4">Create Group</h3>
                    <input
                        type="text"
                        placeholder="Group Name"
                        className="mb-4 p-2 w-full rounded-md border"
                        value={groupName}
                        onChange={(e) => setGroupName(e.target.value)}
                    />
                    <div className="mb-4">
                        <h4 className="text-lg font-medium">Add Members</h4>
                        {contacts?.map((contact) => (
                            <div key={contact._id} className="flex items-center mb-2">
                                <input
                                    type="checkbox"
                                    _id={`contact-${contact._id}`}
                                    className="mr-2"
                                    checked={selectedMembers?.includes(contact._id)}
                                    onChange={() => toggleMemberSelection(contact._id)}
                                />
                                <label htmlFor={`contact-${contact._id}`} className="text-gray-800">
                                    {contact.name}
                                </label>
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-end">
                        <button
                            className="bg-gray-500 text-white p-2 rounded-md mr-2"
                            onClick={() => setIsGroupModalOpen(false)}
                        >
                            Cancel
                        </button>
                        <button
                            className="bg-blue-500 text-white p-2 rounded-md"
                            onClick={handleGroupCreation}
                        >
                            Create
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CreateGroup
