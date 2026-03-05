import { useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { useTheme } from "../../context/ThemeContext";

/**
 * ThankyouPage (5 sections)
 * 1) Banner image + Title
 * 2) Subscribe block
 * 3) Join us block (navigate)
 * 4) Help "?" button (bottom-right)
 */
export default function ThankPage() {
  console.log("THANKPAGE VERSION: 2026-03-05 v2");
  const { theme } = useTheme();
  const [open, setOpen] = useState(false);
  const popRef = useRef(null);
  const [email, setEmail] = useState("");
  const [wantVoucher, setWantVoucher] = useState(false);
  const [wantUpdates, setWantUpdates] = useState(false);
  const navigate = useNavigate();
  const onLogin = (e) => {
    e.preventDefault();
    navigate("/createaccount");
  };


  const API_BASE = process.env.REACT_APP_API_BASE_URL || "http://localhost:8080";

  async function createSubmission(issueId) {
    const res = await fetch(`${API_BASE}/api/submissions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ issueId }),
    });

    const text = await res.text();
    if (!res.ok) throw new Error(text || `HTTP ${res.status}`);
    return text ? JSON.parse(text) : {};
  }

  async function submitSubmission(id, payload) {
    const res = await fetch(`${API_BASE}/api/submissions/${id}/submit`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const text = await res.text();
    if (!res.ok) throw new Error(text || `HTTP ${res.status}`);
    return text ? JSON.parse(text) : {};
  }

const onSubmit = async (e) => {
  e.preventDefault();

  const trimmed = email.trim();
  if(!trimmed.length) return;

  let submissionId = localStorage.getItem("submissionId");
  if (!submissionId) {
    const created = await createSubmission(1);
    const newId = created?.id ?? created?.submissionId;
    if (!newId) {
      alert("Created submission but no id returned. Check backend response.");
      console.log("createSubmission response:", created);
      return;
    }
    submissionId = String(newId);
    localStorage.setItem("submissionId", submissionId);
  }

  
  const payload = {
    email: trimmed.length ? trimmed : null,
    wantsVoucher: wantVoucher,
    wantsUpdates: wantUpdates,
  };

  try {
    const resp = await submitSubmission(submissionId, payload);
    console.log("submit ok:", resp);
    alert("Submitted successfully!");
    // setEmail("");
  } catch (err) {
    console.error(err);
    alert("Submit failed: " + err.message);
  }
}; 

  useEffect(() => {
    const onDown = (e) => {
      if (popRef.current && !popRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, []);

  const [helpForm, setHelpForm] = useState({ email: "", message: "" });
  const [helpSent, setHelpSent] = useState(false);
  const [helpErr, setHelpErr] = useState("");

  const handleHelpSubmit = (e) => {
    e.preventDefault();
    setHelpErr("");
    const validEmail = /^\S+@\S+\.\S+$/.test(helpForm.email);
    if (!validEmail) return setHelpErr("Please enter a valid email.");
    if (helpForm.message.trim().length < 5) {
      return setHelpErr("Tell us a bit more (≥ 5 characters).");
    }

    setHelpSent(true);
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
              color: theme === "light" ? "#303030" : "#ffe070",
              fontFamily: "Poppins, sans-serif",
              lineHeight: 1.1,
              paddingInline: "4vw",
            }}
          >
            Thanks
          </h1>
          <h2
            style={{
              marginTop: 0,
              fontSize: "clamp(24px, 3.2vw, 40px)",
              color: theme === "light" ? "#303030" : "#ffe070",
              fontFamily: "Poppins, sans-serif",
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
              />
              {helpSent ? (
                <div style={{ lineHeight: 1.55 }}>
                  <p style={{ margin: 0, fontWeight: 600 }}>Thanks! 🎉</p>
                  <p style={{ margin: "6px 0 0" }}>
                    We’ve received your message and will get back to you soon.
                  </p>
                </div>
              ) : (
                <form
                  onSubmit={handleHelpSubmit}
                  style={{ display: "grid", gap: 8 }}
                >
                  <label style={{ fontSize: 13 }}>
                    Email address
                    <input
                      type="email"
                      value={helpForm.email}
                      onChange={(e) =>
                        setHelpForm((f) => ({ ...f, email: e.target.value }))
                      }
                      placeholder="you@example.com"
                      style={{
                        width: "100%",
                        height: 38,
                        marginTop: 4,
                        borderRadius: 6,
                        border: "1px solid #d8c25b",
                        background: "#fff9c6",
                        padding: "0 10px",
                        outline: "none",
                      }}
                    />
                  </label>

                  <label style={{ fontSize: 13 }}>
                    Your question
                    <textarea
                      rows={3}
                      value={helpForm.message}
                      onChange={(e) =>
                        setHelpForm((f) => ({ ...f, message: e.target.value }))
                      }
                      placeholder="Tell us what's going on…"
                      style={{
                        width: "100%",
                        marginTop: 4,
                        borderRadius: 6,
                        border: "1px solid #d8c25b",
                        background: "#fffef0",
                        padding: "8px 10px",
                        resize: "vertical",
                        outline: "none",
                      }}
                    />
                  </label>

                  {helpErr && (
                    <div style={{ color: "#9b1c1c", fontSize: 12 }}>
                      {helpErr}
                    </div>
                  )}

                  <div
                    style={{
                      display: "flex",
                      gap: 8,
                      justifyContent: "flex-end",
                      marginTop: 2,
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => setOpen(false)}
                      style={{
                        height: 32,
                        padding: "0 10px",
                        borderRadius: 6,
                        border: "1px solid rgba(0,0,0,.15)",
                        background: "#fff",
                        color: "#303030",
                        cursor: "pointer",
                      }}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      style={{
                        height: 32,
                        padding: "0 12px",
                        borderRadius: 6,
                        border: "none",
                        background: "#303030",
                        color: "#ffe070",
                        cursor: "pointer",
                        boxShadow: "0 1px 0 rgba(0,0,0,.2)",
                      }}
                    >
                      Send
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
