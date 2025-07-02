import { useState, useEffect, useRef } from "react";
import { FaPaperPlane } from "react-icons/fa";
import { useDarkMode } from "../../hooks/UseDarkMode";
import { useChat } from "../../context/ChatContext";

export const ChatForm = () => {
  const [message, setMessage] = useState("");
  const { darkMode, colors } = useDarkMode();
  const { sendMessage } = useChat();
  const textareaRef = useRef(null);

  // Auto-resize with perfect word wrapping
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";

      const lineHeight = 24;
      const maxVisibleLines = 3;
      const maxHeight = lineHeight * maxVisibleLines;

      const needsScroll = textareaRef.current.scrollHeight > maxHeight;

      textareaRef.current.style.overflowY = needsScroll ? "auto" : "hidden";
      textareaRef.current.style.height = needsScroll
        ? `${maxHeight}px`
        : `${textareaRef.current.scrollHeight}px`;
    }
  }, [message]);

  // Load saved message from localStorage
  useEffect(() => {
    const savedMessage = localStorage.getItem("chatInputMessage");
    if (savedMessage) setMessage(savedMessage);
  }, []);

  // Save message to localStorage
  useEffect(() => {
    if (message.trim()) {
      localStorage.setItem("chatInputMessage", message);
    }
  }, [message]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    const userMessage = message.trim();
    if (!userMessage) return;

    sendMessage(userMessage);
    setMessage("");
    localStorage.removeItem("chatInputMessage");

    // Reset textarea after send
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.overflowY = "hidden";
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e);
    }
  };

  return (
    <form
      onSubmit={handleSendMessage}
      className="w-full flex items-center py-4 px-5 rounded-3xl relative chatForm"
    >
      <div className="relative flex-1 flex items-center">
        <textarea
          ref={textareaRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a message..."
          id="prompt"
          rows={1}
          className={`peer chat-input w-full py-2.5 px-4 pr-12 ${
            colors.chatInput.borderRadius
          } 
            ${colors.chatInput.text} ${colors.chatInput.background} 
            border-[1px] ${colors.chatInput.border} 
            ${
              darkMode
                ? `${colors.chatInput.focus.dark.border} ${colors.chatInput.focus.dark.ring} focus:ring-1`
                : `${colors.chatInput.focus.light.border} ${colors.chatInput.focus.light.ring} focus:ring-1`
            }
            focus:outline-none transition-all duration-100 resize-none min-h-[44px] break-words`}
          required
        />
        <button
          type="submit"
          className={`group send-btn absolute right-3 p-2 rounded-full opacity-0 peer-valid:opacity-100 
            ${
              darkMode
                ? `${colors.paperPlaneIcon.dark.button.base} ${colors.paperPlaneIcon.dark.button.hover}`
                : `${colors.paperPlaneIcon.light.button.base} ${colors.paperPlaneIcon.light.button.hover}`
            }
            ${
              colors.paperPlaneIcon.transition
            } top-1/2 transform -translate-y-1/2`}
        >
          <FaPaperPlane
            className={`w-4 h-4 
              ${
                darkMode
                  ? `${colors.paperPlaneIcon.dark.icon.base} ${colors.paperPlaneIcon.dark.icon.hover}`
                  : `${colors.paperPlaneIcon.light.icon.base} ${colors.paperPlaneIcon.light.icon.hover}`
              }
            `}
          />
        </button>
      </div>
    </form>
  );
};
