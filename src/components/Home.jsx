import React, { useState, useEffect } from 'react';
import VideoCard from './VideoCard';
import Dashboard from './Dashboard';  
import Header from './Header';        
import '../styles/custom.css'
import api from '../api/axios.js';

const Home = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState(''); 

  const fetchVideos = async (query = '') => {
    try {
      setLoading(true);
      const response = await api.get('/api/v1/videos', {
        params: { 
          page: 1,
          limit: 20,
          query: query.trim()
        },
      });
      setVideos(response.data.data || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching videos:', err); 
      setError('Error fetching videos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchVideos(searchQuery); 
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="flex flex-col h-screen">
      <Header 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        handleSearch={handleSearch} 
      />

      <div className="flex flex-grow pt-16 ">
        <Dashboard />

        <main className="flex-grow bg-gray-100 p-6 overflow-y-auto ">
          <h2 className="text-2xl font-bold mb-6">Recommended Videos</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {videos.map((video) => (
              <VideoCard
                key={video._id}
                id={video._id}
                ownerId = {video.owner._id}
                thumbnail={video.thumbnail}
                title={video.title}
                description={video.description}
                avatar={video.owner?.avatar || 'https://via.placeholder.com/40'} 
                channelName={video.owner?.username || 'Unknown'} 
                datePosted={video.createdAt}
              />
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Home;
