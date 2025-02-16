import { useState, useRef, useEffect } from "react";
import { FaMicrophone, FaStop, FaPaperPlane, FaPlus, FaSpinner } from "react-icons/fa";
import { useFetchChatHistory, useSendMessage,useSendVoiceMessage } from "../hooks/useChat";
import { useLogout } from "../hooks/useLogout";
import useChatStore from "../store/chatStore";

function Dashboard() {
  const { chatHistory, setChatHistory, selectedChat, setSelectedChat, responseType, setResponseType, loading } =
    useChatStore();
    const [prompt, setPrompt] = useState("");


  const { mutate: sendMessage } = useSendMessage(setPrompt);
  const {mutate:sendVoiceMessage}=useSendVoiceMessage()
  const { data: chatHistoryData } = useFetchChatHistory();
  const { mutate: logout } = useLogout();
  const [isListening, setIsListening] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const mediaRecorderRef = useRef(null);

  useEffect(() => {
    if (chatHistoryData) {
      setChatHistory(chatHistoryData);
    }
  }, [chatHistoryData, setChatHistory]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!prompt.trim() && !audioBlob) return;

    if (audioBlob) {
      const file = new File([audioBlob], "audio.ogg", { type: "audio/ogg" });
      sendVoiceMessage(file);
      setAudioBlob(null);
    } else {
      sendMessage({ message: prompt, responseFormat: responseType });
    }
  };

  const startListening = () => {
    navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      let chunks = [];

      mediaRecorder.ondataavailable = (e) => chunks.push(e.data);
      mediaRecorder.onstop = () => {
        setAudioBlob(new Blob(chunks, { type: "audio/ogg; codecs=opus" }));
      };

      mediaRecorder.start();
      setIsListening(true);
    });
  };

  const stopListening = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsListening(false);
    }
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
      {/* Sidebar */}
      <div className="w-64 bg-gray-900 shadow-lg flex flex-col">
        <div className="p-4 border-b border-gray-800">
          <h2 className="text-xl font-semibold text-gray-200">Chats</h2>
        </div>
        <div className="flex-1 overflow-y-auto">
          {chatHistory.map((chat) => (
            <div
              key={chat.id}
              className={`p-3 hover:bg-gray-800 cursor-pointer transition-colors duration-150 ${
                selectedChat && selectedChat.id === chat.id ? "bg-gray-800" : ""
              }`}
              onClick={() => setSelectedChat(chat)}
            >
              {chat.title}
            </div>
          ))}
        </div>
        <button
          onClick={() => setSelectedChat(null)}
          className="m-4 p-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors duration-150 flex items-center justify-center"
        >
          <FaPlus className="mr-2" /> New Chat
        </button>
      </div>

      {/* Main Chat Area */}
      <div className="flex flex-1 flex-col">
        <header className="bg-gray-800 p-4 shadow-md flex justify-between">
          <h1 className="text-2xl font-bold text-gray-200">AI Chat Dashboard</h1>
          <button onClick={logout} className="bg-red-600 px-4 py-2 rounded-md text-white hover:bg-red-700">
            Logout
          </button>
        </header>

        <main className="flex-1 overflow-y-auto p-4">
          <div className="mb-4">
            <label className="text-sm text-gray-200">Response Type</label>
            <select
              value={responseType}
              onChange={(e) => setResponseType(e.target.value)}
              className="bg-gray-700 text-white rounded-md p-2"
            >
              <option value="text-to-text">Text to Text</option>
              <option value="text-to-voice">Text to Voice</option>
              <option value="voice-to-text">Voice to Text</option>
              <option value="voice-to-voice">Voice to Voice</option>
            </select>
          </div>

          <form onSubmit={handleSendMessage} className="mb-4 flex space-x-2">
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="flex-1 bg-gray-700 text-white rounded-md p-2"
              placeholder="Enter your prompt"
            />
            {responseType.startsWith("voice") && (
              <button
                type="button"
                onClick={isListening ? stopListening : startListening}
                className={`rounded-md p-2 text-white ${
                  isListening ? "bg-red-600" : "bg-green-600"
                }`}
              >
                {isListening ? <FaStop /> : <FaMicrophone />}
              </button>
            )}
            <button type="submit" className="bg-indigo-600 px-4 py-2 rounded-md text-white flex items-center">
              {loading ? <FaSpinner className="animate-spin mr-2" /> : <FaPaperPlane />}
            </button>
          </form>

          {/* Chat Messages */}
          <div className="rounded-lg bg-gray-800 p-4 shadow-lg h-[400px] overflow-y-auto">
            <h2 className="mb-4 text-xl font-semibold text-gray-200">Chat</h2>
            <div className="space-y-4">
              {selectedChat ? (
                selectedChat.messages.map((message) => (
                  <div
                    key={message.id}
                    className={`rounded-lg p-3 ${
                      message.type === "user" ? "bg-indigo-600 ml-auto" : "bg-gray-700"
                    } max-w-[80%] break-words`}
                  >
                    {message.text}
                  </div>
                ))
              ) : (
                <p className="text-gray-400">Select a chat or start a new one</p>
              )}
              {loading && (
                <div className="text-gray-400 flex items-center">
                  <FaSpinner className="animate-spin mr-2" /> Generating response...
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Dashboard;
