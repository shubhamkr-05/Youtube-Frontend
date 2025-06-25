import axios from 'axios';

const api = axios.create({
  baseURL:"https://api-youtube-134a.onrender.com/",
  withCredentials: true, // only if you're using cookies
});

export default api;