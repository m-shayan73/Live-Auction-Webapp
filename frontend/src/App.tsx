import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';

import Login from './pages/Login';
import Signup from './pages/Signup';
import Home from './pages/Home';
import Browse from './pages/Browse';
import ChangePassword from './pages/ChangePassword';
import CreateAuction from './pages/CreateAuction';
import Profile from './pages/Profile';
import SpecificAuction from './pages/SpecificAuction';

function App() {
  return (
    <BrowserRouter>
      <ToastContainer />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/home" element={<Home />} />
        <Route path="/browse" element={<Browse />} />
        <Route path="/changepassword" element={<ChangePassword />} />
        <Route path="/createauction" element={<CreateAuction />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/auction/:auctionId" element={<SpecificAuction />} />
      </Routes>
    </BrowserRouter>

  );
}

export default App;
