import { FaRobot, FaChevronDown, FaEllipsisH } from "react-icons/fa";
import { useState } from "react";
import { useDarkMode } from "../../hooks/UseDarkMode";
import EndChatOptions from "../ChatBotComponents/EndChat";
import { useChat } from "../../context/ChatContext";

const ChatHeader = ({ onEndChat, toggleChat }) => {
  const { darkMode } = useDarkMode();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showConfirmPopup, setShowConfirmPopup] = useState(false);

  const handleEndChat = () => {
    setShowConfirmPopup(false);
    onEndChat?.();
  };

  const { isRegistered } = useChat();

  return (
    <>
      <div
        className={`flex w-full justify-between items-center py-2 px-6 sm:px-5 sm:py-3 ${
          darkMode ? "bg-[var(--color-primary)]" : "bg-[var(--color-primary)]"
        }`}
      >
        <div className="flex items-center space-x-2 py-1.5">
          <FaRobot className="w-10 h-10 bg-white text-[var(--color-primary)] p-1 rounded-full" />
          <h4 className="text-white">BuddyChatBot</h4>
        </div>

        <div className="flex items-center">
          {/* Dropdown Toggle */}
          {isRegistered && (
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center group"
            >
              <FaEllipsisH className="w-5 h-5 text-white hover:text-[var(--color-accent)] transition-colors mr-5" />
            </button>
          )}

          {/* Minimize Button */}
          <button className="flex items-center group" onClick={toggleChat}>
            <FaChevronDown className="w-5 h-5 text-white hover:text-[var(--color-accent)] transition-colors" />
          </button>

          {/* Dropdown */}
          <EndChatOptions
            onEndChatClick={handleEndChat}
            showConfirmPopup={showConfirmPopup}
            setShowConfirmPopup={setShowConfirmPopup}
            isDropdownOpen={isDropdownOpen}
            setIsDropdownOpen={setIsDropdownOpen}
          />
        </div>
      </div>
    </>
  );
};

export default ChatHeader;
