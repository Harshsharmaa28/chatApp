import React from 'react';
import { Link } from 'react-router-dom';

export const Homepage = () => {
    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
                <h1 className="text-3xl font-bold text-center text-blue-600 mb-4">Welcome to ChatVerse</h1>
                <p className="text-center text-gray-600 mb-8">
                    Connect, communicate, and collaborate like never before. ChatVerse offers seamless messaging,
                    enhanced security, and a user-friendly interface, making it the perfect choice for both personal
                    and professional communication.
                </p>

                <div className="flex flex-col space-y-4">
                    <Link
                        to="/signup"
                        className="w-full text-center py-3 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition"
                    >
                        Sign Up
                    </Link>
                    <Link
                        to="/login"
                        className="w-full text-center py-3 rounded-lg bg-gray-500 text-white hover:bg-gray-600 transition"
                    >
                        Sign In
                    </Link>
                </div>
            </div>

            <div className="mt-8 text-center">
                <p className="text-gray-600">
                    Why choose ChatVerse? Because your conversations deserve the best platform. Join us and experience
                    a chat app designed with you in mind.
                </p>
            </div>
        </div>
    );
};