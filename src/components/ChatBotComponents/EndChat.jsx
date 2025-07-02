import {
  FaSignOutAlt,
  FaVolumeUp,
  FaVolumeMute,
  FaDownload,
} from "react-icons/fa";
import { useDarkMode } from "../../hooks/UseDarkMode";
import { useChat } from "../../context/ChatContext";
import { jsPDF } from "jspdf";

const EndChatOptions = ({
  onEndChatClick,
  showConfirmPopup,
  setShowConfirmPopup,
  isDropdownOpen,
  setIsDropdownOpen,
}) => {
  const { darkMode, colors } = useDarkMode();
  const { messages, soundEnabled, toggleSound } = useChat();

  // Generate and download the PDF with chat messages
  const downloadChat = () => {
    const doc = new jsPDF();

    // --- Header block ---
    doc.setFontSize(20);
    doc.setTextColor(40, 40, 40);
    doc.text("Chat History with Buddy", 20, 20);

    doc.setDrawColor(200, 200, 200);
    doc.line(20, 25, 190, 25);

    doc.setFontSize(12);
    doc.setTextColor(100, 100, 100);
    doc.text(`Exported on: ${new Date().toLocaleString()}`, 20, 32);

    let yPosition = 45;

    // --- Chat messages ---
    messages.forEach((message) => {
      const sender = message.sender === "user" ? "You" : "BuddyChatBot";
      const text = `${sender}: ${message.text}`;

      doc.setFontSize(12);
      doc.setTextColor(33, 33, 33);

      const wrappedText = doc.splitTextToSize(text, 170);
      doc.text(wrappedText, 20, yPosition);

      yPosition += wrappedText.length * 7 + 5;

      // Page break logic
      if (yPosition > 270) {
        doc.addPage();
        yPosition = 20;
      }
    });

    doc.save("Chat-Transcript.pdf");
  };

  return (
    <div className="relative w-full">
      {isDropdownOpen && (
        <div
          className={`absolute top-8 lg:top-8 mt-1.5  -right-1 lg:-right-1 flex flex-col justify-start items-start gap-1 -right-4 ${colors.dropdownStyles} shadow-lg py-2 pl-4 w-44 z-20 text-sm`}
        >
          <button
            onClick={() => {
              setIsDropdownOpen(false);
              setShowConfirmPopup(true);
            }}
            className={`flex items-center justify-start w-full ${
              darkMode ? "text-[var(--color-primary)]" : colors.text
            } hover:text-[var(--color-accent)] transition py-2`}
          >
            <FaSignOutAlt className="mr-2" /> End Chat
          </button>
          <button
            onClick={() => {
              toggleSound();
              setIsDropdownOpen(false);
            }}
            className={`flex items-center justify-start w-full ${
              darkMode ? "text-[var(--color-primary)]" : colors.text
            } hover:text-[var(--color-accent)] transition py-2`}
          >
            {soundEnabled ? (
              <FaVolumeUp className="mr-2" />
            ) : (
              <FaVolumeMute className="mr-2" />
            )}
            {soundEnabled ? "Mute Chat" : "Unmute Chat"}
          </button>
          <button
            onClick={() => {
              setIsDropdownOpen(false);
              downloadChat();
            }}
            className={`flex items-center justify-start w-full ${
              darkMode ? "text-[var(--color-primary)]" : colors.text
            } hover:text-[var(--color-accent)] transition py-2`}
          >
            <FaDownload className="mr-2" /> Download Chat
          </button>
        </div>
      )}

      {showConfirmPopup && (
        <div className="absolute top-44 -right-3 z-40 sm:top-40 sm:-right-0 md:top-40 md:right-6 lg:top-48 lg:right-8">
          <div
            className={`${
              darkMode ? "bg-white" : colors.background
            } rounded-md shadow-lg p-6  w-[300px] text-center text-sm text-[var(--color-primary)]`}
          >
            <p className="mb-4 text-base">Are you sure about this step?</p>
            <div className="flex flex-col sm:flex-row justify-center space-y-2 sm:space-x-2 sm:space-y-0">
              <button
                onClick={onEndChatClick}
                className="text-sm px-6 py-2 rounded-full bg-[var(--color-primary)] text-white hover:bg-[var(--color-secondary)] transition hover:text-[var(--color--primary)]"
              >
                End chat
              </button>
              <button
                onClick={() => setShowConfirmPopup(false)}
                className="px-6 py-2 rounded-full border border-[var(--color-primary)] text-[var(--color-primary)] hover:bg-[var(--color-secondary)] transition hover:text-[var(--color--primary)] hover:border-[var(--color-secondary)]"
              >
                Keep chat
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EndChatOptions;
