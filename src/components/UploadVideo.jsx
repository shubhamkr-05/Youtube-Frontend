import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const UploadVideo = () => {
  const [videoFile, setVideoFile] = useState(null);
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false); // Loading state
  const navigate = useNavigate();

  const handleVideoChange = (e) => {
    setVideoFile(e.target.files[0]);
  };

  const handleThumbnailChange = (e) => {
    setThumbnailFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!videoFile || !thumbnailFile || !title || !description) {
      setErrorMessage('Please fill all the fields before submitting.');
      return;
    }

    const formData = new FormData();
    formData.append('videoFile', videoFile);
    formData.append('thumbnail', thumbnailFile);
    formData.append('title', title);
    formData.append('description', description);

    setLoading(true); // Start loading spinner

    try {
      await axios.post('/api/v1/videos/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      navigate('/'); // Redirect to home or another page after successful upload
    } catch (error) {
      console.error('Error uploading video:', error);
      setErrorMessage('Error uploading video. Please try again.');
    } finally {
      setLoading(false); // Stop loading spinner
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      {/* Blurred background */}
      <div className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-md"></div>

      {/* Modal container */}
      <div className="relative bg-white p-8 rounded-lg shadow-lg w-full max-w-md mx-auto z-10">
        <h1 className="text-2xl font-bold mb-6">Upload a New Video</h1>
        {errorMessage && <div className="text-red-500 mb-4">{errorMessage}</div>}

        {loading ? (
          <div className="flex justify-center items-center">
            {/* Spinning Circle */}
            <div className="loader border-t-4 border-blue-500 border-solid rounded-full w-16 h-16 animate-spin"></div>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-lg font-semibold mb-2">Video File</label>
              <input
                type="file"
                accept="video/*"
                onChange={handleVideoChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-lg font-semibold mb-2">Thumbnail</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleThumbnailChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-lg font-semibold mb-2">Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-2 border rounded"
                placeholder="Enter video title"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-lg font-semibold mb-2">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-2 border rounded"
                placeholder="Enter video description"
                required
              />
            </div>
            <div className="flex justify-between">
              <button
                type="button"
                onClick={() => navigate('/')}
                className="bg-gray-300 text-black px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                Upload
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default UploadVideo;
