import { toast } from "react-hot-toast";
import { create } from "zustand";
import { axiosInstance } from "./../lib/axios";

export const useChatStore = create((set, get) => ({
  allContacts: [],
  chats: [],
  messages: [],
  activeTab: "chats",
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,
  isSoundEnabled: JSON.parse(localStorage.getItem("isSoundEnabled")) === true,

  toggleSound: () => {
    localStorage.setItem("isSoundEnabled", !get().isSoundEnabled);
    set({ isSoundEnabled: !get().isSoundEnabled });
  },
  setActiveTab: (tab) => set({ activeTab: tab }),
  setSelectedUser: (selectedUser) => set({ selectedUser }),

  getAllContacts: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/messages/contacts");
      set({ allContacts: res.data.data || res.data });
    } catch (error) {
      toast.error(" Error: ", error?.response?.data?.message);
      console.log("error is happing on users loading");
    } finally {
      set({ isUsersLoading: false });
    }
  },
  getMYChatsPartners: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/messages/chats");
      set({ chats: res.data.data || res.data });
    } catch (error) {
      toast.error(" Error: ", error?.response?.data?.message);
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getMessagesByUserId: async (userId) => {
    set({ isMessagesLoading: true });

    try {
      const res = await axiosInstance.get(`/messages/${userId}`);
      set({ messages: res.data.data || res.data });
    } catch (error) {
      toast.error("Error on loading messages");
      throw new Error(
        "Error:",
        error.response?.data?.message || "something wrong"
      );
    } finally {
      set({ isMessagesLoading: false });
    }
  },
}));
