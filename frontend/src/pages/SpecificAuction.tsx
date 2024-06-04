import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
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

        socket.on('updateAuction', ({ highestBidder }) => {
            console.log(highestBidder);
            alert(`${highestBidder} placed a bid; Current Price Updated`);
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
            alert('Your bid must be higher than the current going price.');
        }
    };

    return (
        <div>
            <Navbar />
            <div>
                <h2>Title: {auctionDetails.title}</h2>
                <p>Description: {auctionDetails.description}</p>
                <p>Current Price: Rs. {auctionDetails.startingPrice > auctionDetails.currentPrice ? auctionDetails.startingPrice : auctionDetails.currentPrice}</p>
                <p>Start Time: {new Date(auctionDetails.startingTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                <p>End Time: {new Date(auctionDetails.endingTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
            </div>

            {auctionDetails.createdBy !== userId && auctionDetails.status !== 'Completed' ?
                <form onSubmit={handleBid}>
                    <label htmlFor="bidAmount">Your Bid:</label>
                    <input
                        type="number"
                        id="bidAmount"
                        name="bidAmount"
                        min="0"
                        step="1"
                        required
                        value={bidAmount}
                        onChange={(e) => setBidAmount(e.target.value)}
                    />
                    <button type="submit">Place Bid</button>
                </form>
                :
                <></>
            }

            {auctionDetails.status === 'Completed' ?
                <p>Auction has Ended</p>
                :
                <></>
            }
        </div>
    );
}