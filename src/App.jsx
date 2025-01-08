// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Signup from './components/Signup';
import Home from './components/Home';
import Header from './components/Header';
import { AuthProvider } from './AuthContext';
import VideoPlayer from './components/VideoPlayer';
import UploadVideo from './components/UploadVideo';
import Profile from './components/Profile';
import WathchHistory from './components/WathchHistory';
import ChangePassword from './components/UserUpdate/ChangePassword';
import CoverImageForm from './components/UserUpdate/ChangeCoverImage';
import UpdateAccountForm from './components/UserUpdate/ChangeAccountDetail';
import AvatarForm from './components/UserUpdate/ChangeAvatar';
import LikedVideo from './components/LikedVideos';
import UpdateVideo from './components/UpdateVideo';
import Subscriptions from './components/SubscribedChannels';
import Subscribers from './components/Subscribers';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="flex flex-col">
          {/* Header should remain at the top */}
          <Header />
          
          {/* Main content will go here */}
          <div className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/video/:id" element={<VideoPlayer />} />
              <Route path="/upload" element={<UploadVideo />} />
              <Route path="/profile/:id" element={<Profile />} />
              <Route path="/history" element={<WathchHistory />} />
              <Route path="/change-coverImage" element={<CoverImageForm />} />
              <Route path="/change-avatar" element={<AvatarForm />} />
              <Route path="/change-profile" element={<UpdateAccountForm />} />
              <Route path="/change-password" element={<ChangePassword />} />
              <Route path="/liked-videos" element={<LikedVideo />} />
              <Route path="/update-video/:id" element={<UpdateVideo />} />
              <Route path="/subscriptions" element={<Subscriptions />} />
              <Route path="/subscribers" element={<Subscribers />} />
            </Routes>
          </div>
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;
