import axios from "axios";
import { store } from "@/store/store";

const axiosClient = axios.create({
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

axiosClient.interceptors.request.use((config) => {
  const token = store.getState().auth.accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add response interceptor to handle errors
axiosClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle 401 Unauthorized - redirect to login
    if (error.response?.status === 401) {
      console.log("Unauthorized access, redirecting to login");
      // You can dispatch a logout action here if needed
      // store.dispatch(clearAuth());
    }
    
    // Handle 500 Server Error
    if (error.response?.status === 500) {
      console.error("Server error (500):", error.response?.data);
    }
    
    return Promise.reject(error);
  }
);

// Health check function to test API connectivity
export const checkApiHealth = async () => {
  try {
    const response = await axios.get(`${process.env.NEST_PUBLIC_API_BASE_URL}/health`, {
      timeout: 5000, // 5 second timeout
    });
    return response.status === 200;
  } catch (error) {
    console.error("API health check failed:", error);
    return false;
  }
};

export default axiosClient;
