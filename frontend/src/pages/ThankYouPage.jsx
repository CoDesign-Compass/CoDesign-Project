import { useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";

/**
 * ThankyouPage (5 sections)
 * 1) Banner image + Title
 * 2) Subscribe block
 * 3) Join us block (navigate)
 * 4) Help "?" button (bottom-right)
 */
export default function ThankPage() {
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
    <div className="Welcome page" style={{
        background: "#303030",
        display: "flex",
        flexDirection: "column",
      }}>

      <section style={{ margin: "50px auto", display: "grid", placeItems: "center"}}>
      </section>

      {/* 1) banner + Title */}
      <section className="banner" style={{
          margin: 0,
          width: "100%",
          height: 150,                           
          backgroundImage: "url(/Banner.png)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          display: "grid",
          placeItems: "center",
          textAlign: "center",
      }}>
          <div>
          <h1 style={{margin: 0, fontSize:"96px",color:"#A7D3FC"}}>
            Thanks
          </h1>
          <h2 style={{marginTop:-10, fontSize:"40px",color:"#A7D3FC"}}>
            for sharing your experience
          </h2>
        </div>
      </section>

      {/* 2) subscribe block */}
      <section style={{
        margin: "32px auto",
        textAlign: "centre",
        }}>

        <div className="GiftInformation">
            <p style={{
          margin: 0,
          color:"#ffe070",
          textAlign: "center",
          fontSize: "16px",
          lineHeight: 1.4,
          fontWeight: 700,
        }}>
                Give us your email for $10 Coles voucher or more 
            </p>
        </div>

        <div style={{ display: "flex", justifyContent: "center", margin: "24px 0"}}>
            <form
                onSubmit={onSubmit}
                style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "nowrap" }}
            >
                <div style={{ position: "relative", flex: "0 0 300px" }}>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{
                    width: "100%",  
                    height: 46,
                    borderRadius: 8,
                    border: "1px solid #cfcfcf",
                    background: "#fff",
                    position:"relative",
                    fontSize: 18,
                    outline: "none",
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
                        fontSize: 18,
                        color: "grey",
                        lineHeight: 1,
                        zIndex: 1,        
                    }}
                    >
                        X
                    </button>
                )}
                </div>

                <button
                type="submit"
                style={{
                    margin:"5px",
                    flex: "0 0 auto",
                    fontSize: 16,
                    borderRadius: 8,
                    padding: "10px 14px",
                    cursor: "pointer",
                    border: "1.5px solid #ffe070",
                    color: "#fff",
                    background: "#7F7FBC",
                    whiteSpace: "nowrap",
                }}
                >
                Submit
                </button>
            </form>
        </div>

        <div className="checkBox" style={{ marginTop: 18, display: "grid", gap: 14 }}>
            <label style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <input
                    type="checkbox"
                    checked={wantVoucher}
                    onChange={(e) => setWantVoucher(e.target.checked)}
                    style={{
                    width: 18,
                    height: 18,
                    accentColor:"#ffe070" ,
                    cursor: "pointer",
                    }}
                />
                <span style={{ fontSize: 16, fontWeight: 600,color:"white" }}>
                    Send me a $10 Coles voucher
                </span>
            </label>

            <label style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <input
                    type="checkbox"
                    checked={wantUpdates}
                    onChange={(e) => setWantUpdates(e.target.checked)}
                    style={{
                    width: 18,
                    height: 18,
                    accentColor: "#ffe070",
                    cursor: "pointer",
                    }}
                />
                <span style={{ fontSize: 16, fontWeight: 600,color:"white" }}>
                    Keep me updated with the latest information
                </span>
            </label>
      </div>
      </section>

      {/* 3) Join button block */}
      <section className="join-button" style={{margin:"30px", display: "grid", placeItems: "center"}}>
        <button
         /*onClick change colour*/
         /*cursor change colour */
          onClick={onLogin}
          style={{fontSize:"30px",
            borderRadius:"3px",
            padding: "5px 20px", 
            cursor:"pointer",
            border:"2px solid #ffe070",
            color:"white",
            background:"#7F7FBC",
            textDecoration: "underline",       
            textUnderlineOffset: "4px",       
            textDecorationThickness: "1.5px"  }}
        >
          Join Us
        </button>
      </section>

      {/* 4) Help / "?" button */}
      <div style={{ display: "flex", justifyContent: "flex-end", margin: "20px 30px 10px" }}>
        <div ref={popRef} style={{ position: "relative" }}>
          <button
            aria-label="Help"
            title="Help"
            onClick={() => setOpen((v) => !v)}
            style={{ border: "none", background: "transparent", padding: 0, cursor: "pointer" }}
          >
            <img src="/Information.png" alt="Information" style={{ height: 30, display: "block" }} />
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
              <div style={{ lineHeight: 1.55 }}>
                <p>Welcome to Codesign Compass.</p>
                <p>This is a simple, secure, and interactive web app that invites people with lived experience to shape a policy framework or service access pathway.</p>
                <p>Thank you for your participation.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
