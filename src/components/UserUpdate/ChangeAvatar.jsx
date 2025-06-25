import React, { useState } from 'react';
import api from '../../api/axios.js';
import { useNavigate } from 'react-router-dom';

const AvatarForm = () => {
  const [avatarImage, setAvatarImage] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false); // State for loading indicator
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    setAvatarImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!avatarImage) {
      setMessage('Please select an avatar image.');
      return;
    }

    const formData = new FormData();
    formData.append('avatar', avatarImage);

    setLoading(true); // Start loading

    try {
      const response = await api.patch('api/v1/users/avatar', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setMessage('Avatar image updated successfully!');
      // Optionally, you can handle the response here
      setTimeout(() => {
        navigate('/'); // Navigate to home after a short delay
      }, 2000); // Delay for 2 seconds to show success message
    } catch (error) {
      console.error('Error uploading avatar image:', error);
      setMessage('Failed to upload avatar image.');
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <h1 className="text-2xl font-bold text-center mb-6">Upload Avatar</h1>

      <form onSubmit={handleSubmit} className="p-4 border rounded shadow-lg">
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2" htmlFor="avatarImage">
            Avatar
          </label>
          <input
            type="file"
            id="avatarImage"
            name="avatarImage"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={loading} // Disable button while loading
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Uploading...
            </span>
          ) : (
            'Upload Image'
          )}
        </button>
      </form>

      {message && <p className="mt-4 text-center text-red-500">{message}</p>}
    </div>
  );
};

export default AvatarForm;
