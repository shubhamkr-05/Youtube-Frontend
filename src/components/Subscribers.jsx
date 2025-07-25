import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Dashboard from "./Dashboard";
import api from '../api/axios.js';

const Subscribers = () => {
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSubscribers = async () => {
      try {
        const response = await api.get("/api/v1/subscriptions/u");
        const data = response.data?.data || [];
        const subs = data.length > 0 ? data[0]?.subscribers || [] : [];
        setSubscribers(subs);
      } catch (err) {
        setError("Failed to fetch subscribers. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchSubscribers();
  }, []);

  const handleAvatarClick = (id) => {
    navigate(`/profile/${id}`);
  };

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
      <div className="flex flex-grow pt-16">
        <Dashboard />
        <div className="min-h-screen flex flex-col items-center bg-gray-100 py-8 w-full">
          <h1 className="text-3xl font-bold mb-6">Subscribers</h1>

          {subscribers.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full max-w-4xl">
              {subscribers.map((subscriber) => (
                <div
                  key={subscriber._id}
                  className="bg-white rounded-lg shadow-md p-4 flex items-center transition-transform duration-300 hover:scale-105 cursor-pointer"
                  onClick={() => handleAvatarClick(subscriber._id)}
                >
                  <img
                    src={subscriber.avatar || "https://via.placeholder.com/64"}
                    alt={subscriber.username}
                    className="w-16 h-16 rounded-full mr-4"
                  />
                  <div>
                    <h2 className="text-lg font-semibold">
                      {subscriber.username}
                    </h2>
                    <p className="text-gray-500">{subscriber.fullName}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xl text-gray-600 mt-24">No subscribers found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Subscribers;
