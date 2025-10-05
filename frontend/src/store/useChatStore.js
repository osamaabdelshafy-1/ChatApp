import { toast } from "react-hot-toast";
import { create } from "zustand";
import { axiosInstance } from "./../lib/axios";
import { useAuthStore } from "./useAuthStore";

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
  sendMessage: async (formData) => {
    const { selectedUser } = get();
    const { authUser } = useAuthStore.getState();

    if (!selectedUser) {
      toast.error("No user selected");
      return;
    }

    // Extract data from FormData
    const text = formData.get("text");
    const imageFile = formData.get("image"); // This returns a File object

    const tempId = `temp-${Date.now()}`;

    // For optimistic update, create a preview URL if it's an image
    let imagePreview = null;
    if (imageFile instanceof File) {
      imagePreview = URL.createObjectURL(imageFile);
    }

    const optimisticMessage = {
      _id: tempId,
      senderId: authUser._id,
      receiverId: selectedUser._id,
      text: text,
      image: imagePreview, // Use the preview URL for immediate display 
      imageFile: imageFile, // Keep the original file for sending
      createdAt: new Date().toISOString(),
      isOptimistic: true,
    };

    // Add optimistic message
    set((state) => ({
      messages: [...state.messages, optimisticMessage],
    }));

    try {
      const res = await axiosInstance.post(
        `/messages/send/${selectedUser._id}`,
        formData, // Send original FormData with the actual file
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // Replace optimistic message with real message
      set((state) => ({
        messages: [
          ...state.messages.filter((msg) => msg._id !== tempId),
          res.data.data,
        ],
      }));
    } catch (error) {
      // Clean up the object URL to prevent memory leaks
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }

      set((state) => ({
        messages: state.messages.filter((msg) => msg._id !== tempId),
      }));

      toast.error(error.response?.data?.message || "Message failed to send");
    }
  },
}));
