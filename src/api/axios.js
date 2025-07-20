import axios from 'axios';

const api = axios.create({
  baseURL:"https://api-youtube-134a.onrender.com",
  //baseURL:"http://localhost:8000",
  withCredentials: true, // only if you're using cookies
});

export default api;