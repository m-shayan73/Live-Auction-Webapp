import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Navbar() {
    const navigate = useNavigate();
    const [isDropdownOpen, setDropdownOpen] = useState(false);
    const username = localStorage.getItem('username');

    const toggleDropdown = () => {
        setDropdownOpen(!isDropdownOpen);
    };

    const getInitial = (name: string) => {
        return name ? name.charAt(0).toUpperCase() : '';
    };

    const logout = () => {
        localStorage.clear();
        navigate('/')
    };

    return (
        <nav className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-4 shadow-lg">
            <div className="container mx-auto flex justify-between items-center px-4">
                <div>
                    <ul className="flex space-x-8">
                        <li>
                            <Link to="/home" className="hover:text-indigo-300 transition duration-200">Home</Link>
                        </li>
                        <li>
                            <Link to="/browse" className="hover:text-indigo-300 transition duration-200">Browse</Link>
                        </li>
                    </ul>
                </div>
                <div className="relative">
                    <button
                        onClick={toggleDropdown}
                        className="focus:outline-none flex items-center space-x-2 hover:text-indigo-300 transition duration-200"
                    >
                        {username && (
                            <div className="w-8 h-8 bg-white text-gray-800 rounded-full flex items-center justify-center">
                                {getInitial(username)}
                            </div>
                        )}
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>
                    {isDropdownOpen && (
                        <ul className="absolute right-0 mt-2 w-40 bg-white text-gray-800 rounded-md shadow-lg">
                            <li className="rounded-t-md px-4 py-2.5 hover:bg-gray-100 transition duration-200">
                                <Link to="/profile" className="block w-full">My Profile</Link>
                            </li>
                            <li className="rounded-b-md px-4 py-2.5 hover:bg-gray-100 transition duration-200">
                                <button onClick={logout} className="block w-full text-left">Logout</button>
                            </li>
                        </ul>
                    )}
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
