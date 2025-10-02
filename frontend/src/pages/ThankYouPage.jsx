import { useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { useTheme } from "../context/ThemeContext";

/**
 * ThankyouPage (5 sections)
 * 1) Banner image + Title
 * 2) Subscribe block
 * 3) Join us block (navigate)
 * 4) Help "?" button (bottom-right)
 */
export default function ThankPage() {
  const { theme } = useTheme();
  const [open, setOpen] = useState(false);
  const popRef = useRef(null);
  const [email, setEmail] = useState("");
  const [wantVoucher, setWantVoucher] = useState(false);
  const [wantUpdates, setWantUpdates] = useState(false);
  const navigate = useNavigate();
  const onLogin = (e) => {
    e.preventDefault();
    navigate("/login");
  };

  useEffect(() => {
    const onDown = (e) => {
      if (popRef.current && !popRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, []);

  const onSubmit = (e) => {
    e.preventDefault();
    if (!email) return;
    localStorage.setItem("email", email);
    alert("Email saved: " + email);
    setEmail("");
  };

  return (
    <div
      className="thankyou-page"
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
              fontSize: "clamp(30px, 8vw, 96px)",
              color: theme === "light" ? "#303030" : "#A7D3FC",
              fontFamily: "Yeseva One, serif",
              lineHeight: 1.1,
              paddingInline: "4vw",
            }}
          >
            Thanks
          </h1>
          <h2
            style={{
              marginTop: -5,
              fontSize: "clamp(24px, 3.2vw, 40px)",
              color: theme === "light" ? "#303030" : "#A7D3FC",
              fontFamily: "Yeseva One",
            }}
          >
            for sharing your experience
          </h2>
        </div>
      </section>

      {/* 2) subscribe block */}
      <section
        style={{
          margin: "32px auto",
          textAlign: "center",
        }}
      >
        <div className="GiftInformation">
          <p
            style={{
              margin: 0,
              color: "#ffe070",
              textAlign: "center",
              fontSize: "clamp(14px, 2.4vw, 20px)",
              lineHeight: 1.4,
              fontWeight: 700,
              fontFamily: "Poppins, sans-serif",
            }}
          >
            Give us your email for $10 Coles voucher or more
          </p>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            margin: "clamp(14px, 4vw, 24px) 0",
          }}
        >
          <form
            onSubmit={onSubmit}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              flexWrap: "nowrap",
              width: "100%",
            }}
          >
            <div
              style={{
                position: "relative",
                flex: "1 1 clamp(220px, 70vw, 420px)",
                minWidth: 0,
              }}
            >
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  width: "100%",
                  height: "clamp(30px, 3vw, 46px)",
                  borderRadius: 8,
                  border: "1px solid #cfcfcf",
                  background: "#fff",
                  position: "relative",
                  fontSize: "clamp(12px, 2vw, 18px)",
                  outline: "none",
                  fontFamily: "Poppins, sans-serif",
                }}
                required
              />
              {email && (
                <button
                  type="button"
                  onClick={() => setEmail("")}
                  aria-label="Clear"
                  style={{
                    position: "absolute",
                    right: 8,
                    top: "50%",
                    transform: "translateY(-50%)",
                    width: 24,
                    height: 24,
                    border: "none",
                    background: "transparent",
                    cursor: "pointer",
                    fontSize: "clamp(12px, 4vw, 18px)",
                    color: "grey",
                    lineHeight: 1,
                    zIndex: 1,
                    fontFamily: "Poppins, sans-serif",
                  }}
                >
                  ×
                </button>
              )}
            </div>

            <button
              type="submit"
              style={{
                margin: "5px",
                flex: "0 0 auto",
                fontSize: "clamp(12px, 1.5vw, 16px)",
                borderRadius: 8,
                padding: "clamp(5px, 1vw, 10px) clamp(7px, 1.5vw, 14px)",
                cursor: "pointer",
                border: "1.5px solid #ffe070",
                color: theme === "light" ? "#303030" : "white",
                background: "#7F7FBC",
                whiteSpace: "nowrap",
                fontFamily: "Poppins, sans-serif",
                opacity: 0.85,
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = 1)}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = 0.85)}
            >
              Submit
            </button>
          </form>
        </div>

        <div
          className="checkBox"
          style={{
            marginTop: "clamp(18px, 3vw, 30px)",
            display: "grid",
            gap: 14,
            textAlign: "left",
          }}
        >
          <label
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-start",
              gap: 12,
            }}
          >
            <input
              type="checkbox"
              checked={wantVoucher}
              onChange={(e) => setWantVoucher(e.target.checked)}
              style={{
                width: 18,
                height: 18,
                accentColor: "#ffe070",
                cursor: "pointer",
                flexShrink: 0,
              }}
            />
            <span
              style={{
                fontSize: "clamp(12px, 2vw, 16px)",
                fontWeight: 600,
                color: theme === "light" ? "black" : "white",
                fontFamily: "Poppins, sans-serif",
                lineHeight: 1.4,
              }}
            >
              Send me a $10 Coles voucher
            </span>
          </label>

          <label
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-start",
              gap: 12,
              flex: 1,
            }}
          >
            <input
              type="checkbox"
              checked={wantUpdates}
              onChange={(e) => setWantUpdates(e.target.checked)}
              style={{
                width: 18,
                height: 18,
                accentColor: "#ffe070",
                cursor: "pointer",
                flexShrink: 0,
              }}
            />
            <span
              style={{
                fontSize: "clamp(12px, 2vw, 16px)",
                fontWeight: 600,
                color: theme === "light" ? "black" : "white",
                fontFamily: "Poppins, sans-serif",
                lineHeight: 1,
                flex: 1,
              }}
            >
              Keep me updated with the latest information
            </span>
          </label>
        </div>
      </section>

      {/* 3) Join button block */}
      <section
        className="join-button"
        style={{
          margin: "clamp(18px, 3vw, 30px)",
          display: "grid",
          placeItems: "center",
        }}
      >
        <button
          onClick={onLogin}
          style={{
            fontSize: "clamp(18px, 3.2vw, 30px)",
            borderRadius: 8,
            padding: "5px 20px",
            cursor: "pointer",
            border: "2px solid #ffe070",
            color: theme === "light" ? "#303030" : "white",
            background: "#7F7FBC",
            textDecoration: "underline",
            textUnderlineOffset: "4px",
            textDecorationThickness: "1.5px",
            fontFamily: "Poppins, sans-serif",
            opacity: 0.85,
          }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = 1)}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = 0.85)}
        >
          Join Us
        </button>
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
                left: "calc(100% - 130px)",
                background: "#ffe070",
                padding: "12px 12px",
                transform: "translateX(-50%)",
                width: "clamp(200px, 60vw, 360px)",
                borderRadius: 8,
                boxShadow: "0 8px 24px rgba(0,0,0,.18)",
                zIndex: 1000,
              }}
            >
              <div
                style={{
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
