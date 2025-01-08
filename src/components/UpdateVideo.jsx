// UpdateVideo.js
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

function UpdateVideo() {
    const { id } = useParams();
    const navigate = useNavigate();
    
    const [thumbnail, setThumbnail] = useState(null);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false); // Loading state

    const handleFileChange = (event) => {
        setThumbnail(event.target.files[0]);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true); // Set loading to true when starting the update

        const formData = new FormData();
        formData.append('thumbnail', thumbnail);
        formData.append('title', title);
        formData.append('description', description);

        try {
            const response = await axios.patch(`/api/v1/videos/${id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            console.log('Success:', response.data);
            // Redirect to home page after successful update
            navigate("/");
        } catch (error) {
            console.error('Error updating video:', error);
            // Optionally show an error message
        } finally {
            setLoading(false); // Reset loading state
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 relative">
            <div className="absolute inset-0 bg-cover bg-center filter blur-sm" style={{ backgroundImage: "url('your-background-image.jpg')" }} />
            <div className="relative bg-white bg-opacity-90 rounded-lg shadow-lg p-8 max-w-sm w-full z-10">
                <h2 className="text-xl font-semibold text-center mb-4">Update Video</h2>
                <form onSubmit={handleSubmit}>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        required
                        className="block w-full p-2 mb-4 border border-gray-300 rounded"
                    />
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Video Title"
                        required
                        className="block w-full p-2 mb-4 border border-gray-300 rounded"
                    />
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Video Description"
                        required
                        className="block w-full p-2 mb-4 border border-gray-300 rounded"
                    />
                    <button
                        type="submit"
                        className="w-full p-2 bg-blue-600 text-white rounded hover:bg-blue-500 transition duration-200"
                        disabled={loading} // Disable button while loading
                    >
                        {loading ? (
                            <span className="flex items-center justify-center">
                                <svg
                                    className="animate-spin h-5 w-5 mr-2 text-white"
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                >
                                    <circle
                                        className="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                    />
                                    <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8v8H4z"
                                    />
                                </svg>
                                Updating...
                            </span>
                        ) : (
                            'Update'
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default UpdateVideo;
