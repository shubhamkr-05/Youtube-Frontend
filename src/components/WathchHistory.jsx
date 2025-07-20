import React, { useState, useEffect } from "react";
import api from '../api/axios.js';
import VideoCard from "./VideoCard";
import Dashboard from "./Dashboard";

const WatchHistory = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await api.get("api/v1/users/history");
        setVideos(response.data?.data || []);
      } catch (err) {
        setError("Failed to fetch watch history.");
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg font-semibold">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h2 className="text-red-600 text-xl">{error}</h2>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen">
      <div className="flex flex-grow pt-16 min-h-screen">
        <Dashboard />
        <div className="flex-grow w-full">
          <h1 className="text-3xl font-bold text-center text-gray-800 mt-6 mb-8">
            Your Watch History
          </h1>

          {videos.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mx-5">
              {videos.map((video) => (
                <VideoCard
                  key={video._id}
                  id={video._id}
                  ownerId={video.owner._id}
                  thumbnail={video.thumbnail}
                  title={video.title}
                  description={video.description}
                  avatar={video.owner?.avatar || "https://via.placeholder.com/40"}
                  channelName={video.owner?.username || "Unknown"}
                  datePosted={video.createdAt}
                />
              ))}
            </div>
          ) : (
            <p className="text-xl text-center text-gray-600 mt-24">
              No videos found in your history.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default WatchHistory;
