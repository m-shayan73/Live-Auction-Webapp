import { useNavigate } from "react-router-dom"
import Navbar from "../components/Navbar"

export default function Home() {
    const navigate = useNavigate()
    const userId = localStorage.getItem('userId');

    if (!userId) {
        navigate('/')
    }


    return (
        <>
            <Navbar />
            <div>Home</div>
        </>
    )
}