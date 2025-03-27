import { MessageCircleMore, PartyPopper, SendHorizonal } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import * as signalR from "@microsoft/signalr";
import axios from "axios";

const ChatSupport = ({ nameUser, userId }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState("");
  const connectionRef = useRef(null);

  const handleOpenChat = () => {
    setIsOpen(true);
  };

  useEffect(() => {
    if (isOpen) {
      axios
        .get(`https://localhost:44304/api/Chat/${userId}`)
        .then((res) => {
          setMessages(
            res.data.$values.map((msg) => ({
              user: msg.senderId === userId ? nameUser : "admin",
              message: msg.message,
              time: msg.time,
            }))
          );
        })
        .catch((err) => console.error("Lỗi khi lấy tin nhắn:", err));
    }
  }, [isOpen, userId]);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (!connectionRef.current) {
      const newConnection = new signalR.HubConnectionBuilder()
        .withUrl("https://localhost:44304/chatHub")
        .withAutomaticReconnect()
        .build();

      newConnection.on("ReceiveMessage", (user, message) => {
        setMessages((prevMessages) => [
          ...prevMessages,
          { user, userId, message },
        ]);
      });

      newConnection
        .start()
        .then(() => {
          console.log("SignalR connected!");
          newConnection.invoke("UserJoin", nameUser);
        })
        .catch((err) => console.error("SignalR Connection Error:", err));
      connectionRef.current = newConnection;
    }

    return () => {
      if (connectionRef.current) {
        connectionRef.current.stop();
        connectionRef.current = null;
      }
    };
  }, [nameUser]);

  const sendMessage = async () => {
    if (connectionRef.current && messageInput.trim() !== "") {
      try {
        await connectionRef.current.invoke(
          "SendMessage",
          nameUser,
          userId,
          messageInput
        );
        setMessages([
          ...messages,
          { user: nameUser, userId, message: messageInput },
        ]);
        setMessageInput("");
      } catch (err) {
        console.error("Error sending message:", err);
      }
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        className="w-12 h-12 bg-blue-500 opacity-50 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-red-600 hover:opacity-100"
        onClick={handleOpenChat}
      >
        <MessageCircleMore size={30} />
      </button>

      {isOpen && (
        <div className="absolute bottom-16 right-0 w-96 bg-white rounded-lg shadow-xl border p-4">
          <div className="flex justify-between items-center border-b pb-2">
            <h3 className="text-lg font-semibold">
              Hỗ trợ by Million <PartyPopper />
            </h3>
            <button
              className="text-gray-500 hover:text-gray-700"
              onClick={() => setIsOpen(false)}
            >
              ✕
            </button>
          </div>

          {/* Phần tin nhắn có scroll */}
          <div className="overflow-y-auto p-2 h-80">
            <p className="text-gray-600">
              Xin chào! Tôi có thể giúp gì cho bạn?
            </p>

            {messages.map((msg, index) => (
              <div
                key={index}
                className={`p-1 flex flex-col ${
                  msg.user === nameUser ? "items-end" : "items-start"
                }`}
              >
                {msg.user !== nameUser && (
                  <span className="text-xs font-semibold text-gray-700">
                    {msg.user}
                  </span>
                )}
                <span
                  className={`inline-block px-3 py-2 rounded-md ${
                    msg.user === nameUser
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-black"
                  }`}
                >
                  {msg.message}
                </span>
                <span className="text-xs text-gray-500">{msg.time}</span>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Ô nhập tin nhắn */}
          <div className="flex items-center border-t pt-2">
            <input
              type="text"
              placeholder="Nhập tin nhắn..."
              className="flex-1 p-2 border rounded-l focus:outline-none bg-white"
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
            />
            <button
              onClick={sendMessage}
              className="bg-blue-500 text-white px-4 py-2 rounded-sm hover:bg-blue-600"
            >
              <SendHorizonal />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatSupport;
