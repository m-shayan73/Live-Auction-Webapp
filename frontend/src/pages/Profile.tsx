/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

import defaultUser from "../assets/user.png"

interface UserDetails {
    name: string;
    username: string;
    password: string;
    itemsOwned: string[];
    auctionsCreated: string[];
    image: string;
}

export default function Profile() {
    const navigate = useNavigate()
    const userId = localStorage.getItem('userId');
    const [userDetails, setUserDetails] = useState<UserDetails>();
    const [auctions, setAuctions] = useState([]);

    useEffect(() => {
        if (!userId) {
            navigate('/');
        }
    }, [userId, navigate]);

    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/api/user/getuser/${userId}`);
                console.log(response.data)
                setUserDetails(response.data);
            } catch (error) {
                console.error('Failed to fetch user details', error);
            }
        };

        if (userId) {
            fetchUserDetails();
        }
    }, []);

    useEffect(() => {
        const fetchAuctions = async () => {
            if (userDetails && userDetails.auctionsCreated.length > 0) {
                try {
                    const response = await axios.post('http://localhost:8000/api/auction/getauctions', {
                        ids: userDetails.auctionsCreated
                    });
                    setAuctions(response.data);
                } catch (error) {
                    console.error('Failed to fetch auctions', error);
                }
            }
        };

        fetchAuctions();
    }, [userDetails]);

    if (!userDetails) {
        return;
    }

    const userImage = userDetails.image || defaultUser;

    return (
        <div className='bg-gray-100 min-h-screen'>
            <Navbar />
            <div className="container mx-auto p-4 mt-4">
                <h1 className="text-2xl font-bold mb-6 text-center">My Profile</h1>
                <div className="bg-white shadow rounded-lg p-6 mb-6 flex flex-col md:flex-row md:justify-between items-center">
                    <div className="flex items-center space-x-6">
                        <img src={userImage} alt="User" className="w-16 h-16 rounded-full border-2 border-gray-300" />
                        <div>
                            <div className="mb-3">
                                <h2 className="text-xl font-semibold text-gray-700">Name:</h2>
                                <p className="text-lg text-gray-600">{userDetails.name}</p>
                            </div>
                            <div className="mb-3">
                                <h2 className="text-xl font-semibold text-gray-700">Username:</h2>
                                <p className="text-lg text-gray-600">{userDetails.username}</p>
                            </div>
                            <div>
                                <h2 className="text-xl font-semibold text-gray-700">Items Owned:</h2>
                                <p className="text-lg text-gray-600">{userDetails.itemsOwned.length}</p>
                            </div>
                        </div>
                    </div>
                    <div className="mt-4 md:mt-0">
                        <button
                            onClick={() => navigate('/createauction')}
                            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 mr-2 transition duration-200"
                        >
                            Create Auction
                        </button>
                        <button
                            onClick={() => navigate('/changepassword')}
                            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-200"
                        >
                            Update Password
                        </button>
                    </div>
                </div>

                <div>
                    <h3 className="text-2xl font-bold mb-4 text-gray-700">My Auctions</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {auctions.map((auction: any, index) => (
                            <div key={index} className="border rounded-lg overflow-hidden shadow-lg bg-white mb-4">
                                <div className="p-4">
                                    <div className="flex items-center mb-2">
                                        <h4 className="text-lg font-semibold text-gray-800 mr-2">Title:</h4>
                                        <p className="text-gray-800">{auction.title}</p>
                                    </div>
                                    <h4 className="text-lg font-semibold text-gray-800">Description:</h4>
                                    <p className="text-gray-800 mb-4">{auction.description}</p>
                                    <div className="grid grid-cols-2 gap-4 mb-2">
                                        <div>
                                            <p className="text-gray-700 font-semibold">Starting Price:</p>
                                            <p className="text-gray-700">Rs {auction.startingPrice}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-700 font-semibold">Current Price:</p>
                                            <p className="text-gray-700">Rs {auction.currentPrice}</p>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4 mb-2">
                                        <div>
                                            <p className="text-gray-700 font-semibold">Start Time:</p>
                                            <p className="text-gray-700">{new Date(auction.startingTime).toLocaleString()}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-700 font-semibold">End Time:</p>
                                            <p className="text-gray-700">{new Date(auction.endingTime).toLocaleString()}</p>
                                        </div>
                                    </div>
                                    <p className={`text-sm font-semibold ${auction.status !== 'completed' ? 'text-green-500' : 'text-red-500'}`}>Status: {auction.status === 'toStart' ? 'To Start' : auction.status.charAt(0).toUpperCase() + auction.status.slice(1)}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}