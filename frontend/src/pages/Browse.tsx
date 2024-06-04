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
        <div>
            <Navbar />
            <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search for auctions..."
            />
            <button onClick={handleSearch}>Search</button>
            {auctions.map((auction) => (
                auction.status === 'ongoing' ?
                    <Link to={`/auction/${auction._id}`} key={auction._id}>
                        <div>
                            <h2>{auction.title}</h2>
                            <p>{auction.description}</p>
                            <p>Starting Price: Rs. {auction.startingPrice}</p>
                            <p>Start Time: {new Date(auction.startingTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                            <p>End Time: {new Date(auction.endingTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                        </div>
                    </Link>
                    :
                    <></>
            ))}
        </div>
    );
}