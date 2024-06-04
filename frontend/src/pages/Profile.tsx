import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

export default function Profile() {
    const navigate = useNavigate()
    const userId = localStorage.getItem('userId');
    const [userDetails, setUserDetails] = useState(null);
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



    const userImage = userDetails.image || "../assets/user.png"

    return (
        <>
            <Navbar />
            <div>
                <div>
                    <button onClick={() => navigate('/createauction')}>Create Auction</button>
                    <button onClick={() => navigate('/changepassword')}>Update Password</button>
                </div>

                <div>
                    <img src={userImage} alt="User" />
                </div>

                <div>
                    <h2>Name: </h2>
                    <p>{userDetails.name}</p>
                </div>

                <div>
                    <h2>Username: </h2>
                    <p> {userDetails.username}</p>
                </div>

                <div>
                    <h3>Number of Items Owned:</h3>
                    <p>{userDetails.itemsOwned.length}</p>
                </div>

                <div>
                    <h3>My Auctions</h3>
                    {auctions.map((auction, index) => (
                        <div key={index}>
                            <h4>Title: {auction.title}</h4>
                            <p>Description: {auction.description}</p>
                            <p>Starting Price: Rs {auction.startingPrice}</p>
                            <p>Current Price: Rs {auction.currentPrice}</p>
                            <p>Start Time: {auction.startingTime}</p>
                            <p>End Time: {auction.endingTime}</p>
                            <p>Status: {auction.status}</p>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}