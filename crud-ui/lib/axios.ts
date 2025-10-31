import axios from 'axios'
import { decryptToken } from './crypto'

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use(
  (config) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null
    if (token) {
      // Decrypt the token before setting the header
      const decryptedToken = decryptToken(token)
      config.headers = config.headers || {}
      config.headers['Authorization'] = `Bearer ${decryptedToken}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response.status === 401) {
            localStorage.removeItem("auth_token");
            localStorage.removeItem("auth_user");
        }
        return Promise.reject(error);
    }
);


export default api
