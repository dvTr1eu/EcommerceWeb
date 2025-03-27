import { useEffect, useRef, useState } from "react";
import * as signalR from "@microsoft/signalr";
import { SendHorizonal } from "lucide-react";
import axios from "axios";
import Cookies from "js-cookie";
import { useSelector } from "react-redux";

function AdminChatRoom() {
  const [conversations, setConversations] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const connectionRef = useRef(null);
  const { user } = useSelector((state) => state.auth);
  const [receiverId, setReceiverId] = useState(null);
  let token = Cookies.get("token");

  const selectChat = (conv) => {
    setSelectedChat({ userName: conv.userName, userId: conv.userId });
    setReceiverId(conv.userId);
    setMessages([]);
  };

  useEffect(() => {
    axios
      .get(`https://localhost:44304/api/Chat/Admin/${user.id}`, {
        headers: {
          Authorization: `${token}`,
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        setConversations(
          res.data.$values.map((conv) => ({
            userName: conv.user.fullName,
            userId: conv.user.id,
            lastMessage: conv.lastMessage || "Chưa có tin nhắn",
            hasNewMessage: false,
          }))
        );
      })
      .catch((err) => console.error("Lỗi khi lấy danh sách hội thoại:", err));
  }, []);
  console.log(conversations);

  useEffect(() => {
    if (selectedChat) {
      axios
        .get(`https://localhost:44304/api/Chat/${selectedChat.userId}`)
        .then((res) => {
          setMessages(
            res.data.$values.map((msg) => ({
              senderId:
                msg.senderId === selectedChat.userId
                  ? selectedChat.userName
                  : "admin",
              message: msg.message,
              time: msg.time,
            }))
          );
        })
        .catch((err) => console.error("Lỗi khi lấy tin nhắn:", err));
    }
  }, [selectedChat]);

  useEffect(() => {
    const newConnection = new signalR.HubConnectionBuilder()
      .withUrl("https://localhost:44304/chatHub")
      .withAutomaticReconnect()
      .build();

    newConnection.start().then(() => {
      console.log("Connected to chat hub");

      newConnection.invoke("AdminJoinConversation", receiverId);

      newConnection.on("ReceiveMessage", (userName, userId, message) => {
        setConversations((prev) => {
          const existingChat = prev.find((conv) => conv.userName === userName);
          if (existingChat) {
            return prev.map((conv) =>
              conv.userName === userName
                ? { ...conv, userId, lastMessage: message, hasNewMessage: true }
                : conv
            );
          } else {
            return [
              ...prev,
              { userName, userId, lastMessage: message, hasNewMessage: true },
            ];
          }
        });
        setMessages((prevMessages) => [
          ...prevMessages,
          { senderId: userName, message },
        ]);
      });
      newConnection.on("ReceiveMessageFromUser", (userName, message) => {
        if (selectedChat?.userName === userName) {
          setMessages((prev) => [...prev, { senderId: userName, message }]);
        }
      });
    });

    connectionRef.current = newConnection;
    return () => {
      if (connectionRef.current) {
        connectionRef.current.stop();
      }
    };
  }, [selectedChat]);

  const sendMessage = async () => {
    if (connectionRef.current && message.trim() && selectedChat) {
      await connectionRef.current.invoke(
        "SendMessageToUser",
        selectedChat.userName,
        selectedChat.userId,
        message
      );
      setMessages([...messages, { senderId: "admin", message }]);

      setConversations((prev) =>
        prev.map((conv) =>
          conv.userName === selectedChat.userName
            ? { ...conv, lastMessage: message, hasNewMessage: false }
            : conv
        )
      );

      setMessage("");
    }
  };

  return (
    <div className="flex h-[100%]">
      <div className="w-1/4 border-r p-4 bg-gray-100">
        <h2 className="text-lg font-bold mb-4">Danh sách tin nhắn</h2>
        <ul>
          {conversations.map((conv) => (
            <li
              key={conv.userName}
              className="flex items-center justify-between p-2 border-b hover:bg-gray-200 cursor-pointer"
              onClick={() => selectChat(conv)}
            >
              <div className="flex justify-between items-center">
                <span className="font-semibold">{conv.userName}</span>
                {conv.hasNewMessage && (
                  <span className="w-3 h-3 bg-red-500 rounded-full"></span>
                )}
              </div>
              <span className="text-sm text-gray-600 truncate">
                {conv.lastMessage}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div className="w-3/4 p-4 flex flex-col">
        {selectedChat ? (
          <>
            <div className="border-b pb-2 mb-2 font-bold">
              {selectedChat.userName}
            </div>
            <div className="flex-1 overflow-y-auto border p-4 h-96">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`mb-2 flex flex-col ${
                    msg.senderId === "admin" ? "items-end" : "items-start"
                  }`}
                >
                  {msg.senderId !== "admin" && (
                    <span className="text-xs font-semibold text-gray-700">
                      {msg.senderId}
                    </span>
                  )}
                  <span
                    className={`inline-block px-3 py-2 rounded-md ${
                      msg.senderId === "admin"
                        ? "bg-blue-500 text-white"
                        : "bg-gray-200 text-black"
                    }`}
                  >
                    {msg.message}
                  </span>
                  <span className="text-xs text-gray-500">{msg.time}</span>
                </div>
              ))}
            </div>
            <div className="flex mt-2 border-t pt-2">
              <input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                type="text"
                placeholder="Nhập tin nhắn..."
                className="flex-1 p-2 border rounded-l focus:outline-none bg-white"
              />
              <button
                onClick={sendMessage}
                className="bg-blue-500 text-white px-4 py-2 rounded-sm hover:bg-blue-600"
              >
                <SendHorizonal />
              </button>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center flex-1 text-gray-500">
            Chọn cuộc hội thoại để chat
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminChatRoom;
