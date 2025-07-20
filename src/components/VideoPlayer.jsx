import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef, useContext } from "react";
import { AuthContext } from "../AuthContext";
import ShowError from "./Error";
import api from '../api/axios.js';

const VideoPlayer = () => {
  const { id } = useParams();
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [liked, setLiked] = useState(false);
  const [likedUsers, setLikedUsers] = useState([]); // For liked users
  const [showLikesDropdown, setShowLikesDropdown] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const [comment, setComment] = useState("");
  const [showComments, setShowComments] = useState(false); // New state to toggle comments
  const [comments, setComments] = useState([]); // State to store fetched comments
  const [loadingComments, setLoadingComments] = useState(false); // Loading state for comments
  const [editingCommentId, setEditingCommentId] = useState(null); // To track which comment is being edited
  const [editContent, setEditContent] = useState(""); // To track the content for the comment being edited
  const videoRef = useRef(null);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const response = await api.get(`/api/v1/videos/${id}`);
        setVideo(response.data.data.video);
        setLiked(response.data.data.video.isLiked);
        setSubscribed(response.data.data.video.owner[0]?.isSubscribed);
      } catch (err) {
        setError("Error fetching video");
      } finally {
        setLoading(false);
      }
    };

    fetchVideo();
  }, [id]);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play();
    }
  }, [video]);

  const toggleLike = async () => {
    try {
      if (!user) {
        const currentUrl = window.location.pathname + window.location.search;
        localStorage.setItem("redirectAfterLogin", currentUrl);
        navigate("/login");
      }

      await api.post(`/api/v1/likes/toggle/v/${id}`);
      setLiked((prevLiked) => !prevLiked);
    } catch (error) {
      console.error("Error toggling like:", error);
    }
  };

  const toggleSubscribe = async () => {
    try {
      if (!user) {
        const currentUrl = window.location.pathname + window.location.search;
        localStorage.setItem("redirectAfterLogin", currentUrl);
        navigate("/login");
      }

      await api.post(`/api/v1/subscriptions/c/${video.owner[0]._id}`);
      setSubscribed((prevSubscribed) => !prevSubscribed);
    } catch (error) {
      console.error("Error toggling subscription:", error);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!user) {
        const currentUrl = window.location.pathname + window.location.search;
        localStorage.setItem("redirectAfterLogin", currentUrl);
        navigate("/login");
      }

      await api.post(`/api/v1/comments/${id}`, { content: comment });
      setComment(""); // Clear the input after successful submission
      fetchComments(); // Fetch comments again after posting
    } catch (error) {
      console.error("Error posting comment:", error);
    }
  };

  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this video?"
    );
    if (!confirmDelete) return;

    setDeleting(true);
    try {
      await api.delete(`/api/v1/videos/${id}`);
      navigate("/"); // Redirect to home page after deletion
    } catch (error) {
      console.error("Error deleting video:", error);
      setError("Error deleting video. Please try again.");
    } finally {
      setDeleting(false);
    }
  };

  const fetchComments = async () => {
    setLoadingComments(true);
    try {
      const response = await api.get(`/api/v1/comments/${id}`);
      setComments(response.data.data);
    } catch (error) {
      console.error("Error fetching comments:", error);
    } finally {
      setLoadingComments(false);
    }
  };

  const toggleComments = () => {
    setShowComments((prevShowComments) => {
      if (!prevShowComments) {
        fetchComments(); // Fetch comments when expanding
      }
      return !prevShowComments;
    });
  };

  const handleDeleteComment = async (commentId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this comment?"
    );
    if (!confirmDelete) return;

    try {
      await api.delete(`/api/v1/comments/c/${commentId}`);
      fetchComments(); // Refresh comments after deletion
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  const handleUpdateComment = async (commentId) => {
    try {
      await api.patch(`/api/v1/comments/c/${commentId}`, {
        content: editContent,
      });
      setEditingCommentId(null); // Stop editing mode
      fetchComments(); // Refresh comments after update
    } catch (error) {
      console.error("Error updating comment:", error);
    }
  };

  const fetchLikedUsers = async () => {
    try {
      const response = await api.get(
        `/api/v1/likes/likedByUsers/${video._id}`
      );
      setLikedUsers(response.data.data.users);
      setShowLikesDropdown((prevState) => !prevState); // Toggle dropdown
    } catch (error) {
      console.error("Error fetching liked users:", error);
    }
  };

  // Close dropdown when clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowLikesDropdown(false); // Close the dropdown
      }
    };

    // Add event listener
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      // Remove event listener when component unmounts
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="video-player p-4 md:max-w-4xl mx-auto mt-10">
      <video
        ref={videoRef}
        controls
        width="100%"
        className="rounded-lg mb-4 mt-10"
        src={video?.videoFile}
        style={{ objectFit: "cover" }}
      ></video>
      <h2 className="text-3xl font-bold mb-2">{video?.title}</h2>
      <p className="text-gray-700 mb-4">{video?.description}</p>

      {/* Owner Info */}
      {video?.owner && video.owner.length > 0 ? (
        <div className="owner-info flex items-center mb-4">
          <img
            onClick={() => navigate(`/profile/${video.owner[0]._id}`)}
            src={video.owner[0].avatar}
            alt={video.owner[0].username}
            width="50"
            className="rounded-full mr-3 cursor-pointer"
          />
          <div>
            <p className="font-semibold">{video.owner[0].username}</p>
            <p className="text-gray-600">
              Posted on: {new Date(video.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      ) : (
        <p>Owner information not available</p>
      )}

      <p className="text-gray-500">Views: {video?.views}</p>
      <span className="text-gray-500 cursor-pointer" onClick={fetchLikedUsers}>
        Likes: {video?.likesCount}
      </span>
      <br />

      {/* Dropdown for liked users */}
      {showLikesDropdown && (
        <div
          ref={dropdownRef}
          className="absolute bg-white shadow-lg rounded-lg mt-2 p-4 z-10"
        >
          {likedUsers.length > 0 ? (
            likedUsers.map(
              (user) =>
                user && (
                  <div
                    key={user._id}
                    className="flex items-center mb-2 cursor-pointer"
                    onClick={() => navigate(`/profile/${user._id}`)}
                  >
                    <img
                      src={user.avatar}
                      alt={user.username}
                      className="w-8 h-8 rounded-full mr-3"
                    />
                    <div>
                      <p className="font-semibold">{user.username}</p>
                      <p className="text-sm text-gray-600">{user.fullName}</p>
                    </div>
                  </div>
                )
            )
          ) : (
            <p className="text-gray-500">No likes yet.</p>
          )}
        </div>
      )}

      {/* Like Button */}
      <button
        onClick={toggleLike}
        className={`px-4 py-2 rounded ${
          user
            ? liked
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-gray-600"
            : "bg-gray-200 text-gray-600"
        }`}
      >
        {liked ? "Liked" : "Like"}
      </button>

      {/* Subscribe Button */}
      {(!user || video.owner[0]._id !== user._id) && (<button
        onClick={toggleSubscribe}
        className={`ml-4 px-4 py-2 rounded ${
          user
            ? subscribed
              ? "bg-green-500 text-white"
              : "bg-gray-200 text-gray-600"
            : "bg-gray-200 text-gray-600"
        }`}
      >
        {subscribed ? "Subscribed" : "Subscribe"}
      </button>)}

      {/* Comments Toggle Button */}
      <button
        onClick={toggleComments}
        className="ml-4 px-4 py-2 bg-gray-200 text-gray-600 rounded-lg mt-4"
      >
        {showComments ? "Hide Comments" : "Show Comments"}
      </button>

      {/* Comments Section */}
      {showComments && (
        <div className="mt-4 bg-gray-100 p-4 rounded-lg">
          {loadingComments ? (
            <p>Loading comments...</p>
          ) : comments.length > 0 ? (
            <ul>
              {comments.map((comment, index) => (
                <li key={index} className="mb-4 flex items-start">
                  <img
                    onClick={() => navigate(`/profile/${comment?.owner?._id}`)}
                    src={comment?.owner?.avatar}
                    alt={comment?.owner?.username}
                    className="w-10 h-10 rounded-full mr-3 cursor-pointer"
                  />

                  <div>
                    <p className="font-bold">{comment?.owner?.username}</p>
                    {editingCommentId === comment._id ? (
                      <>
                        <textarea
                          value={editContent}
                          onChange={(e) => setEditContent(e.target.value)}
                          className="w-full p-2 border border-gray-300 rounded-lg"
                        ></textarea>
                        <div className="flex justify-end mt-2">
                          <button
                            onClick={() => handleUpdateComment(comment._id)}
                            className="px-4 py-2 bg-blue-600 text-white rounded"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditingCommentId(null)}
                            className="ml-2 px-4 py-2 bg-gray-300 rounded"
                          >
                            Cancel
                          </button>
                        </div>
                      </>
                    ) : (
                      <>
                        <p>{comment.content}</p>
                        <p className="text-sm text-gray-500">
                          {new Date(comment.createdAt).toLocaleString()}
                        </p>

                        {comment?.owner?._id === user?._id && (
                          <div className="flex justify-end">
                            <button
                              onClick={() => {
                                setEditingCommentId(comment._id);
                                setEditContent(comment.content);
                              }}
                              className="text-blue-500 mr-2"
                            >
                              Update
                            </button>
                            <button
                              onClick={() => handleDeleteComment(comment._id)}
                              className="text-red-500"
                            >
                              Delete
                            </button>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p>No comments yet.</p>
          )}
        </div>
      )}


      {/* Comment Form */}
      <form
        onSubmit={handleCommentSubmit}
        className="mt-4 bg-white shadow-lg rounded-lg p-4"
      >
        <div className="flex items-start mb-4">
          <img
            onClick={() => navigate(`/profile/${user?._id}`)}
            src={user?.avatar}
            alt={user?.username}
            className="w-10 h-10 rounded-full mr-4 cursor-pointer"
          />
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Add a comment..."
            className="w-full p-3 border border-gray-200 rounded-full resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows="1"
          ></textarea>
        </div>
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          >
            Post Comment
          </button>
        </div>
      </form>

      {/* Delete Option */}
      {user && video?.owner && video.owner[0]._id === user._id && (
        <div className="mt-4">
          <button
            onClick={handleDelete}
            className="bg-red-500 text-white px-4 py-2 rounded"
            disabled={deleting}
          >
            {deleting ? (
              <div className="loader border-t-4 border-white border-solid rounded-full w-6 h-6 animate-spin"></div>
            ) : (
              "Delete"
            )}
          </button>
        </div>
      )}

      {/* Update Option */}
      {user && video?.owner && video.owner[0]._id === user._id && (
        <div className="mt-4">
          <button
            onClick={() => navigate(`/update-video/${id}`)}
            className="bg-red-500 text-white px-4 py-2 rounded"
          >
            Update Video
          </button>
        </div>
      )}

      {error && ShowError()}
    </div>
  );
};

export default VideoPlayer;
