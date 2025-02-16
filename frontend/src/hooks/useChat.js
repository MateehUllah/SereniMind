import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchChatHistory, sendMessage, sendVoiceMessage } from "../api/chatApi";
import useChatStore from "../store/chatStore";

export const useFetchChatHistory = () => {
    const setChatHistory = useChatStore((state) => state.setChatHistory);
  
    return useQuery({
      queryKey: ["chatHistory"],
      queryFn: async () => {
        const data = await fetchChatHistory();
        setChatHistory(data);
        return data;
      },
    });
  };
  



export const useSendMessage = (setPrompt) => {
  const queryClient = useQueryClient();
  const setLoading = useChatStore((state) => state.setLoading);
  const setChatHistory = useChatStore((state) => state.setChatHistory);
  const selectedChat = useChatStore((state) => state.selectedChat);

  return useMutation({
    mutationFn: async ({ message, responseFormat }) => {
      setLoading(true);
      const response = await sendMessage({ message, responseFormat });
      return response;
    },
    onSuccess: (response) => {
      setLoading(false);
      setPrompt("");

      const newMessage = { id: Date.now(), text: response.response, type: "ai" };
      const updatedChat = selectedChat
        ? {
            ...selectedChat,
            messages: [...selectedChat.messages, newMessage],
          }
        : {
            id: Date.now(),
            title: response.response.slice(0, 20) || "New Chat",
            messages: [newMessage],
          };

      setChatHistory((prevChats) =>
        selectedChat
          ? prevChats.map((chat) => (chat.id === selectedChat.id ? updatedChat : chat))
          : [...prevChats, updatedChat]
      );

      queryClient.invalidateQueries(["chatHistory"]);
    },
    onError: () => setLoading(false),
  });
};



export const useSendVoiceMessage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: sendVoiceMessage,
    onSuccess: () => {
      queryClient.invalidateQueries(["chatHistory"]);
    },
  });
};
