export const getTheme = (darkMode, setDarkMode) => ({
  darkMode,
  toggleDarkMode: () => setDarkMode((prev) => !prev),
  colors: {
    // Text and UI colors
    text: darkMode
      ? "text-[var(--color-white)]"
      : "text-[var(--color-primary)]",
    border: darkMode ? "border-white" : "border-[var(--color-primary)]",
    chatBorder: darkMode
      ? "border border-[var(--subtle-gray-accent)]"
      : "border-0",
    toggleBg: darkMode
      ? "bg-[var(--color-white)]"
      : "bg-[var(--color-secondary)]",

    chatHeader: {
      text: "text-[var(--color-white)]",
      icons: {
        static: darkMode ? "text-white" : "text-[var(--color-secondary)]",
        hover: "hover:text-[#aaa]",
      },
    },

    // Icon visibility
    icon: {
      moon: darkMode ? "opacity-0" : "opacity-100",
      sun: darkMode ? "opacity-70" : "opacity-0",
    },

    // Backgrounds
    background: darkMode
      ? "bg-[var(--color-background-dark)]"
      : "bg-[var(--color-background-light)]",
    headerBg: darkMode
      ? "bg-[var(--color-header-dark)]"
      : "bg-[var(--color-header-light)]",

    // DropdownBG and Text Color
    dropdownStyles: darkMode
      ? "bg-[var(--color-background-light)] text-[var(--color-primary)]"
      : "bg-[var(--color-background-light)] text-[var(--color-primary)]",

    // Chat-specific colors
    chatBodyBg: darkMode ? "bg-[rgba(255,255,255,0.08)]" : "bg-white",
    botMessageBg: darkMode ? "bg-[rgba(255,255,255,0.20)]" : "bg-[#eee]",
    userMessageBg: darkMode
      ? "bg-[var(--color-tertiary)]"
      : "bg-[var(--color-tertiary)]",
    timestampText: darkMode ? "text-[var(--color-secondary)]" : "text-gray-400",
    messageText: darkMode ? "text-white" : "text-[var(--color-primary)]",
    userMessageText: "text-[var(--color-primary)]",
    botIconBg: darkMode
      ? "bg-[var(--color-tertiary)]"
      : "bg-[var(--super-light-gray)]",

    iconColor: darkMode
      ? "text-[var(--color-primary)]"
      : "text-[var(--color-primary)]",

    // Custom colors for the footer and input
    chatFooter: {
      border: darkMode
        ? "border-[var(--subtle-gray-accent)]"
        : "border-[var(--subtle-gray-accent)]",
      inputBorder: darkMode
        ? "border-[var(--subtle-gray-accent)]"
        : "border-[var(--subtle-gray-accent)]",
      inputBg: darkMode ? "bg-transparent" : "bg-white",
    },

    // Chat window border and shadow styles
    chatWindow: {
      border: darkMode ? "border-white/50" : "border-0",
      boxShadow: darkMode ? "" : "shadow-lg",
    },

    // ChatPopup button styles (fixed structure)
    popupButton: {
      base: "relative p-4 rounded-full flex items-center justify-center transition-colors duration-150",
      colors: {
        bg: darkMode
          ? "bg-[var(--color-secondary)]"
          : "bg-[var(--color-primary)]",
        text: darkMode
          ? "text-[var(--color-primary)]"
          : "text-[var(--color-secondary)]",
        hoverBg: darkMode
          ? "hover:bg-[var(--color-primary)]"
          : "hover:bg-[var(--color-secondary)]",
        hoverText: darkMode
          ? "hover:text-[var(--color-secondary)]"
          : "hover:text-[var(--color-primary)]",
      },
    },

    // ChatPopup icon styles (explicitly defined)
    popupIcon: {
      base: "absolute top-0 left-0 transition-all duration-300 ease-in-out",
      open: "opacity-0 scale-0 rotate-180",
      close: "opacity-100 scale-100 rotate-0",
    },
    popupCloseIcon: {
      base: "absolute top-0 left-0 transition-all duration-300 ease-in-out",
      open: "opacity-100 scale-100 rotate-0",
      close: "opacity-0 scale-0 -rotate-180",
    },

    // Chat Input and Paper Plane Icon Customizations
    chatInput: {
      text: darkMode ? "text-white" : "text-[var(--color-primary)]",
      background: darkMode ? "bg-transparent" : "bg-[var(--color-white)",
      border: darkMode
        ? "border-[var(--subtle-gray-accent)]"
        : "border-[var(--subtle-gray-accent)]",
      borderRadius: "rounded-full",
      focus: {
        light: {
          border: "focus:border-[var(--color-secondary)]",
          ring: "focus:ring-[var(--color-secondary)] focus:ring-opacity-30",
        },
        dark: {
          border: "focus:border-white",
          ring: "focus:ring-white focus:ring-opacity-30",
        },
      },
    },

    // Paper Plane Icon Styles
    paperPlaneIcon: {
      light: {
        button: {
          base: "bg-[var(--subtle-gray-accent)]",
          hover: "hover:bg-[var(--color-primary)]",
        },
        icon: {
          base: "text-[var(--color-primary)]",
          hover: "group-hover:text-[var(--subtle-gray-accent)]",
        },
      },
      dark: {
        button: {
          base: "bg-[var(--color-secondary)]",
          hover: "hover:bg-[var(--color-white)]",
        },
        icon: {
          base: "text-[var(--color-primary)]",
          hover: "group-hover:text-[var(--color-secondary)]",
        },
      },
      transition: "transition-all duration-200 ease-in-out",
    },
  },
  togglePosition: darkMode ? "left: 0.40rem" : "left: calc(100% - 1.65rem)",
  transitions: "transition-all duration-300",
});

export default getTheme;
