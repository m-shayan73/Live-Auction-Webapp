import { useState } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';

export default function Login() {
    const navigate = useNavigate();

    const [username, setUserName] = useState("");
    const [password, setPassword] = useState("");

    const login = async (username, password) => {
        try {
            const response = await axios.post('http://localhost:8000/api/user/login', {
                username,
                password
            });
            alert('Login successful');
            localStorage.setItem('userId', response.data.user.id);
            localStorage.setItem('username', response.data.user.username);
            navigate('/home');
        } catch (error) {
            console.error('Signup error:', error);
            alert(`Signup Failed: ${error.response.data.message}`);
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
        <div className="min-h-screen w-full flex items-center justify-center bg-gray-100">
            <form className="bg-white flex flex-col p-6 rounded shadow-md">
                <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
                <div className="mb-4">
                    <label htmlFor="username" className="block text-gray-700">Username</label>
                    <input
                        type="text"
                        id="username"
                        name="username"
                        placeholder="Enter your username"
                        value={username}
                        onChange={changeUserName}
                        className="w-full px-3 py-2 border border-gray-300 rounded mt-1 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                </div>
                <div className="mb-6">
                    <label htmlFor="password" className="block text-gray-700">Password</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={changePassword}
                        className="w-full px-3 py-2 border border-gray-300 rounded mt-1 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                </div>
                <div>
                    <button
                        type="submit"
                        onClick={handleSubmit}
                        className="w-full bg-indigo-500 text-white py-2 rounded hover:bg-indigo-600 transition duration-200"
                    >
                        Login
                    </button>
                </div>
                <div className="mt-4 text-center">
                    Don't have an account? <a href="/signup" className="text-indigo-500 hover:underline">Sign up</a>
                </div>
            </form>
        </div>
    )
}