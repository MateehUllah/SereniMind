import axiosInstance from "./axiosInstance";

export const fetchChatHistory = async () => {
  const response = await axiosInstance.get("/chat/history");
  return response.data.history;
};

export const sendMessage = async ({ message, responseFormat }) => {
  const response = await axiosInstance.post(
    "/chat/",
    {
      user_message: message,
      response_format: responseFormat,
    }
  );
  console.log("response",response)
  return response.data;
};

export const sendVoiceMessage = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await axiosInstance.post("/chat/voice", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};
