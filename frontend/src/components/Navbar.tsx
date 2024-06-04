import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Navbar() {
    const navigate = useNavigate();
    const [isDropdownOpen, setDropdownOpen] = useState(false);

    const toggleDropdown = () => {
        setDropdownOpen(!isDropdownOpen);
    };

    const logout = () => {
        localStorage.clear();
        navigate('/')
    };

    return (
        <nav className='navbar'>
            <div className='navbar-content'>
                <div>
                    <ul className='flex'>
                        <li className='pr-40'>
                            <Link to="/home">Home</Link>
                        </li>
                        <li className='pr-40'>
                            <Link to="/browse">Browse</Link>
                        </li>
                    </ul>
                </div>

                <div>
                    <button onClick={toggleDropdown}>Profile</button>
                    {isDropdownOpen && (
                        <ul>
                            <li>
                                <Link to="/profile">My Profile</Link>
                            </li>
                            <li>
                                <button onClick={logout}>Logout</button>
                            </li>
                        </ul>
                    )}
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
