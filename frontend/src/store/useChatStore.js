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
  isSoundEnabled: localStorage.getItem("isSoundEnabled") === true,

  toggleSound: () => {
    localStorage.setItem("isSoundEnabled", !get().isSoundEnabled);
    set({ isSecureContext: !get().isSoundEnabled });
  },
  setActiveTab: (tab) => set({ activeTab: tab }),
  setSelectedUser: (selectedUser) => set({ selectedUser }),

  getAllContacts: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/messages/contacts");
      set({ allContacts: res.data });
    } catch (error) {
      toast.error(" Error: ", error.response.data.message);
      console.log("error is happing on users loading");
    } finally {
      set({ isUsersLoading: false });
    }
  },
  getMYChatsPartners: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/messages/chats");
      set({ chats: res.data });
    } catch (error) {
      toast.error(" Error: ", error.response.data.message);
    } finally {
      set({ isUsersLoading: false });
    }
  },
}));
