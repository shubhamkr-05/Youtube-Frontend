import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Dashboard from "./Dashboard";
import axios from "axios";

const Subscriptions = () => {
  const [channels, setChannels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSubscriptions = async () => {
      try {
        const response = await axios.get("/api/v1/subscriptions/c");
        setChannels(response.data.data[0].channels); // Extract channels from response
        setLoading(false);
      } catch (err) {
        setError(
          "Failed to fetch subscribed channels. Please try again later."
        );
        setLoading(false);
      }
    };

    fetchSubscriptions();
  }, []);

  const handleAvatarClick = (id) => {
    navigate(`/profile/${id}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="loader"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h2 className="text-red-600">{error}</h2>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen">
    <div className="flex flex-grow pt-16">
      <Dashboard />
      <div className="min-h-screen flex flex-col items-center  bg-gray-100 py-8 w-full">
        <h1 className="text-3xl font-bold mb-6">Subscribed Channels</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full max-w-4xl">
          {channels.map((channel) => (
            <div
              key={channel._id}
              className="bg-white rounded-lg shadow-md p-4 flex items-center transition-transform duration-300 hover:scale-105 cursor-pointer"
              onClick={() => handleAvatarClick(channel._id)}
            >
              <img
                src={channel.avatar}
                alt={channel.username}
                className="w-16 h-16 rounded-full mr-4"
              />
              <div>
                <h2 className="text-lg font-semibold">{channel.username}</h2>
                <p className="text-gray-500">{channel.fullName}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
    </div>
  );
};

export default Subscriptions;
