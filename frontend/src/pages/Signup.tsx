/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';

export default function SignupForm() {
    const navigate = useNavigate();

    const [name, setName] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const signup = async (name: string, username: string, password: string) => {
        try {
            await axios.post('http://localhost:8000/api/user/signup', {
                name,
                username,
                password
            });
            toast.success('Signup Successful');
            navigate('/');
        } catch (error: any) {
            toast.error(`Signup Failed: ${error.response?.data?.message || error.message}`);
        }
    };

    const handleSubmit = (e: any) => {
        e.preventDefault();

        if (!name || !username || !password) {
            toast.error(`Signup Failed: Details Missing`);
        }
        else {
            signup(name, username, password);
        }

    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-indigo-500 to-purple-500 p-6">
            <form onSubmit={handleSubmit} className="bg-white shadow-lg rounded-lg p-8 w-full max-w-sm">
                <h2 className="text-3xl font-extrabold mb-6 text-center text-gray-800">Signup</h2>
                <div className="mb-4">
                    <label htmlFor="name" className="block text-gray-700 font-semibold">Name</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        placeholder="Enter your name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg mt-1 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="username" className="block text-gray-700 font-semibold">Username</label>
                    <input
                        type="text"
                        id="username"
                        name="username"
                        placeholder="Enter your username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg mt-1 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                </div>
                <div className="mb-6">
                    <label htmlFor="password" className="block text-gray-700 font-semibold">Password</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg mt-1 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                </div>
                <div>
                    <button
                        type="submit"
                        className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 transition duration-200"
                    >
                        Sign Up
                    </button>
                </div>
                <div className="mt-4 text-center text-gray-600">
                    Already have an account? <a href="/" className="text-purple-500 hover:underline font-semibold">Login</a>
                </div>
            </form>
        </div>
    );
}