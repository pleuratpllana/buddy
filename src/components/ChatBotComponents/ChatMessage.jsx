import { FaRobot, FaCopy, FaStop } from "react-icons/fa";
import { useState } from "react";

const ChatMessage = ({ chat, colors, timestamp, stopBot }) => {
  const [copyStatus, setCopyStatus] = useState("Copy");

  // Copy text from the bot's response
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(chat.text);
      setCopyStatus("Copied");
      setTimeout(() => setCopyStatus("Copy"), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <div>
      <div
        className={`message  ${
          chat.sender === "bot" ? "botMessage" : "userMessage"
        } flex items-center gap-2 ${
          chat.sender === "bot" ? "justify-start" : "justify-end"
        }`}
      >
        {chat.sender === "bot" && (
          <FaRobot
            className={`w-10 h-10 mb-auto ${colors.botIconBg} ${colors.iconColor} p-2 rounded-full`}
          />
        )}
        <p
          className={`messageText text-sm font-medium  -mb-3 p-3 max-w-[75%] text-left ${
            chat.sender === "bot"
              ? "rounded-[3px_14px_14px_14px]"
              : "rounded-[14px_14px_3px_14px]"
          } ${
            chat.sender === "bot" ? colors.botMessageBg : colors.userMessageBg
          } ${
            chat.sender === "bot" ? colors.messageText : colors.userMessageText
          } break-words whitespace-pre-wrap overflow-wrap-anywhere`}
        >
          {chat.text}
        </p>
      </div>

      <div
        className={`flex ${
          chat.sender === "bot" ? "justify-start ml-7 mt-4" : "justify-end mt-4"
        }`}
      >
        <span
          className={`text-xs ${colors.timestampText} flex items-center gap-2 ml-5`}
        >
          {timestamp}
          {chat.sender === "bot" && (
            <div
              className="flex items-center ml-2 gap-1 cursor-pointer"
              onClick={handleCopy}
            >
              {" "}
              {/* Copy bot response icon*/}
              <FaCopy
                className="cursor-pointer hover:opacity-80 transition"
                title="Copy message"
              />
              <span className="text-xs text-[var(--gray-accent)]">
                {copyStatus}
              </span>
            </div>
          )}
          {/* Stop Button */}
          {chat.sender === "bot" && (
            <div
              className="flex items-center ml-2 gap-1 cursor-pointer"
              onClick={stopBot} //
            >
              {/* <FaStop
                className="hover:opacity-80 transition"
                title="Stop Response"
              /> */}
            </div>
          )}
        </span>
      </div>
    </div>
  );
};

export default ChatMessage;
