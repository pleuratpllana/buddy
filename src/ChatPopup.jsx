import { FaComments, FaTimes } from "react-icons/fa";
import { useState, useRef, useEffect } from "react";
import { useDarkMode } from "./hooks/UseDarkMode";
import ChatWindow from "./ChatWindow";
import { useChat } from "./context/ChatContext";
import NotificationBadge from "./components/ChatBotComponents/ChatNotificationBadge";
import Lottie from "lottie-react";

import arrowAnimation from "./animations/dITHHWwd4K (1).json";

const ChatPopup = () => {
  const { darkMode, colors } = useDarkMode();
  const { isOpen, toggleChat, isClosing, endChat, unreadCount } = useChat();
  const [skipAnimation, setSkipAnimation] = useState(true);
  const chatWindowRef = useRef(null);
  const [showArrow, setShowArrow] = useState(false);

  useEffect(() => {
    setSkipAnimation(true);
    const chatOpen = localStorage.getItem("chatOpen") === "true";
    const isMinimized = localStorage.getItem("chatMinimized") === "true";

    if (chatOpen && !isMinimized && !isOpen) {
      toggleChat();
    }

    const timer = setTimeout(() => {
      setSkipAnimation(false);
    }, 100);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const hasSeenArrow = localStorage.getItem("hasSeenArrow") === "true";

    if (!hasSeenArrow && !isOpen) {
      setShowArrow(true);
    }

    if (isOpen && !hasSeenArrow) {
      setShowArrow(false);
      localStorage.setItem("hasSeenArrow", "true");
    }
  }, [isOpen]);

  const handleEndChat = () => {
    endChat();
  };

  if (!colors) return null;

  return (
    <div className="chatBotPopup fixed bottom-5 right-5 flex flex-col items-end cursor-pointer">
      {(isOpen || isClosing) && (
        <div className="mb-4" ref={chatWindowRef}>
          <ChatWindow
            darkMode={darkMode}
            isClosing={isClosing}
            skipAnimation={skipAnimation && isOpen}
            onEndChat={handleEndChat}
          />
        </div>
      )}
      {/* Only render Lottie if chat is not open */}
      {showArrow && (
        <Lottie
          animationData={arrowAnimation}
          loop={true}
          className="absolute right-16 bottom-8 transform rotate-[-45deg] scale-x-[-1] scale-y-[-1] w-[48px] h-[48px]"
        />
      )}

      <button
        onClick={toggleChat}
        className={`${colors.popupButton.base} ${colors.popupButton.colors.bg} ${colors.popupButton.colors.text} ${colors.popupButton.colors.hoverBg} ${colors.popupButton.colors.hoverText} transition-transform duration-300 ease-in-out transform hover:scale-[1.2] cursor-pointer`}
      >
        <span className="relative w-7 h-7">
          <FaComments
            size={28}
            className={`${colors.popupIcon.base} ${
              isOpen ? colors.popupIcon.open : colors.popupIcon.close
            }`}
          />
          <FaTimes
            size={28}
            className={`${colors.popupCloseIcon.base} ${
              isOpen ? colors.popupCloseIcon.open : colors.popupCloseIcon.close
            }`}
          />
        </span>
      </button>
      {!isOpen && unreadCount > 0 && (
        <NotificationBadge unreadCount={unreadCount} />
      )}
    </div>
  );
};

export default ChatPopup;
