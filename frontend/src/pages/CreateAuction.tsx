/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
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

        const createAuction = async (title: string, description: string, startingPrice: string, startingTime: string, endingTime: string, userId: any) => {
            try {
                await axios.post('http://localhost:8000/api/auction/createauction', {
                    userId,
                    title,
                    description,
                    startingPrice,
                    startingTime,
                    endingTime,
                });
                toast.success('Auction created successfuly');
                navigate('/home');
            } catch (error: any) {
                console.error('create error:', error);
                toast.error(`Failed to create auction: ${error.response.data.message}`);
            }
        };

        if (!formData.title || !formData.description || !formData.startingPrice || !formData.startingTime || !formData.endingTime) {
            toast.error('Details missing');
        }
        else {
            createAuction(formData.title, formData.description, formData.startingPrice, formData.startingTime, formData.endingTime, userId);
        }
    }

    return (
        <div className="bg-gray-100 min-h-screen">
            <Navbar />
            <div className="container mx-auto py-8 px-4">
                <div className="bg-white p-8 rounded-lg shadow-md">
                    <h1 className="text-2xl font-bold mb-6 text-center">Create Auction</h1>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="title" className="block text-gray-700">Title:</label>
                            <input
                                type="text"
                                id="title"
                                name="title"
                                required
                                value={formData.title}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded mt-1 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>

                        <div>
                            <label htmlFor="description" className="block text-gray-700">Description:</label>
                            <textarea
                                id="description"
                                name="description"
                                required
                                value={formData.description}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded mt-1 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            ></textarea>
                        </div>

                        <div>
                            <label htmlFor="startingPrice" className="block text-gray-700">Starting Price:</label>
                            <input
                                type="number"
                                id="startingPrice"
                                name="startingPrice"
                                min="0"
                                step="1"
                                required
                                value={formData.startingPrice}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded mt-1 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>

                        <div>
                            <label htmlFor="startingTime" className="block text-gray-700">Start Time:</label>
                            <input
                                type="datetime-local"
                                id="startingTime"
                                name="startingTime"
                                required
                                value={formData.startingTime}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded mt-1 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>

                        <div>
                            <label htmlFor="endingTime" className="block text-gray-700">End Time:</label>
                            <input
                                type="datetime-local"
                                id="endingTime"
                                name="endingTime"
                                required
                                value={formData.endingTime}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded mt-1 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>

                        <div className="text-center">
                            <button
                                type="submit"
                                className="w-full bg-indigo-500 text-white py-2 rounded hover:bg-indigo-600 transition duration-200"
                            >
                                Create Auction
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}