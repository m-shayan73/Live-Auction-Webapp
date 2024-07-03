/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Navbar from '../components/Navbar';

export default function ChangePasswordForm() {
  const navigate = useNavigate();
  const userId = localStorage.getItem('userId');

  if (!userId) {
    navigate('/')
  }

  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const handleChangePassword = async (e: any) => {
    e.preventDefault();

    try {
      const response = await axios.put('http://localhost:8000/api/user/changepassword', {
        userId,
        oldPassword,
        newPassword,
      });
      toast.success(response.data.message);
      navigate('/home');
    } catch (error) {
      console.error('Password change error:', error);
    }
  };

  return (
    <>
      <Navbar />
      <div className="flex justify-center items-center bg-gray-100" style={{ minHeight: 'calc(100vh - 64px)' }}>
        <form onSubmit={handleChangePassword} className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
          <h2 className="text-2xl font-bold mb-6 text-center">Change Password</h2>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Old Password:</label>
            <input
              type="password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 mb-2">New Password:</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Change Password
          </button>
        </form>
      </div>
    </>
  );
}