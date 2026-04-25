import React, { useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { Button } from "./ui/button";
import AiChatBubble from "./AiChatBubble";

export default function Layout({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { shareId } = useParams();
  const [onNextHandler, setOnNextHandler] = useState(null);

  const pages = shareId
    ? [
        `/share/${shareId}`,
        `/share/${shareId}/profile`,
        `/share/${shareId}/why`,
        `/share/${shareId}/how`,
        `/share/${shareId}/thankyou`,
      ]
    : ["/", "/profile", "/why", "/how", "/thankyou"];

  const currentIndex = pages.indexOf(location.pathname);
  const isWhyPage = location.pathname.endsWith('/why');
  const isHowPage = location.pathname.endsWith('/how');
  const { theme, toggleTheme } = useTheme();

  const goBack = () => {
    if (currentIndex > 0) navigate(pages[currentIndex - 1]);
  };

  const goNext = async () => {
    if (onNextHandler) {
      const canNavigate = await onNextHandler();
      if (canNavigate === false) return;
    }
    if (currentIndex < pages.length - 1) navigate(pages[currentIndex + 1]);
  };

  const childrenWithProps = React.Children.map(children, (child) => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child, { setOnNext: setOnNextHandler });
    }
    return child;
  });

  return (
    <div className="flex flex-col min-h-screen font-poppins">
      <header className="flex justify-center items-center relative px-4 py-4">
        <img
          src={theme === "light" ? "/Logo_light.png" : "/Logo_dark.png"}
          alt="Purpose Media Logo"
          className="h-[90px]"
        />

        {/* Top-right controls */}
        <div className="absolute right-4 flex items-center gap-3">
          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className="px-3 py-1.5 rounded-lg bg-transparent text-[var(--text-color)] cursor-pointer"
            style={{ paddingTop: "0" }}
          >
            <img
              src={theme === "light" ? "/light_mode.png" : "/dark_mode.png"}
              alt="Mode Icon"
              className="h-[30px] block"
            />
          </button>

          {/* Help / AI chat */}
          <AiChatBubble
            direction="down"
            initialMessage="Hello! I'm your AI assistant. I can help you navigate the app, explain the feedback process, and answer any questions."
          />
        </div>
      </header>

      <main className="flex-1 min-h-[70vh]">{childrenWithProps}</main>

      <footer
        className="flex justify-between items-center px-4 py-4"
        style={{ backgroundColor: theme === "light" ? "white" : "#303030" }}
      >
        {currentIndex > 0 && !isWhyPage && !isHowPage ? (
          <Button
            variant="plain"
            onClick={goBack}
            className="px-4 py-2 rounded-md"
            style={{
              background: theme === "light" ? "black" : "white",
              color: theme === "light" ? "white" : "black",
            }}
          >
            ← Back
          </Button>
        ) : (
          <div />
        )}

        {currentIndex > 0 && currentIndex < pages.length - 1 && !isWhyPage && !isHowPage ? (
          <Button
            variant="plain"
            onClick={goNext}
            className="px-4 py-2 rounded-md"
            style={{
              background: theme === "light" ? "black" : "white",
              color: theme === "light" ? "white" : "black",
            }}
          >
            Next →
          </Button>
        ) : (
          <div />
        )}
      </footer>
    </div>
  );
}
