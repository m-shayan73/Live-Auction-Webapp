/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import io from 'socket.io-client';
import Navbar from '../components/Navbar';

interface AuctionDetails {
    title: string;
    description: string;
    startingPrice: number;
    currentPrice: number;
    startingTime: Date;
    endingTime: Date;
    createdBy: string;
    status: string;
}

let socket: any;

export default function SpecificAuction() {
    const navigate = useNavigate()
    const userId = localStorage.getItem('userId');
    const username = localStorage.getItem('username');

    useEffect(() => {
        if (!userId) {
            navigate('/');
        }
    }, [userId, navigate]);

    const { auctionId } = useParams();
    const [bidAmount, setBidAmount] = useState('');
    const [auctionDetails, setAuctionDetails] = useState<AuctionDetails>()

    useEffect(() => {
        socket = io('http://localhost:8000');

        socket.emit('joinAuction', auctionId);

        socket.on('updateAuction', ( highestBidder: any ) => {
            console.log(highestBidder);
            alert(`${highestBidder.highestBidder} placed a bid; Current Price Updated`);
            setBidAmount('');

            const fetchAuctions = async () => {
                try {
                    const response = await axios.post('http://localhost:8000/api/auction/getauctions', {
                        ids: [auctionId]
                    });
                    setAuctionDetails(response.data[0]);
                } catch (error) {
                    console.error('Failed to fetch auctions', error);
                }
            };

            fetchAuctions();
        });

        socket.on('auctionEnded', () => {
            alert("Auction Ended");
            navigate('/browse');
        });

        return () => {
            socket.emit('leaveAuction', auctionId);
            socket.off();
        };
    }, [auctionId]);

    useEffect(() => {
        const fetchAuctions = async () => {
            try {
                const response = await axios.post('http://localhost:8000/api/auction/getauctions', {
                    ids: [auctionId]
                });
                setAuctionDetails(response.data[0]);
            } catch (error) {
                console.error('Failed to fetch auctions', error);
            }
        };

        fetchAuctions();
    }, []);

    if (!auctionDetails) {
        return;
    }

    const handleBid = (e: any) => {
        e.preventDefault();
        console.log(`Bid placed: ${bidAmount}`);
        const bidAmountNumber = parseInt(bidAmount, 10);

        if (!isNaN(bidAmountNumber) && bidAmountNumber > auctionDetails.currentPrice) {
            socket.emit('placeBid', { auctionId: auctionId, bidAmount: bidAmountNumber, username: username, userId: userId });
        } else {
            toast.error('Your bid must be higher than the current going price.');
        }
    };

    return (
        <div className="bg-gray-100 min-h-screen">
            <Navbar />

            <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6 mt-8">
                <h2 className="text-3xl font-bold mb-6">Auction Details</h2>

                <div className="mb-6">
                    <h3 className="text-xl font-bold mb-2">Title:</h3>
                    <p className="text-gray-700">{auctionDetails.title}</p>
                </div>

                <div className="mb-6">
                    <h3 className="text-xl font-bold mb-2">Description:</h3>
                    <p className="text-gray-700">{auctionDetails.description}</p>
                </div>

                <div className="mb-6">
                    <h3 className="text-xl font-bold mb-2">Current Price:</h3>
                    <p className="text-gray-700">Rs. {Math.max(auctionDetails.startingPrice, auctionDetails.currentPrice)}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                        <h3 className="text-xl font-bold mb-2">Start Time:</h3>
                        <p className="text-gray-700">{new Date(auctionDetails.startingTime).toLocaleString([], { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                    </div>

                    <div>
                        <h3 className="text-xl font-bold mb-2">End Time:</h3>
                        <p className="text-gray-700">{new Date(auctionDetails.endingTime).toLocaleString([], { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                    </div>
                </div>

                {auctionDetails.createdBy !== userId && auctionDetails.status !== 'Completed' && (
                    <form onSubmit={handleBid} className="mb-6">
                        <label htmlFor="bidAmount" className="block text-xl font-bold mb-2">Your Bid:</label>
                        <div className="flex items-center">
                            <input
                                type="number"
                                id="bidAmount"
                                name="bidAmount"
                                min="0"
                                step="1"
                                required
                                value={bidAmount}
                                onChange={(e) => setBidAmount(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <button type="submit" className="w-1/4 ml-2 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
                                Place Bid
                            </button>
                        </div>
                    </form>
                )}

                {auctionDetails.status === 'Completed' && (
                    <p className="text-xl font-bold text-red-500 mb-6">Auction has Ended</p>
                )}
            </div>
        </div>
    );
}