import React, { useState, useEffect } from "react";
import axios from "axios";
import VideoCard from "./VideoCard";
import Dashboard from "./Dashboard";

const WatchHistory = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await axios.get("api/v1/users/history");
        setVideos(response.data.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch watch history");
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="flex flex-col h-screen">
    <div className="flex flex-grow pt-16  min-h-screen">
      <Dashboard />

      <div>
        <h1 className="text-3xl font-bold text-center text-gray-800 mt-6 mb-8">
          Your Watch History
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mx-5">
          {videos.length > 0 ? (
            videos.map((video) => (
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
            ))
          ) : (
            <h1 className="text-4xl font-bold text-center text-red-800 mt-40 mb-8">
              No videos found in your History!
            </h1>
          )}
        </div>
      </div>
    </div>
    </div>
  );
};

export default WatchHistory;
