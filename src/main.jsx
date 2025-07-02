import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { DarkModeProvider } from "./context/ThemeContext.jsx";
import { ChatProvider } from "./context/ChatContext"; 
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <DarkModeProvider>
      <ChatProvider>
        <App />
      </ChatProvider>
    </DarkModeProvider>
  </StrictMode>
);
