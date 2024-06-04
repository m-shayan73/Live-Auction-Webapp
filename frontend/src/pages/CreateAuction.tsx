import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

export default function CreateAuction() {
    const navigate = useNavigate();
    const userId = localStorage.getItem('userId');
    if (!userId) {
        navigate('/');
    }

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        startingPrice: '',
        startingTime: '',
        endingTime: '',
    });

    const handleChange = (e: any) => {
        const { name, value, type, files } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'file' ? files[0] : value
        }));
    }

    const handleSubmit = (e: any) => {
        e.preventDefault();

        const createAuction = async (title: String, description: String, startingPrice: String, startingTime: String, endingTime: String, userId: any) => {
            try {
                const response = await axios.post('http://localhost:8000/api/auction/createauction', {
                    userId,
                    title,
                    description,
                    startingPrice,
                    startingTime,
                    endingTime,
                });
                alert('Auction created successfuly');
                navigate('/home');
            } catch (error: any) {
                console.error('create error:', error);
                alert(`Failed to create auction: ${error.response.data.message}`);
            }
        };

        if (!formData.title || !formData.description || !formData.startingPrice || !formData.startingTime || !formData.endingTime) {
            alert('Details missing');
        }
        else {
            createAuction(formData.title, formData.description, formData.startingPrice, formData.startingTime, formData.endingTime, userId);
        }
    }

    return (
        <div>
            <Navbar />
            <h1>Create Auction</h1>
            <form onSubmit={handleSubmit}>
                <label htmlFor="title">Title:</label>
                <input type="text" id="title" name="title" required value={formData.title} onChange={handleChange} />

                <label htmlFor="description">Description:</label>
                <textarea id="description" name="description" required value={formData.description} onChange={handleChange}></textarea>

                <label htmlFor="startingPrice">Starting Price:</label>
                <input type="number" id="startingPrice" name="startingPrice" min="0" step="1" required value={formData.startingPrice} onChange={handleChange} />

                <label htmlFor="startingTime">Start Time:</label>
                <input type="datetime-local" id="startingTime" name="startingTime" required value={formData.startingTime} onChange={handleChange} />

                <label htmlFor="endingTime">End Time:</label>
                <input type="datetime-local" id="endingTime" name="endingTime" required value={formData.endingTime} onChange={handleChange} />

                <button type="submit">Create Auction</button>
            </form>
        </div>
    );
}