import { create } from "zustand";

const useChatStore = create((set) => ({
  chatHistory: [],
  selectedChat: null,
  responseType: "text-to-text",
  loading: false,

  setChatHistory: (history) => set({ chatHistory: history }),
  setSelectedChat: (chat) => set({ selectedChat: chat }),
  setResponseType: (type) => set({ responseType: type }),
  setLoading: (status) => set({ loading: status }),
}));

export default useChatStore;
