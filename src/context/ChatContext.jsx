import {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from "react";
import api from "../api/geminiApi";

export const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  // States grouped by concern
  const [messages, setMessages] = useState(() => {
    const savedMessages = localStorage.getItem("chatMessages");
    return savedMessages ? JSON.parse(savedMessages) : [];
  });

  const [chatVisibility, setChatVisibility] = useState(() => ({
    isOpen:
      localStorage.getItem("chatOpen") === "true" &&
      localStorage.getItem("chatMinimized") !== "true",
    isMinimized: localStorage.getItem("chatMinimized") === "true",
    isClosing: false,
    skipAnimation: false,
  }));

  const [userData, setUserData] = useState(() => {
    const stored = localStorage.getItem("userData");
    return stored ? JSON.parse(stored) : { username: "", email: "" };
  });

  const [unreadCount, setUnreadCount] = useState(0);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [lastReadTime, setLastReadTime] = useState(new Date().toISOString());
  const [isTyping, setIsTyping] = useState(false);
  const [revealMessage, setRevealMessage] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const requestLock = useRef(false);

  const soundRef = useRef(null);
  const isRegistered = !!userData.username;

  // Effects (unchanged logic, just organized)
  useEffect(() => {
    soundRef.current = new Audio("/assets/chat-notification-sound.mp3");
    soundRef.current.volume = 0.3;

    if (chatVisibility.isOpen && messages.length === 0 && isRegistered) {
      const initialMessage = {
        text: `Hello ${
          userData.username || "there"
        }, this is Buddy. How can I help you today?`,
        sender: "bot",
        timestamp: new Date().toISOString(),
      };
      setMessages([initialMessage]);
    }

    return () => {
      soundRef.current?.pause();
      soundRef.current = null;
    };
  }, [chatVisibility.isOpen, isRegistered, userData.username]);

  useEffect(() => {
    localStorage.setItem("chatMessages", JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    if (
      messages.length === 0 ||
      (!chatVisibility.isMinimized && chatVisibility.isOpen)
    ) {
      setUnreadCount(0);
      return;
    }

    const lastBotMessage = messages
      .filter((msg) => msg.sender === "bot" && msg.isComplete !== false)
      .pop();

    if (lastBotMessage && lastBotMessage.timestamp > lastReadTime) {
      setUnreadCount(1);
    }
  }, [
    messages,
    chatVisibility.isMinimized,
    chatVisibility.isOpen,
    lastReadTime,
    messages.length,
  ]);

  // Combined chat visibility actions
  const updateChatVisibility = useCallback((newState) => {
    setChatVisibility((prev) => {
      const updated = { ...prev, ...newState };

      // Persist to localStorage
      if (newState.isOpen !== undefined) {
        localStorage.setItem("chatOpen", newState.isOpen ? "true" : "false");
      }
      if (newState.isMinimized !== undefined) {
        localStorage.setItem(
          "chatMinimized",
          newState.isMinimized ? "true" : "false"
        );
      }

      return updated;
    });
  }, []);

  const minimizeChat = useCallback(() => {
    updateChatVisibility({ isClosing: true });
    setTimeout(() => {
      updateChatVisibility({
        isOpen: false,
        isMinimized: true,
        isClosing: false,
      });
    }, 300);
  }, [updateChatVisibility]);

  const toggleChat = useCallback(
    (fromChevron = false) => {
      if (chatVisibility.isClosing) return;

      if (chatVisibility.isOpen) {
        minimizeChat();
        if (!fromChevron) {
          localStorage.setItem("chatOpen", "false");
        }
      } else {
        updateChatVisibility({
          skipAnimation: false,
          isOpen: true,
          isMinimized: false,
        });
        setUnreadCount(0);
        setLastReadTime(new Date().toISOString());
      }
    },
    [
      chatVisibility.isOpen,
      chatVisibility.isClosing,
      minimizeChat,
      updateChatVisibility,
    ]
  );

  const toggleMinimize = useCallback(() => {
    if (!chatVisibility.isMinimized) {
      updateChatVisibility({ isMinimized: true });
    } else {
      updateChatVisibility({ isMinimized: false });
      setUnreadCount(0);
      setLastReadTime(new Date().toISOString());
    }
  }, [chatVisibility.isMinimized, updateChatVisibility]);

  // Message handling (unchanged logic)
  const fetchGeminiResponse = useCallback(async (userPrompt) => {
    try {
      const response = await api.gemini(userPrompt);
      return response || "Sorry, I didn't get that.";
    } catch (error) {
      console.error("Error with Gemini API:", error);
      return "Sorry, I couldn't fetch a response at the moment.";
    }
  }, []);

  const playBotSound = useCallback(() => {
    if (soundRef.current && soundEnabled) {
      soundRef.current.currentTime = 0;
      soundRef.current.play().catch(console.error);
    }
  }, [soundEnabled]);

  const botReply = useCallback(
    async (userText) => {
      if (requestLock.current) {
        setMessages((prev) => [
          ...prev,
          {
            text: "Please wait until I finish responding.",
            sender: "bot",
            timestamp: new Date().toISOString(),
            isComplete: true,
          },
        ]);
        return;
      }

      requestLock.current = true;
      setIsThinking(true);

      try {
        const geminiText = await fetchGeminiResponse(userText);

        setIsThinking(false);
        setIsTyping(true);

        const newBotMessage = {
          text: "",
          sender: "bot",
          timestamp: new Date().toISOString(),
          isComplete: false,
        };

        setMessages((prev) => [...prev, newBotMessage]);
        playBotSound();

        let i = 0;
        const intervalId = setInterval(() => {
          if (i >= geminiText.length) {
            clearInterval(intervalId);
            setIsTyping(false);
            requestLock.current = false; // ✅ release the lock
            return;
          }

          setMessages((prev) => {
            const updated = [...prev];
            updated[updated.length - 1] = {
              ...updated[updated.length - 1],
              text: geminiText.substring(0, i + 1),
              isComplete: i + 1 === geminiText.length,
            };
            return updated;
          });

          i++;
        }, 30);
      } catch (err) {
        requestLock.current = false;
        console.error("Gemini error:", err);
        setIsThinking(false);
        setIsTyping(false);
        setMessages((prev) => [
          ...prev,
          {
            text: "Oops! Something went wrong.",
            sender: "bot",
            timestamp: new Date().toISOString(),
            isComplete: true,
          },
        ]);
      }
    },
    [fetchGeminiResponse, playBotSound]
  );

  const sendMessage = useCallback(
    (messageText) => {
      const newMessage = {
        text: messageText,
        sender: "user",
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, newMessage]);
      botReply(messageText);
    },
    [botReply]
  );

  // User data handling
  const updateUserData = useCallback((data) => {
    setUserData(data);
    localStorage.setItem("userData", JSON.stringify(data));
    localStorage.setItem("isRegistered", "true");
  }, []);

  const endChat = useCallback(() => {
    setMessages([]);
    setUserData({ username: "", email: "" });
    localStorage.removeItem("chatMessages");
    localStorage.removeItem("isRegistered");
    localStorage.removeItem("userData");
    updateChatVisibility({ isOpen: false });
  }, [updateChatVisibility]);

  const toggleSound = useCallback(() => {
    setSoundEnabled((prev) => {
      if (!prev) playBotSound();
      return !prev;
    });
  }, [playBotSound]);

  // Context value
  const value = useMemo(
    () => ({
      messages,
      setMessages,
      ...chatVisibility,
      unreadCount,
      sendMessage,
      toggleChat,
      endChat,
      playBotSound,
      soundEnabled,
      toggleSound,
      toggleMinimize,
      minimizeChat,
      setUnreadCount,
      scrollPosition,
      setScrollPosition,
      isTyping,
      revealMessage,
      setRevealMessage,
      isRegistered,
      userData,
      updateUserData,
      isThinking,
      setIsThinking,
    }),
    [
      messages,
      chatVisibility,
      unreadCount,
      sendMessage,
      toggleChat,
      endChat,
      playBotSound,
      soundEnabled,
      toggleSound,
      toggleMinimize,
      scrollPosition,
      isTyping,
      revealMessage,
      isRegistered,
      userData,
      isThinking,
      minimizeChat,
      updateUserData,
    ]
  );

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) throw new Error("useChat must be used within ChatProvider");
  return context;
};
