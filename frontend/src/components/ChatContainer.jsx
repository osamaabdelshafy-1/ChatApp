import { useEffect, useRef } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessagesLoadingSkeleton from "./MessagesLoadingSkeleton";
import NoChatHistoryPlaceholder from "./NoChatHistoryPlaceholder";
const ChatContainer = () => {
  const { selectedUser, messages, getMessagesByUserId, isMessagesLoading } =
    useChatStore();
  const { authUser } = useAuthStore();
  const messageEndRef = useRef(null);
  useEffect(() => {
    if (selectedUser?._id) {
      getMessagesByUserId(selectedUser._id);
    }
  }, [selectedUser, getMessagesByUserId]);

  //to get the last message sent automatic on the screen no needing to manual scrolling
  useEffect(() => {
    if (messageEndRef) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Add null checks for selectedUser
  if (!selectedUser) {
    return (
      <>
        <ChatHeader />
        <div className="flex-1 px-6 overflow-y-auto py-8">
          <NoChatHistoryPlaceholder name="Select a user to start chatting" />
        </div>
      </>
    );
  }

  return (
    <>
      <ChatHeader />

      <div className="flex-1 px-6 overflow-y-auto py-8">
        {messages && messages.length > 0 && !isMessagesLoading ? (
          <div className="max-w-3xl mx-auto space-y-6">
            {messages.map((msg) => (
              <div
                key={msg._id}
                className={`chat ${
                  msg.senderId === authUser._id ? "chat-end" : "chat-start"
                }`}
              >
                <div
                  className={`chat-bubble relative ${
                    msg.senderId === authUser._id
                      ? "bg-cyan-600 text-white"
                      : "bg-slate-800 text-slate-200"
                  }`}
                >
                  {msg.image && (
                    <img
                      src={msg.image}
                      alt="shared"
                      className="rounded-lg h-48 object-cover"
                    />
                  )}

                  {msg.text && (
                    <p className={`${msg.image ? "mt-2" : ""} text-slate-50`}>
                      {msg.text}
                    </p>
                  )}
                  <p className="text-xs mt-1 opacity-75 items-center gap-1">
                    {new Date(msg.createdAt).toLocaleDateString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : isMessagesLoading ? (
          <MessagesLoadingSkeleton />
        ) : (
          <NoChatHistoryPlaceholder name={selectedUser.fullName} />
        )}
        <div ref={messageEndRef} />
      </div>
      <MessageInput />
    </>
  );
};

export default ChatContainer;
