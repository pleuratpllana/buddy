import { FaSun, FaMoon } from "react-icons/fa";
import { useDarkMode } from "../../hooks/UseDarkMode";

function ToggleButton() {
  const { darkMode, toggleDarkMode, colors, transitions } = useDarkMode();

  return (
    <div className="absolute top-5 right-5 flex items-center">
      <span className={`mr-3 text-sm ${colors.text}`}>
        {darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
      </span>

      <button
        onClick={toggleDarkMode}
        className={`relative w-16 h-8 rounded-full border ${colors.border} overflow-hidden ${transitions} cursor-pointer`}
        aria-label="Toggle dark mode"
      >
        <div className="absolute inset-0 flex items-center justify-between px-2.5">
          <FaMoon
            className={`text-lg ${colors.icon.moon} ${transitions}`}
            style={{ color: "var(--color-primary)" }}
          />
          <FaSun
            className={`text-white text-lg ${colors.icon.sun} ${transitions}`}
          />
        </div>

        <div
          className={`absolute top-1/2 w-5 h-5 rounded-full transform -translate-y-1/2 ${colors.toggleBg} ${transitions}`}
          style={{
            left: darkMode ? "0.40rem" : "calc(100% - 1.65rem)",
          }}
        />
      </button>
    </div>
  );
}

export default ToggleButton;
