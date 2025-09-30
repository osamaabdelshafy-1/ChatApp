import toast from "react-hot-toast";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { axiosInstance } from "../lib/axios";

export const useAuthStore = create(
  persist(
    (set, get) => ({
      authUser: null,
      isCheckingAuth: true,
      isSigningUp: false,
      isLoggingIn: false,
      isUpdatingProfileImage: false,
      checkAuth: async () => {
        try {
          const res = await axiosInstance.get("/auth/check");
          const data = res.data;

          // Use consistent data structure - adjust based on your API response
          set({ authUser: data.data || data }); // Handle both structures
          return data;
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
          toast.success("Login successful!");
          return userData;
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
        } catch (error) {
          console.error("Logout error:", error);
          set({ authUser: null });
          toast.error("Logged out (with minor issue)");
        }
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
