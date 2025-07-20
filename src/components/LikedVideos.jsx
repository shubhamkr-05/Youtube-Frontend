import React, { useState, useEffect } from "react";
import api from '../api/axios.js';
import VideoCard from "./VideoCard";
import Dashboard from "./Dashboard";

const LikedVideo = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await api.get("api/v1/likes/videos");
        setVideos(response.data.data.Videos || []);
      } catch (err) {
        setError("Failed to fetch liked videos.");
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  if (loading) {
    return <p className="text-center mt-20 text-xl">Loading...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500 mt-20 text-xl">{error}</p>;
  }

  return (
    <div className="flex flex-col h-screen">
      <div className="flex flex-grow pt-16">
        <Dashboard />
        <div className="flex-grow">
          <h1 className="text-3xl font-bold text-center text-gray-800 mt-6 mb-8">
            Your Liked Videos
          </h1>

          {videos.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mx-5">
              {videos.map((video) => (
                <VideoCard
                  key={video.video._id}
                  id={video.video._id}
                  ownerId={video.video.owner._id}
                  thumbnail={video.video.thumbnail}
                  title={video.video.title}
                  description={video.video.description}
                  avatar={
                    video.video.owner?.avatar ||
                    "https://via.placeholder.com/40"
                  }
                  channelName={video.video.owner?.username || "Unknown"}
                  datePosted={video.video.createdAt}
                />
              ))}
            </div>
          ) : (
            <h1 className="text-2xl font-semibold text-center text-gray-600 mt-40 mb-8">
              You haven’t liked any videos yet.
            </h1>
          )}
        </div>
      </div>
    </div>
  );
};

export default LikedVideo;
