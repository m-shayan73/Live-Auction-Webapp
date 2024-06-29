import { useNavigate } from "react-router-dom"
import Navbar from "../components/Navbar"

import auctionBg from "../assets/auction_bg.jpg"

export default function Home() {
    const navigate = useNavigate()
    const userId = localStorage.getItem('userId');

    if (!userId) {
        navigate('/')
    }


    return (
        <>
            <Navbar />

            <div className="bg-cover bg-center bg-no-repeat flex items-center justify-center" style={{ backgroundImage: `url(${auctionBg})`, minHeight: 'calc(100vh - 64px)' }}>
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-grey-800 mb-4">Welcome to The Auction Platform</h1>
                    <p className="text-lg text-grey-700 mb-8">Browse, bid, and win unique items!</p>
                    <a href="/browse" className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-6 rounded-md text-lg font-semibold inline-block">Explore Auctions</a>
                </div>
            </div>
        </>
    )
}