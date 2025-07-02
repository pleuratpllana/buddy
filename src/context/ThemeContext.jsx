// src/context/ThemeContext.jsx
import { createContext, useState } from "react";
import { getTheme } from "../utils/ThemeUtils";

const ThemeContext = createContext();

export const DarkModeProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window === "undefined") return false;
    const savedPreference = localStorage.getItem("darkMode");
    if (savedPreference !== null) return savedPreference === "true";
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  // Use getTheme and pass both darkMode and setDarkMode
  const theme = getTheme(darkMode, setDarkMode);

  return (
    <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>
  );
};

export default ThemeContext;
