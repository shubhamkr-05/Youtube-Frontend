import React, { useState, useContext, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../AuthContext';

const Header = ({ searchQuery, setSearchQuery, handleSearch }) => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleOptionClick = (path) => {
    setDropdownOpen(false);
    navigate(path);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownOpen]);

  return (
    <header className="bg-[#181818] text-white p-4 fixed top-0 left-0 right-0 z-50">
      <div className="container mx-auto flex justify-between items-center flex-wrap">
        <Link to="/" className="flex items-center">
          <img src="/youtube-color-svgrepo-com.svg" alt="YouTube Logo" className="w-8 h-8 mr-2" />
          <h1 className="text-2xl text-red-800 font-bold">YouTube</h1>
        </Link>
        <form className="flex-grow mx-2 sm:mx-10 lg:mx-40" onSubmit={handleSearch}>
          <div className="relative flex items-center w-full">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full p-2 pl-4 pr-12 rounded-full border border-gray-300 focus:outline-none focus:border-blue-500 text-black"
              placeholder="Search"
            />
            <button
              type="submit"
              className="absolute right-4 text-gray-500 hover:text-black"
            >
              🔍
            </button>
          </div>
        </form>

        <nav className="flex items-center">
          {user ? (
            <div className="relative" ref={dropdownRef}>
              <div
                className="flex items-center cursor-pointer"
                onClick={toggleDropdown}
              >
                <img
                  src={user.data.user.avatar || 'https://via.placeholder.com/40'}
                  className="w-10 h-10 rounded-full"
                  alt="User Avatar"
                />
                <button
                  onClick={() => navigate('/upload')}
                  className="ml-4 text-gray-400 hover:text-white"
                  title="Upload Video"
                >
                  ➕
                </button>
                <button
                  onClick={logout}
                  className="ml-4 text-red-500"
                >
                  Logout
                </button>
              </div>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white text-black rounded shadow-lg z-50">
                  <ul>
                    <li
                      className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
                      onClick={() => handleOptionClick(`/profile/${user.data.user._id}`)}
                    >
                      View Profile
                    </li>
                    <li
                      className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
                      onClick={() => handleOptionClick('/change-profile')}
                    >
                      Update Account Detail
                    </li>
                    <li
                      className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
                      onClick={() => handleOptionClick('/change-password')}
                    >
                      Update Password
                    </li>
                    <li
                      className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
                      onClick={() => handleOptionClick('/change-avatar')}
                    >
                      Update Avatar
                    </li>
                    <li
                      className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
                      onClick={() => handleOptionClick('/change-coverImage')}
                    >
                      Update Cover Image
                    </li>
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link to="/login" className="px-4 hover:text-orange-600">Login</Link>
              <Link to="/signup" className="px-4 hover:text-orange-600">Signup</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
