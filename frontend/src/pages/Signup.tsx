import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function SignupForm() {
    const navigate = useNavigate();

    const [name, setName] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const signup = async (name: String, username: String, password: String) => {
        try {
            const response = await axios.post('http://localhost:8000/api/user/signup', {
                name,
                username,
                password
            });
            alert('Signup successful');
            navigate('/');
        } catch (error: any) {
            console.error('Signup error:', error);
            alert(`Signup Failed: ${error.response.data.message}`);
        }
    };

    const handleSubmit = (e: any) => {
        e.preventDefault();

        if (!name || !username || !password) {
            alert('Details missing');
        }
        else {
            signup(name, username, password);
        }

    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <h2>Signup</h2>
                <div>
                    <label htmlFor="name">Name</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        placeholder="Enter your name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>
                <div>
                    <label htmlFor="username">Username</label>
                    <input
                        type="text"
                        id="username"
                        name="username"
                        placeholder="Enter your username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </div>
                <div>
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <div>
                    <button type="submit">Sign Up</button>
                </div>
                <div>
                    Already have an account? <a href="/">Login</a>
                </div>
            </form>
        </div>
    );
}