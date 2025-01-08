import React, { useEffect, useState } from 'react';
import {useParams} from 'react-router-dom';
import axios from 'axios';
import VideoCard from './VideoCard'; // Import VideoCard component

const Profile = () => {
  const { id } = useParams();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(`/api/v1/users/profile/${id}`);
        setProfileData(response.data.data);
      } catch (err) {
        setError('Error fetching profile data');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) return <div className="text-center">Loading...</div>;
  if (error) return <div className="text-center text-red-500">{error}</div>;

  return (
    <div className="relative bg-cover bg-center h-screen" style={{ backgroundImage: `url(${profileData.coverImage})` }}>
      <div className="bg-black bg-opacity-60 h-full w-full flex flex-col items-center justify-center">
        <div className="flex flex-col items-center mt-10">
          <img
            src={profileData.avatar}
            alt="User Avatar"
            className="w-32 h-32 rounded-full border-4 border-white mb-4"
          />
          <h1 className="text-3xl text-white font-bold">{profileData.username}</h1>
          <h2 className="text-3xl text-white font-bold">{profileData.fullName}</h2>
          <p className="text-gray-300">{profileData.email}</p>
          <p className="text-gray-400">Subscribers: {profileData.subscribers}</p>
          <p className="text-gray-400">Subscribed Channels: {profileData.subscribedChannels.count}</p>
        </div>

        <div className="mt-8 w-full max-w-4xl px-4">
          <h1 className="text-xl text-white text-center font-semibold mb-4">My Videos</h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {profileData.videos.map((video) => (
              <VideoCard 
                key={video._id} 
                id={video._id}
                thumbnail={video.thumbnail}
                title={video.title}
                description={video.description}
                avatar={profileData.avatar || 'https://via.placeholder.com/40'} 
                channelName={profileData.username || 'Unknown'}  
                datePosted={video.createdAt}
                />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
