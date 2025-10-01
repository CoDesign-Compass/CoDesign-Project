import React, { useEffect, useRef, useState } from "react";

export default function LoginPage({ mode = "create", onSubmit: onSubmitProp }) {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirm: "",
    subscribe: false, 
  });
  const [showPw, setShowPw] = useState(false);

  // Help bubble
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

  return (
    <div
      className="CreateAccount page"
      style={{
        minHeight: "100svh",
        background: "#303030",
        color: "#303030",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* hide label helper class from user */}
      <style>{`
        .sr-only{position:absolute!important;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,1px,1px);white-space:nowrap;border:0;}
        .input{width:100%;height:44px;border-radius:8px;border:1px solid #d8d8d8;background:#fff;color:#111;padding:0 44px 0 12px;font-size:16px;outline:none;}
        .input:focus{border-color:#7aa2ff;}
      `}</style>

      {/* Logo */}
      <header style={{ background: "#303030", boxShadow: "0 1px 0 rgba(0,0,0,.06)" }}>
        <div style={{ height: 80, display: "grid", placeItems: "center" }}>
          <img src="/logo.png" alt="Purpose Media" style={{ height: 50 }} />
        </div>
      </header>

      {/* dark background */}
      <div style={{ background: "#303030", color: "#fff" }}>
        <section
          style={{
            width: "100vw",
            marginLeft: "calc(50% - 50vw)", 
            marginRight: "calc(50% - 50vw)",
            height: 120,
            backgroundImage: "url(/Banner.png)", 
            backgroundSize: "cover",
            backgroundPosition: "center",
            display: "grid",
            placeItems: "center",
            textAlign: "center",
          }}
        >
          <h1
            style={{
              margin: 0,
              fontSize: 44, 
              color: "#BFC8FF",
              letterSpacing: 1,
              textShadow: "0 1px 2px rgba(0,0,0,.35)",
            }}
          >
            Create Account
          </h1>
        </section>

        {/* body of the form */}
        <main style={{ 
            width:"100%", 
            display:"grid", 
            placeItems:"center", 
            padding:"28px 12px 32px" }}>

          <form
            onSubmit={handleSubmit}
            noValidate
            style={{
              width: "min(560px, 92vw)",
              display: "grid",
              gap: 16,
            }}
          >
            {/* Username */}
            {mode === "create" && (
              <div style={{ display: "grid", gap: 6 }}>
                <label className="sr-only" htmlFor="username">
                  Username
                </label>
                <div style={{ position: "relative" }}>
                  <input
                    id="username"
                    className="input"
                    value={form.username}
                    onChange={change("username")}
                    placeholder="Username"
                    autoComplete="username"
                  />
                  {!!form.username && (
                    <button
                      type="button"
                      aria-label="Clear"
                      onClick={() => setForm((f) => ({ ...f, username: "" }))}
                      style={suffixBtn(12)}
                    >
                      ×
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Email */}
            <div style={{ display: "grid", gap: 6 }}>
              <label className="sr-only" htmlFor="email">
                Email
              </label>
              <div style={{ position: "relative" }}>
                <input
                  id="email"
                  type="email"
                  className="input"
                  value={form.email}
                  onChange={change("email")}
                  placeholder="Email"
                  autoComplete="email"
                />
                {!!form.email && (
                  <button
                    type="button"
                    aria-label="Clear"
                    onClick={() => setForm((f) => ({ ...f, email: "" }))}
                    style={suffixBtn(12)}
                  >
                    ×
                  </button>
                )}
              </div>
            </div>

            {/* Password */}
            <div style={{ display: "grid", gap: 6 }}>
              <label className="sr-only" htmlFor="password">
                Password
              </label>
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
                {/* Show/Hide text button */}
                <button
                  type="button"
                  onClick={() => setShowPw((s) => !s)}
                  style={{
                    position: "absolute",
                    right: 12,
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "transparent",
                    border: "none",
                    color: "#7a7a7a",
                    cursor: "pointer",
                    fontSize: 15,
                  }}
                >
                  {showPw ? "Hide" : "Show"}
                </button>
                {/* clear all */}
                {!!form.password && (
                  <button
                    type="button"
                    aria-label="Clear"
                    onClick={() => setForm((f) => ({ ...f, password: "" }))}
                    style={suffixBtn(56)} 
                  >
                    ×
                  </button>
                )}
              </div>
            </div>

            {/* Confirm Password */}
            {mode === "create" && (
              <div style={{ display: "grid", gap: 6 }}>
                <label className="sr-only" htmlFor="confirm">
                  Confirm Password
                </label>
                <div style={{ position: "relative" }}>
                  <input
                    id="confirm"
                    type="password"
                    className="input"
                    value={form.confirm}
                    onChange={change("confirm")}
                    placeholder="Confirm Password"
                    autoComplete="new-password"
                  />
                  {!!form.confirm && (
                    <button
                      type="button"
                      aria-label="Clear"
                      onClick={() => setForm((f) => ({ ...f, confirm: "" }))}
                      style={suffixBtn(12)}
                    >
                      ×
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* subscribr（untick by default） */}
            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                marginTop: 4,
                fontSize: 14,
                color: "#ddd",
              }}
            >
              <input
                type="checkbox"
                checked={form.subscribe}
                onChange={change("subscribe")}
                style={{ width: 16, height: 16, accentColor: "#ffe070", cursor: "pointer" }}
              />
              <span>Keep me updated with the latest information</span>
            </label>

            {/* Sign Up button） */}
            <div style={{ display: "grid", justifyItems: "center", marginTop: 10 }}>
              <button
                type="submit"
                style={{
                  minWidth: 240,
                  padding: "14px 28px",
                  borderRadius: 16,
                  background: "#2f2f2f",
                  border: "4px solid #ffe070",
                  color: "#fff",
                  cursor: "pointer",
                  boxShadow: "0 2px 0 rgba(0,0,0,.25), inset 0 0 0 1px rgba(0,0,0,.08)",
                }}
              >
                <span
                  style={{
                    fontSize: 32, 
                    lineHeight: 1.1,
                    fontWeight: 500,
                    textDecoration: "underline",
                    textDecorationColor: "#fff",
                    textDecorationThickness: "2px",
                    textUnderlineOffset: "6px",
                  }}
                >
                  Sign Up
                </span>
              </button>
            </div>
          </form>
        </main>

        {/* lower right Help button */}
        <div
            ref={popRef}
            style={{
                position: "fixed",
                right: 24,
                bottom: 24,
                zIndex: 1000
            }}
        >
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
                  color: "#303030",
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
                  <p>Need help? Contact us anytime.</p>
                </div>
              </div>
            )}
          </div>
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