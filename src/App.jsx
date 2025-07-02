import { useState, useEffect, useRef, useMemo } from "react";
import { useDarkMode } from "./hooks/UseDarkMode";
import ToggleButton from "./components/UI/ToggleButton";
import ChatPopup from "./ChatPopup";
import { ToastContainer } from "react-toastify";
import { FaCheckCircle } from "react-icons/fa";
import Lottie from "lottie-react";
import chatbotAnimation from "./animations/ChatBotAnimation.json";
import gridNew from "/assets/newGrid.webp";
import "./index.css";


function App() {
  const { darkMode, toggleDarkMode } = useDarkMode();
  const [typedWord, setTypedWord] = useState("");
  const [wordIndex, setWordIndex] = useState(0);
  const words = useMemo(() => ["information", "solutions", "guidance"], []);
  const typingSpeed = 140;
  const deletingSpeed = 120;
  const pauseBetweenWords = 500;
  const animationRef = useRef(null);

  useEffect(() => {
    let currentIndex = 0;
    let isDeleting = false;
    let timeoutId;

    const animate = () => {
      const currentWord = words[wordIndex];
      if (!isDeleting) {
        if (currentIndex < currentWord.length) {
          setTypedWord(currentWord.substring(0, currentIndex + 1));
          currentIndex++;
          timeoutId = setTimeout(animate, typingSpeed);
        } else {
          isDeleting = true;
          timeoutId = setTimeout(animate, pauseBetweenWords);
        }
      } else {
        if (currentIndex > 0) {
          setTypedWord(currentWord.substring(0, currentIndex - 1));
          currentIndex--;
          timeoutId = setTimeout(animate, deletingSpeed);
        } else {
          isDeleting = false;
          setWordIndex((prev) => (prev + 1) % words.length);
          timeoutId = setTimeout(animate, typingSpeed);
        }
      }
    };

    animationRef.current = animate;
    animate();

    return () => clearTimeout(timeoutId);
  }, [wordIndex, words]);

  return (
    <div
      className={`min-h-[100vh] flex flex-col items-center text-center pt-14 relative px-5 transition-all ease-in-out duration-700  ${
        darkMode
          ? "dark-mode-gradient text-white"
          : "light-mode-gradient text-black"
      }`}
    >
      {/* New div with background image */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url(${gridNew})`,
          backgroundSize: "contain",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundBlendMode: "overlay",
        }}
      ></div>

      <ToggleButton darkMode={darkMode} toggleDarkMode={toggleDarkMode} />

      <div className="w-20 h-20 lg:w-40 lg:h-40  mt-10 mb-4  lg:mt-0 lg:mb-0 ">
        <Lottie animationData={chatbotAnimation} loop={true} />
      </div>

      <h1 className="text-h1 mb-2">
        One prompt - endless{" "}
        <span className={`relative ${darkMode ? "dark-typed" : "light-typed"}`}>
          {typedWord}
          <span className="cursor"></span>
        </span>
        .
      </h1>

      <p className="mt-6 lg:mt-2 max-w-5xl">
        {" "}
        Buddy ChatBot is an AI-powered assistant built with React and Tailwind,
        powered by Gemini AI API. It offers instant general responses, but with
        data training, it can be customized to meet your business/startup needs,
        enhancing real-time support.
      </p>
      <ul className="flex justify-center mt-10 gap-6 lg:gap-8 list-none z-0">
        <li className="flex items-center space-x-2 text-p">
          <FaCheckCircle className="text-[var(--color--primary)]" />
          <span
            className={`relative text-sm lg:text-base ${
              darkMode ? "dark-typed" : "light-typed"
            }`}
          >
            Real-time interactions
          </span>
        </li>
        <li className="flex items-center space-x-2 text-p">
          <FaCheckCircle className="text-[var(--color--primary)]" />
          <span
            className={`relative text-sm lg:text-base ${
              darkMode ? "dark-typed" : "light-typed"
            }`}
          >
            Easy customization
          </span>
        </li>
      </ul>

      <p className="text-sm mt-auto mb-4 sm:w-6 lg:w-full opacity-50">
        P.S. If the bot doesn't respond, it means you have sent too many
        requests and should try again later.
      </p>

      <ChatPopup darkMode={darkMode} />
      <ToastContainer />
    </div>
  );
}

export default App;
