import React, { useState } from 'react';

export const EditProfile = ({ isOpen, onClose, user, onSave }) => {
    const [username, setUsername] = useState(user.name);
    const [avatar, setAvatar] = useState(user.avatar);

    const handleSave = () => {
        // Handle save logic
        onSave({ ...user, name: username, avatar });
        onClose();
    };

    return (
        isOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white p-4 rounded-lg w-96">
                    <h2 className="text-xl font-semibold mb-4">Edit Profile</h2>
                    <div className="mb-4">
                        <label className="block text-gray-700">Username</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full p-2 border rounded"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700">Avatar</label>
                        <input
                            type="file"
                            onChange={(e) => setAvatar(URL.createObjectURL(e.target.files[0]))}
                            className="w-full p-2 border rounded"
                        />
                    </div>
                    <div className="flex justify-end space-x-2">
                        <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded">
                            Cancel 
                        </button>
                        <button onClick={handleSave} className="px-4 py-2 bg-blue-500 text-white rounded">
                            Save
                        </button>
                    </div>
                </div>
            </div>
        )
    );
};

