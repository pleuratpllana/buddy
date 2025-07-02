import React, { useRef, useEffect } from "react";
import { useChat } from "./context/ChatContext";
import ChatHeader from "./components/ChatBotComponents/ChatHeader";
import ChatBody from "./components/ChatBotComponents/ChatBody";
import ChatFooter from "./components/ChatBotComponents/ChatFooter";
import { useDarkMode } from "./hooks/UseDarkMode";
import ChatRegisterForm from "./components/ChatBotComponents/ChatRegisterForm";

const ChatWindow = ({ onEndChat }) => {
  const { colors, darkMode } = useDarkMode();
  const {
    isClosing,
    skipAnimation,
    minimizeChat,
    messages,
    isOpen,
    scrollPosition,
    setScrollPosition,
    isRegistered,
  } = useChat();

  const chatBodyRef = useRef(null);
  const prevMessageCount = useRef(messages.length);

  // Scroll control effect
  useEffect(() => {
    if (!chatBodyRef.current) return;

    const hasNewMessages = messages.length > prevMessageCount.current;
    prevMessageCount.current = messages.length;

    if (hasNewMessages) {
      // Scroll to bottom for new messages
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    } else if (isOpen) {
      // Restore position when reopening
      chatBodyRef.current.scrollTop = scrollPosition;
    }
  }, [messages, isOpen, scrollPosition]);

  // Save scroll position before minimizing
  const handleMinimize = () => {
    if (isOpen && !isClosing) {
      // Only minimize if currently open
      if (chatBodyRef.current) {
        setScrollPosition(chatBodyRef.current.scrollTop);
      }
      minimizeChat();
    }
  };
  return (
    <div
      className={`chatWindow flex flex-col w-full max-w-[380px] min-w-[320px] sm:min-w-[340px] md:min-w-[360px] lg:min-w-[400px] justify-between rounded-3xl overflow-hidden overflow-x-hidden box-border
        ${skipAnimation ? "" : isClosing ? "closing" : "opening"}
        ${darkMode ? colors.background : "bg-white"}
        ${colors.chatBorder}
        ${
          !darkMode
            ? "shadow-lg border border-[var(--subtle-gray-accent)]"
            : "shadow-none"
        }`}
    >
      <ChatHeader onEndChat={onEndChat} toggleChat={handleMinimize} />

      {/* Main content area with transitions */}
      <div className="flex-1 relative overflow-hidden">
        {/* Registration Form with transition */}
        <div
          className={`absolute inset-0 mb-0 transition-all duration-300 ease-in-out ${
            isRegistered
              ? "opacity-0 -translate-y-4 pointer-events-none"
              : "opacity-100 translate-y-0"
          }`}
        >
          <ChatRegisterForm />
        </div>

        {/* Chat Body with transition */}
        <div
          className={`h-full flex flex-col transition-all duration-300 ease-in-out ${
            isRegistered
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-4 pointer-events-none"
          }`}
        >
          <div
            ref={chatBodyRef}
            className="chatBody overflow-y-auto flex-1"
            style={{
              overflowAnchor: "none",
              scrollBehavior: "auto",
            }}
          >
            <ChatBody />
          </div>
          <ChatFooter />
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;
