import { useEffect, useRef, useState, useCallback } from "react";
import { useDarkMode } from "../../hooks/UseDarkMode";
import { useChat } from "../../context/ChatContext";
import ChatMessage from "./ChatMessage";

const ChatBody = () => {
  const { colors } = useDarkMode();
  const {
    messages: chatHistory = [],
    isTyping,
    botResponse,
    stopBot,
    isThinking,
  } = useChat();
  const [typingMessage, setTypingMessage] = useState("");
  const chatBodyRef = useRef(null);
  const shouldAutoScroll = useRef(true);

  // Get time ago string
  const getTimeAgo = (messageTime) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now - messageTime) / 1000);

    if (diffInSeconds < 60) return "Just now";
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) return `${diffInMinutes} min ago`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} days ago`;
  };

  // Handle copy message
  const handleCopyMessage = (text) => {
    navigator.clipboard
      .writeText(text)
      .then(() => console.log("Copied to clipboard"))
      .catch((err) => console.error("Failed to copy:", err));
  };

  // Render typing indicator dots
  const renderTypingIndicator = () => {
    return Array.from({ length: 3 }, (_, index) => (
      <span
        key={index}
        className="w-2 h-2 rounded-full animate-wave"
        style={{
          backgroundColor: "var(--color-secondary)",
          animationDelay: `${index * 0.2}s`,
        }}
      />
    ));
  };

  // Scroll to bottom function
  const scrollToBottom = useCallback(
    (behavior = "smooth") => {
      if (chatBodyRef.current) {
        const shouldForceScroll = isTyping || !!botResponse;

        if (shouldForceScroll || shouldAutoScroll.current) {
          chatBodyRef.current.scrollTo({
            top: chatBodyRef.current.scrollHeight,
            behavior,
          });
        }
      }
    },
    [isTyping, botResponse]
  );
  // Handle scroll events
  const handleScroll = useCallback(() => {
    if (!chatBodyRef.current) return;

    const { scrollTop, scrollHeight, clientHeight } = chatBodyRef.current;
    const isNearBottom = scrollHeight - (scrollTop + clientHeight) < 50;
    shouldAutoScroll.current = isNearBottom;
  }, []);

  // Set up scroll listener and initial scroll
  useEffect(() => {
    const chatBody = chatBodyRef.current;
    if (chatBody) {
      chatBody.addEventListener("scroll", handleScroll);
      chatBody.scrollTop = chatBody.scrollHeight;
    }

    return () => {
      if (chatBody) {
        chatBody.removeEventListener("scroll", handleScroll);
      }
    };
  }, [handleScroll]);

  // Scroll when new messages are added
  useEffect(() => {
    scrollToBottom();
  }, [chatHistory, scrollToBottom]);

  // Typing effect with auto-scroll
  useEffect(() => {
    if (isTyping && botResponse) {
      setTypingMessage("");
      let index = 0;
      const typingInterval = setInterval(() => {
        if (!isTyping || index >= botResponse.length) {
          clearInterval(typingInterval);
          setTimeout(() => scrollToBottom("auto"), 0);
          return;
        }

        setTypingMessage((prev) => prev + botResponse[index]);
        index++;
      }, 20);

      return () => clearInterval(typingInterval);
    }
  }, [isTyping, botResponse, scrollToBottom]);
  return (
    <div
      ref={chatBodyRef}
      className={`overflow-y-auto rounded-1xl flex flex-col h-[400px] space-y-4 p-5 text-base ${colors.chatBodyBg} bg-transparent sm:bg-transparent dark:max-sm:bg-[var(--color-primary)]`}
    >
      {/* Chat history */}
      {chatHistory.map((chat, index) => (
        <ChatMessage
          key={index}
          chat={chat}
          colors={colors}
          timestamp={getTimeAgo(new Date(chat.timestamp))}
          handleCopyMessage={handleCopyMessage}
        />
      ))}

      {/* Typing Indicator */}
      {isThinking && (
        <div className="flex items-center space-x-1 px-4 py-2 rounded-xl w-fit -ml-3">
          {renderTypingIndicator()}
        </div>
      )}

      {/* Bot message being typed (character by character) or completed */}
      {(isTyping || (!isThinking && botResponse)) && botResponse ? (
        <ChatMessage
          chat={{ sender: "bot", text: typingMessage }}
          colors={colors}
          timestamp={getTimeAgo(new Date())}
          handleCopyMessage={handleCopyMessage}
          stopBot={stopBot}
        />
      ) : null}
    </div>
  );
};

export default ChatBody;
