import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

interface AuctionDetails {
    _id: string;
    title: string;
    description: string;
    image?: string;
    startingPrice: number;
    currentPrice: number;
    startingTime: Date;
    endingTime: Date;
    createdBy?: string;
    status: string;
}

export default function Browse() {
    const navigate = useNavigate()
    const userId = localStorage.getItem('userId');

    useEffect(() => {
        if (!userId) {
            navigate('/');
        }
    }, [userId, navigate]);


    const [auctions, setAuctions] = useState<AuctionDetails[]>([]);

    useEffect(() => {
        const fetchAuctions = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/auction/getallauctions');
                setAuctions(response.data);
            } catch (error) {
                console.error('Failed to fetch auctions', error);
            }
        };

        fetchAuctions();
    }, []);

    const [query, setQuery] = useState('');

    const handleSearch = async () => {
        try {
            const response = await axios.get(`http://localhost:8000/api/auction/search?query=${query}`);
            setAuctions(response.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    return (
        <div className="bg-gray-100 min-h-screen">
            <Navbar />
            <div className="my-4 flex justify-center px-4">
                <div className="w-full max-w-lg flex">
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search for auctions..."
                        className="w-full p-3 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                        onClick={handleSearch}
                        className="bg-blue-500 text-white py-3 px-6 rounded-r-lg hover:bg-blue-700 transition duration-200"
                    >
                        Search
                    </button>
                </div>
            </div>
            <div className="container mx-auto p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {auctions.map((auction) => (
                        auction.status === 'ongoing' ? (
                            <Link to={`/auction/${auction._id}`} key={auction._id} className="block mb-4">
                                <div className="border rounded-lg overflow-hidden shadow-lg bg-white hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1 hover:scale-105">
                                    <div className="p-4">
                                        <div className="flex items-center mb-2">
                                            <h4 className="text-lg font-semibold text-gray-800 mr-2">Title:</h4>
                                            <p className="text-lg text-gray-800">{auction.title}</p>
                                        </div>
                                        <div className="mb-2">
                                            <h4 className="text-lg font-semibold text-gray-800">Description:</h4>
                                            <p className="text-gray-700">{auction.description}</p>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4 mb-2">
                                            <div>
                                                <p className="text-gray-700 font-semibold">Starting Price:</p>
                                                <p className="text-gray-700">Rs. {auction.startingPrice}</p>
                                            </div>
                                            <div>
                                                <p className="text-gray-700 font-semibold">Current Price:</p>
                                                <p className="text-gray-700">Rs. {auction.currentPrice}</p>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4 mb-2">
                                            <div>
                                                <p className="text-gray-700 font-semibold">Start Time:</p>
                                                <p className="text-gray-700">
                                                    {new Date(auction.startingTime).toLocaleString([], { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-gray-700 font-semibold">End Time:</p>
                                                <p className="text-gray-700">
                                                    {new Date(auction.endingTime).toLocaleString([], { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ) : null
                    ))}
                </div>
            </div>
        </div>
    );
}