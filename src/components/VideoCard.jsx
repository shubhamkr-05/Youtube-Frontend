import React from 'react';
import { useNavigate } from 'react-router-dom';

const VideoCard = ({ id, thumbnail, ownerId, title, description, avatar, channelName, datePosted }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/video/${id}`);
  };

  const visitProfile = () => {
    navigate(`/profile/${ownerId}`);
  };


  return (
    <div 
      className="max-w-sm bg-white rounded-lg shadow-md overflow-hidden 
                 transition-transform duration-300 transform hover:scale-105 
                 hover:shadow-lg cursor-pointer"
    >
      <img 
        src={thumbnail} 
        alt={title} 
        className="w-full h-48 object-cover" 
        onClick={handleClick} 
      />

      <div className="p-4" onClick={visitProfile}>
        <div className="flex items-start mb-3">
          <img
            src={avatar}
            alt={channelName}
            className="w-10 h-10 rounded-full mr-4"
          />
          <div className="flex-1">
            <h3 
              onClick={handleClick} 
              className="text-lg font-bold line-clamp-2 cursor-pointer hover:text-blue-600"
            >
              {title}
            </h3>
            <p 
              onClick={visitProfile} 
              className="text-sm text-gray-600 cursor-pointer hover:text-blue-600"
            >
              {channelName}
            </p>
            <p 
              onClick={handleClick} 
              className="text-sm text-gray-500 line-clamp-2 cursor-pointer"
            >
              {description}
            </p>
            <p className="text-xs text-gray-400 mt-1">{new Date(datePosted).toLocaleDateString()}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoCard;
