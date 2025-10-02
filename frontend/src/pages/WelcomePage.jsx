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
      className="Welcome page"
      style={{
        display: "flex",
        flexDirection: "column",
      }}
    >
      <section
        style={{ margin: "40px auto", display: "grid", placeItems: "center" }}
      ></section>

      {/* 1) banner + Title */}
      <section
        className="banner"
        style={{
          margin: 0,
          width: "100%",
          height: 200,
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
              fontSize: "96px",
              color: theme === "light" ? "#303030" : "#A7D3FC",
              fontFamily: "Yeseva One",
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
          marginBottom: "40px",
          marginTop: "80px",
          display: "grid",
          placeItems: "center",
        }}
      >
        <button
          /*onClick change colour*/
          /*cursor change colour */
          onClick={onStart}
          style={{
            fontSize: "36px",
            borderRadius: 8,
            padding: "5px 20px",
            cursor: "pointer",
            border: "none",
            background: "#7F7FBC",
            fontFamily: "Yeseva One",
          }}
        >
          Start
        </button>
      </section>

      {/* 3) Login block */}
      <section
        className="login-link"
        style={{ display: "grid", marginBottom: "50px", placeItems: "center" }}
      >
        <div>
          <button
            /*onClick change colour*/
            /*cursor change colour */
            onClick={onLogin}
            style={{
              fontSize: "20px",
              cursor: "pointer",
              border: "none",
              color: theme === "light" ? "black" : "white",
              background: "transparent",
              textDecoration: "underline",
              textUnderlineOffset: "4px",
              textDecorationThickness: "1.5px",
              fontFamily: "Poppins",
            }}
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
          margin: "20px 30px 20px",
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
              style={{ height: 30, display: "block" }}
            />
          </button>

          {open && (
            <div
              role="tooltip"
              style={{
                position: "absolute",
                bottom: "calc(100% + 8px)",
                right: 0,
                width: "min(320px, 86vw)",
                background: "#ffe070",
                color: "#000",
                padding: "12px 14px",
                borderRadius: 8,
                boxShadow: "0 8px 24px rgba(0,0,0,.18)",
                zIndex: 1000,
              }}
            >
              <div
                style={{
                  position: "absolute",
                  bottom: -6,
                  right: 14,
                  width: 12,
                  height: 12,
                  background: "#fff",
                  transform: "rotate(45deg)",
                  boxShadow: "-1px 1px 2px rgba(0,0,0,.05)",
                }}
              />
              <div
                style={{
                  lineHeight: 1.55,
                  fontFamily: "Poppins",
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
