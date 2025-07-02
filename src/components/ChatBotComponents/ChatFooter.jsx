import { useChat } from "../../context/ChatContext";
import { useDarkMode } from "../../hooks/UseDarkMode";
import { ChatForm } from "./ChatForm";

const ChatFooter = () => {
  const { darkMode, colors } = useDarkMode();
  const { setChatHistory } = useChat();

  return (
    <div
      className={`chatFooter rounded-tl-none rounded-tr-none rounded-bl-3xl rounded-br-3xl ${
        darkMode ? "bg-[var(--light-turquoise)]" : "bg-[var(--color-white)]"
      } border-t-[1px] ${colors.chatFooter.border}`}
    >
      <ChatForm setChatHistory={setChatHistory} />{" "}
    </div>
  );
};

export default ChatFooter;
