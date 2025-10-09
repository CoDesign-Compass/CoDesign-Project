import React, { useEffect, useRef, useState } from "react";

export default function LoginPage({ mode = "create", onSubmit: onSubmitProp }) {

  // ---- FORM ----
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirm: "",
    subscribe: false,
  });
  const [showPw, setShowPw] = useState(false);

  // ---- Help bubble outside-click ----
  const [open, setOpen] = useState(false);
  const popRef = useRef(null);
  useEffect(() => {
    const onDown = (e) => {
      if (popRef.current && !popRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, []);

  const change = (k) => (e) =>
    setForm((f) => ({
      ...f,
      [k]: e.target.type === "checkbox" ? e.target.checked : e.target.value,
    }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (mode === "create" && form.password !== form.confirm) {
      alert("Passwords do not match.");
      return;
    }
    onSubmitProp?.(form);
  };

  const container = { width: "min(960px, 92vw)", margin: "0 auto" };

  return (
    <div
      className="CreateAccount page"
      style={{
        background: "var(--bg-color)",     
        color: "var(--text-color)",
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
      }}
    >
  
      <div style={{ background: "var(--bg-color)", color: "var(--text-color)" }}>
        <section
          style={{
            width: "100vw",
            marginLeft: "calc(50% - 50vw)",
            marginRight: "calc(50% - 50vw)",
            height: 120,
            backgroundImage: "url(/Banner.png)",
            backgroundSize: "cover",
            backgroundPosition: "center",
            position: "relative",
            display: "grid",
            placeItems: "center",
            textAlign: "center",
          }}
        >
          <div style={{ position: "absolute", inset: 0 }} />
          <h1
            className="hero-title"
            style={{
              margin: 0,
              fontSize: 44,
              color: "var(--heading)",      
              letterSpacing: 1,
              textShadow: "0 1px 2px rgba(0.3,0.5,0.7,.5)",
            }}
          >
            Create Account
          </h1>
        </section>

        <main style={{ width: "100%", display: "grid", placeItems: "center", padding: "32px 12px 40px" }}>
          <style>{`
            .sr-only{position:absolute!important;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,1px,1px);white-space:nowrap;border:0;}
            .input{width:100%;height:44px;border-radius:8px;border:1px solid #d8d8d8;background:#fff;color:#111;padding:0 44px 0 12px;font-size:16px;outline:none;}
            .input:focus{border-color:#7aa2ff;}
          `}</style>

          <form className="form-wrap" onSubmit={handleSubmit} noValidate style={{ width: "min(560px, 92vw)", display: "grid", gap: 16, margin: "0 auto" }}>
            {mode === "create" && (
              <Field id="username" placeholder="Username" value={form.username}
                onChange={change("username")} onClear={() => setForm((f) => ({ ...f, username: "" }))} />
            )}
            <Field id="email" type="email" placeholder="Email" value={form.email}
              onChange={change("email")} onClear={() => setForm((f) => ({ ...f, email: "" }))} />

            {/* Password */}
            <div style={{ display: "grid", gap: 6 }}>
              <label className="sr-only" htmlFor="password">Password</label>
              <div style={{ position: "relative" }}>
                <input
                  id="password"
                  type={showPw ? "text" : "password"}
                  className="input"
                  value={form.password}
                  onChange={change("password")}
                  placeholder="Password"
                  autoComplete={mode === "create" ? "new-password" : "current-password"}
                />
                <button
                  type="button"
                  onClick={() => setShowPw((s) => !s)}
                  style={{
                    position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)",
                    background: "transparent", border: "none", color: "#7a7a7a", cursor: "pointer", fontSize: 15,
                  }}
                >
                  {showPw ? "Hide" : "Show"}
                </button>
                {!!form.password && (
                  <button type="button" aria-label="Clear"
                    onClick={() => setForm((f) => ({ ...f, password: "" }))} style={suffixBtn(56)}>×</button>
                )}
              </div>
            </div>

            {mode === "create" && (
              <Field id="confirm" type="password" placeholder="Confirm Password" value={form.confirm}
                onChange={change("confirm")} onClear={() => setForm((f) => ({ ...f, confirm: "" }))} />
            )}

            <label style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 4, fontSize: 14, color: "var(--text-color)", opacity: 0.9 }}>
              <input
                type="checkbox"
                checked={form.subscribe}
                onChange={change("subscribe")}
                style={{ width: 16, height: 16, accentColor: "#ffe070", cursor: "pointer" }}
              />
              <span>Keep me updated with the latest information</span>
            </label>

            <div style={{ display: "grid", justifyItems: "center", marginTop: 10 }}>
              <button
                className="cta-btn"
                type="submit"
                style={{
                  minWidth: 240, padding: "12px 24px", borderRadius: 14,
                  background: "#2f2f2f", border: "2.5px solid #ffe070", color: "#fff", cursor: "pointer",
                  boxShadow: "0 2px 0 rgba(0,0,0,.5), inset 0 0 0 1px rgba(0,0,0,.2)",
                }}
              >
                <span style={{
                  fontSize: 22, lineHeight: 1.1, fontWeight: 500,
                  textDecorationColor: "#fff", textDecorationThickness: "1.5px", textUnderlineOffset: "4px",
                }}>
                  Sign Up
                </span>
              </button>
            </div>
          </form>
        </main>

        {/* Help bubble */}
        <div style={{ ...container, display: "flex", justifyContent: "flex-end", padding: "0 0 16px" }}>
          <div ref={popRef} style={{ position: "relative" }}>
            <button aria-label="Help" title="Help"
              onClick={() => setOpen((v) => !v)}
              style={{ border: "none", background: "transparent", padding: 0, cursor: "pointer" }}>
              <img src="/Information.png" alt="Information" style={{ height: 30, display: "block" }} />
            </button>
            {open && (
              <div role="tooltip" style={{
                position: "absolute", bottom: "calc(100% + 8px)", right: 0, width: "min(320px, 86vw)",
                background: "#ffe070", color: "#303030", padding: "12px 14px", borderRadius: 8,
                boxShadow: "0 8px 24px rgba(0,0,0,.18)", zIndex: 1000,
              }}>
                <div style={{
                  position: "absolute", bottom: -6, right: 14, width: 12, height: 12,
                  background: "#fff", transform: "rotate(45deg)", boxShadow: "-1px 1px 2px rgba(0,0,0,.05)",
                }} />
                <div style={{ lineHeight: 1.55 }}><p>Need help? Contact us anytime.</p></div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* small field helper */
function Field({ id, type = "text", placeholder, value, onChange, onClear }) {
  return (
    <div style={{ display: "grid", gap: 6 }}>
      <label className="sr-only" htmlFor={id}>{placeholder}</label>
      <div style={{ position: "relative" }}>
        <input id={id} type={type} className="input" value={value} onChange={onChange} placeholder={placeholder} autoComplete={id} />
        {!!value && (<button type="button" aria-label="Clear" onClick={onClear} style={suffixBtn(12)}>×</button>)}
      </div>
    </div>
  );
}

/*clear all button(×) */
function suffixBtn(rightPx) {
  return {
    position: "absolute",
    right: rightPx,
    top: "50%",
    transform: "translateY(-50%)",
    width: 28,
    height: 28,
    border: "none",
    background: "transparent",
    cursor: "pointer",
    fontSize: 18,
    color: "grey",
    lineHeight: 1,
  };
}

