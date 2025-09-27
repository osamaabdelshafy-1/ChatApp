import { create } from "zustand";

export const useAuthStore = create((set) => ({
  authUser: { name: "osama", _id: 22010047, age: 22 },
  isLoggedIn: false,
  login: () => {
    console.log("we  just login");
    set({ isLoggedIn: true });
  },
}));
