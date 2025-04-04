import { AuthResponse, IUser } from "../types/user-types";
import axios, { type AxiosInstance } from "axios";
import * as SecureStore from "expo-secure-store";
import Toast from "react-native-toast-message";

const BASE_URL = process.env.EXPO_PUBLIC_API_URL;

// Create a centralized auth token manager
const authTokenManager = {
  getToken: async (): Promise<string | null> => {
    try {
      return await SecureStore.getItemAsync("authToken");
    } catch (error) {
      console.error("Token retrieval error:", error);
      return null;
    }
  },
  setToken: async (token: string): Promise<void> => {
    try {
      await SecureStore.setItemAsync("authToken", token);
    } catch (error) {
      console.error("Token storage error:", error);
      throw error;
    }
  },
  removeToken: async (): Promise<void> => {
    try {
      await SecureStore.deleteItemAsync("authToken");
    } catch (error) {
      console.error("Token removal error:", error);
      throw error;
    }
  },
};

const axiosInstance: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000, // 10 second timeout
  withCredentials: true,
});

// Request interceptor for adding auth token
axiosInstance.interceptors.request.use(async (config) => {
  try {
    const token = await SecureStore.getItemAsync("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch (error) {
    Toast.show({
      type: "error",
      text1: "Authentication Error",
      text2: "Failed to retrieve authentication token",
    });
  }
  return config;
});

// Response interceptor for handling errors
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          Toast.show({
            type: "error",
            text1: "Session Expired",
            text2: "Please login again",
          });
          break;
        case 404:
          Toast.show({
            type: "error",
            text1: "Not Found",
            text2: "The requested resource was not found",
          });
          break;
        case 500:
          Toast.show({
            type: "error",
            text1: "Server Error",
            text2: "Something went wrong on our end",
          });
          break;
        default:
          Toast.show({
            type: "error",
            text1: "Error",
            text2: error.response.data?.message || "An error occurred",
          });
      }
    } else if (error.request) {
      Toast.show({
        type: "error",
        text1: "Network Error",
        text2: "No response received from server",
      });
    } else {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: error.message || "An error occurred",
      });
    }

    return Promise.reject(error);
  }
);

// Auth service functions
export const AuthService = {
  register: async (userData: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phoneNumber?: string;
  }): Promise<AuthResponse> => {
    const response = await axiosInstance.post<AuthResponse>(
      "/auth/register",
      userData
    );
    await SecureStore.setItemAsync("authToken", response.data.user.token);
    return response.data;
  },

  login: async (credentials: {
    email: string;
    password: string;
  }): Promise<AuthResponse> => {
    const response = await axiosInstance.post<AuthResponse>(
      "/auth/login",
      credentials
    );
    if (typeof response.data.user.token !== "string") {
      throw new Error("Invalid token received from server");
    }
    await SecureStore.setItemAsync("authToken", response.data.user.token);
    return response.data;
  },

  logout: async (): Promise<void> => {
    await SecureStore.deleteItemAsync("authToken");
  },

  checkSession: async (): Promise<IUser> => {
    const response = await axiosInstance.get<AuthResponse>(
      "/auth/check-session"
    );
    return response.data.user;
  },
};

export default axiosInstance;
