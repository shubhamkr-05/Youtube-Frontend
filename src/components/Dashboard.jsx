import React, { useContext } from 'react';
import { useNavigate, NavLink, useLocation } from 'react-router-dom';
import { AuthContext } from '../AuthContext';

const Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useContext(AuthContext);

  const handleNavClick = (path) => {
    if (!user) {
      localStorage.setItem("redirectAfterLogin", path);
      navigate("/login");
    } else {
      navigate(path);
    }
  };

  return (
    <aside className="w-64 bg-[#181818] text-white h-full p-4">
      <h2 className="text-xl font-bold mb-6">Dashboard</h2>
      <nav>
        <ul>
          <li className="mb-2  text-xl ">
            <NavLink 
              to="/" 
              className={({ isActive }) => 
                isActive ? 'px-4 text-orange-500 ' : 'px-4 text-whitehover:bg-gray-700 rounded'
              }
            >
              Home
            </NavLink>
          </li>
          <li className="mb-2  text-xl">
            <button 
              onClick={() => handleNavClick("/history")}
              className={`px-4 w-full text-left ${location.pathname === "/history" ? "text-orange-500" : "text-white hover:bg-gray-700 "} rounded`}
            >
              Watch History
            </button>
          </li>
          <li className="mb-2 text-xl">
            <button 
              onClick={() => handleNavClick("/liked-videos")}
              className={`px-4 w-full text-left ${location.pathname === "/liked-videos" ? "text-orange-500" : "text-white hover:bg-gray-700"} rounded`}
            >
              Liked Videos
            </button>
          </li>
          <li className="mb-2 text-xl">
            <button 
              onClick={() => handleNavClick("/subscriptions")}
              className={`px-4 w-full text-left ${location.pathname === "/subscriptions" ? "text-orange-500" : "text-white hover:bg-gray-700"} rounded`}
            >
              Subscriptions
            </button>
          </li>
          <li className="mb-2 text-xl">
            <button 
              onClick={() => handleNavClick("/subscribers")}
              className={`px-4 w-full text-left ${location.pathname === "/subscribers" ? "text-orange-500" : "text-white hover:bg-gray-700 "} rounded`}
            >
              Subscribers
            </button>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default Dashboard;
