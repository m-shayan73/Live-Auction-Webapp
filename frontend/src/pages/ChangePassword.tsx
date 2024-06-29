/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
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
      alert(response.data.message);
      navigate('/home');
    } catch (error) {
      console.error('Password change error:', error);
    }
  };

  return (
    <>
      <Navbar />
      <form onSubmit={handleChangePassword}>
        <label>Old Password:</label>
        <input
          type="password"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
        />
        <label>New Password:</label>
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <button type="submit">Change Password</button>
      </form>
    </>

  );
}