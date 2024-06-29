import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from "axios";

export default function Login() {
    const navigate = useNavigate();

    const [username, setUserName] = useState("");
    const [password, setPassword] = useState("");

    const login = async (username, password) => {
        try {
            const response = await axios.post('https://live-auction-api.vercel.app/api/user/login', {
                username,
                password
            });
            toast.success('Login Successful');
            localStorage.setItem('userId', response.data.user.id);
            localStorage.setItem('username', response.data.user.username);
            navigate('/home');
        } catch (error) {
            toast.error(`Login Failed: ${error.response?.data?.message || error.message}`);

        }
    };

    function changeUserName(e) {
        setUserName(e.target.value);
    }

    function changePassword(e) {
        setPassword(e.target.value);
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(username, password);

        if (!username || !password) {
            alert('Details missing');
        }
        else {
            login(username, password);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-indigo-500 to-purple-500 p-6">
            <form className="bg-white shadow-lg rounded-lg p-8 w-full max-w-sm">
                <h2 className="text-3xl font-extrabold mb-6 text-center text-gray-800">Login</h2>
                <div className="mb-4">
                    <label htmlFor="username" className="block text-gray-700 font-semibold">Username</label>
                    <input
                        type="text"
                        id="username"
                        name="username"
                        placeholder="Enter your username"
                        value={username}
                        onChange={changeUserName}
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
                        onChange={changePassword}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg mt-1 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                </div>
                <div>
                    <button
                        type="submit"
                        onClick={handleSubmit}
                        className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 transition duration-200"
                    >
                        Login
                    </button>
                </div>
                <div className="mt-4 text-center text-gray-600">
                    Don't have an account? <a href="/signup" className="text-purple-500 hover:underline font-semibold">Sign up</a>
                </div>
            </form>
        </div>

    )
}