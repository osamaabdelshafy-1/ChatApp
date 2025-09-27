import toast from "react-hot-toast";
import { create } from "zustand";
import { axiosInstance } from "../lib/axios";

export const useAuthStore = create((set) => ({
  authUser: null,
  isCheckingAuth: true, //this is for the loaderIcon
  isSigningUp: false,
  isLoggingIn: false,
  checkAuth: async () => {
    try {
      //we don't need to set the full http link of path because we set it in configuration on axios
      const res = await axiosInstance.get("/auth/check"); //only set the route
      set({ authUser: res.data });
    } catch (error) {
      console.log("you are not authorized", "Error in authCheck:", error);

      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signUp: async (data) => {
    set({ isSigningUp: true });
    try {
      const res = await axiosInstance.post("/auth/signup", data);
      set({ authUser: res.data });
      toast.success("Account create successfully!");
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isSigningUp: false });
    }
  },
  logIn: async (data) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstance.post("/auth/login", data);
      set({ authUser: res.data });
      toast.success("Login successfully!");
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isLoggingIn: false });
    }
  },
  logOut: async () => {
    try {
      await axiosInstance.post("auth/logout");
      toast.success("Logged out successfully");
      set({ authUser: null });
    } catch (error) {
      toast.error("Error on logging out operation");
      console.log(error.response.data.message);
    }
  },
}));
