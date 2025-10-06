import toast from "react-hot-toast";
import { io } from "socket.io-client";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { axiosInstance } from "../lib/axios";

const BASE_URL = //backend-Url           : domain in the deployment
  import.meta.env.MODE === "development" ? "http://localhost:3000" : "/";

export const useAuthStore = create(
  persist(
    (set, get) => ({
      authUser: null,
      isCheckingAuth: true,
      isSigningUp: false,
      isLoggingIn: false,
      isUpdatingProfileImage: false,
      socket: null,
      onlineUsersIds: [],
      checkAuth: async () => {
        try {
          const res = await axiosInstance.get("/auth/check");

          // Use consistent data structure - adjust based on your API response
          set({ authUser: res.data.data }); // Handle both structures
          get().connectSocket();
        } catch (error) {
          console.log("Authentication check failed:", error);
          set({ authUser: null });
          return null;
        } finally {
          set({ isCheckingAuth: false });
        }
      },

      signUp: async (formData) => {
        set({ isSigningUp: true });
        try {
          const res = await axiosInstance.post("/auth/signup", formData);
          const userData = res.data.data || res.data; // Consistent structure
          set({ authUser: userData });
          toast.success("Account created successfully!");
          get().connectSocket();

          return userData;
        } catch (error) {
          const errorMessage =
            error.response?.data?.message || "Signup failed. Please try again.";
          toast.error(errorMessage);
          throw error;
        } finally {
          set({ isSigningUp: false });
        }
      },

      logIn: async (formData) => {
        set({ isLoggingIn: true });
        try {
          const res = await axiosInstance.post("/auth/login", formData);
          const userData = res.data.data || res.data; // Consistent structure
          set({ authUser: userData });
          get().connectSocket();
          toast.success("Login successful!");
        } catch (error) {
          const errorMessage =
            error.response?.data?.message || "Login failed. Please try again.";
          toast.error(errorMessage);
          throw error;
        } finally {
          set({ isLoggingIn: false });
        }
      },

      // Add the missing updateProfile function
      updateProfile: async (formData) => {
        set({ isUpdatingProfileImage: true });
        try {
          const res = await axiosInstance.put(
            "/auth/updateProfile",
            formData //file of photo
          );
          const updatedUser = res.data.data || res.data;
          set({ authUser: updatedUser });
          toast.success("Profile updated successfully!");
          return updatedUser;
        } catch (error) {
          const errorMessage =
            error.response?.data?.message || "Profile update failed.";
          toast.error(errorMessage);
          throw error;
        } finally {
          set({ isUpdatingProfileImage: false });
        }
      },

      logOut: async () => {
        try {
          await axiosInstance.post("/auth/logout");
          set({ authUser: null });
          toast.success("Logged out successfully");
          get().disconnectSocket();
        } catch (error) {
          console.error("Logout error:", error);
          set({ authUser: null });
          toast.error("Logged out (with minor issue)");
        }
      },

      connectSocket: () => {
        const { authUser } = get();
        // no authUser or there are a previous connection ,return nothing
        if (!authUser || get().socket?.connected) return;

        const socket = io(BASE_URL, {
          withCredentials: true, //ensure cookies are sent
          autoConnect: true,
          reconnection: true,
          reconnectionAttempts: 5,
          reconnectionDelay: 1000,
        });

        //connect to socket.io server.
        socket.connect();

        //update the state of the socket .
        set({ socket });

        //listen for online users event .
        socket.on("getOnlineUsers", (userIds) => {
          set({ onlineUsersIds: userIds });
        });
      },
      disconnectSocket: () => {
        if (get().socket?.connected) get().socket.disconnect();
      },
      // Helper getters
      isAuthenticated: () => !!get().authUser,
      getUser: () => get().authUser,
    }),

    {
      name: "auth-storage",
      partialize: (state) => ({ authUser: state.authUser }),
    }
  )
);
