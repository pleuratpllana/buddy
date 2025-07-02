import { ClipLoader } from "react-spinners";
import { FaPaperPlane } from "react-icons/fa";

const SubmitButton = ({
  isSubmitting,
  darkMode,
  isRegistered,
  className = "",
}) => {
  return (
    <button
      type="submit"
      disabled={isSubmitting}
      className={`w-full py-4 px-4 rounded-lg font-medium transition-colors mt-1 ${
        darkMode
          ? "bg-[var(--color-secondary)] hover:bg-[var(--color-white)] text-[var(--color-primary)]"
          : "bg-[var(--color-tertiary)] hover:bg-[var(--color-secondary)] text-[var(--color-primary)]"
      } focus:outline-none focus:ring-0 focus:border-transparent flex justify-between items-center ${
        isSubmitting ? "opacity-70 cursor-not-allowed" : ""
      } ${className}`}
    >
      <span>{isRegistered ? "Update Information" : "Start Chatting"}</span>
      {isSubmitting ? (
        <ClipLoader size={20} color={darkMode ? "#000" : "#fff"} />
      ) : (
        <FaPaperPlane className="ml-2" />
      )}
    </button>
  );
};

export default SubmitButton;
