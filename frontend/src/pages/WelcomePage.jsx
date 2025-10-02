import { useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { useTheme } from "../context/ThemeContext";

/**
 * WelcomePage (4 sections)
 * 1) Banner image + Title
 * 2) Start button block (navigate)
 * 3) Login block (navigate)
 * 4) Help "?" button (bottom-right)
 */
export default function WelcomePage() {
  const { theme } = useTheme();
  const [open, setOpen] = useState(false);
  const popRef = useRef(null);
  const navigate = useNavigate();
  const onStart = () => navigate("/profile");
  const onLogin = () => {
    navigate("/login");
  };

  useEffect(() => {
    const onDown = (e) => {
      if (popRef.current && !popRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, []);

  return (
    <div
      className="welcome-page"
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        margin: "0 auto",
        paddingInline: "clamp(12px, 4vw, 24px)",
        boxSizing: "border-box",
      }}
    >
      <section
        style={{
          margin: "clamp(18px, 4vw, 40px)",
          display: "grid",
          placeItems: "center",
        }}
      ></section>

      {/* 1) banner + Title */}
      <section
        className="banner"
        style={{
          margin: 0,
          width: "100%",
          height: "clamp(140px, 30vh, 260px)",
          backgroundImage: "url(/Banner.png)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          display: "grid",
          placeItems: "center",
          textAlign: "center",
        }}
      >
        <div>
          <h1
            style={{
              margin: 0,
              fontSize: "clamp(36px, 8vw, 96px)",
              color: theme === "light" ? "#303030" : "#A7D3FC",
              fontFamily: "Yeseva One, serif",
              lineHeight: 1.1,
              paddingInline: "4vw",
            }}
          >
            Codesign Compass
          </h1>
        </div>
      </section>

      {/* 2) Start button block */}
      <section
        className="start-button"
        style={{
          marginTop: "clamp(32px, 8vw, 80px)",
          display: "grid",
          placeItems: "center",
        }}
      >
        <button
          /*onClick change colour*/
          /*cursor change colour */
          onClick={onStart}
          style={{
            fontSize: "clamp(20px, 3.2vw, 36px)",
            borderRadius: 8,
            padding: "clamp(6px, 1vw, 10px) clamp(16px, 3vw, 24px)",
            cursor: "pointer",
            border: "none",
            background: "#7F7FBC",
            fontFamily: "Yeseva One, serif",
            transition: "opacity 0.2s ease",
            opacity: 0.85,
          }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = 1)}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = 0.85)}
        >
          Start
        </button>
      </section>

      {/* 3) Login block */}
      <section
        className="login-link"
        style={{
          display: "grid",
          margin: "clamp(24px, 6vw, 50px)",
          placeItems: "center",
        }}
      >
        <div>
          <button
            onClick={onLogin}
            style={{
              fontSize: "clamp(14px, 2.4vw, 20px)",
              cursor: "pointer",
              border: "none",
              color: theme === "light" ? "black" : "white",
              background: "transparent",
              textDecoration: "underline",
              textUnderlineOffset: "4px",
              padding: "clamp(4px, 1vw, 10px) clamp(16px, 3vw, 25px)",
              textDecorationThickness: "1.5px",
              fontFamily: "Poppins, sans-serif",
              transition: "background 0.2s ease",
              borderRadius: 8,
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.background = "rgba(131, 124, 124, 0.48)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.background = "transparent")
            }
          >
            LOGIN
          </button>
        </div>
      </section>

      {/* 4) Help / "?" button */}
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          margin: "clamp(10px, 3vw, 20px) clamp(16px, 4vw, 30px)",
        }}
      >
        <div ref={popRef} style={{ position: "relative" }}>
          <button
            aria-label="Help"
            title="Help"
            onClick={() => setOpen((v) => !v)}
            style={{
              border: "none",
              background: "transparent",
              padding: 0,
              cursor: "pointer",
            }}
          >
            <img
              src="/Information.png"
              alt="Information"
              style={{ height: "clamp(20px, 5vw, 32px)", display: "block" }}
            />
          </button>

          {open && (
            <div
              role="tooltip"
              style={{
                position: "absolute",
                bottom: "calc(100% + 8px)",
                left: "calc(100% - 90px)",
                background: "#ffe070",
                padding: "12px 12px",
                transform: "translateX(-50%)",
                width: "clamp(150px, 60vw, 360px)",
                borderRadius: 8,
                boxShadow: "0 8px 24px rgba(0,0,0,.18)",
                zIndex: 1000,
              }}
            >
              <div
                style={{
                  fontSize: "clamp(12px, 1.4vw, 16px)",
                  lineHeight: 1.55,
                  fontFamily: "Poppins, sans-serif",
                  color: "#303030",
                }}
              >
                <p>Welcome to Codesign Compass.</p>
                <p>
                  This is a simple, secure, and interactive web app that invites
                  people with lived experience to shape a policy framework or
                  service access pathway.
                </p>
                <p>Thank you for your participation.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
