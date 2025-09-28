import React, { useState } from "react";

export default function Login({ mode = "create", onSubmit }){
    const [form, setForm] = useState({
        username:" ",
        email: " ",
        password: " ",
        confirm: " ",
        subscribe: true,
    });

    const isCreate = mode === "create";

    const handleChange = (k) => (e) =>
        setForm((s) => ({...s, [k]: e.target.type === "checkbox" ? e.target.checked : e.target.value }));

    const handleSubmit = (e) => {
        e.preventDefault();
        if(isCreate && form.password !== form.confirm){
            alert("Password do not match.");
            return;
        }
        onSubmit?.(form);
    };

    return (
        <div className="c-login" data-testid="login-page">
            <header className="c-login__header">
                <div className="c-login__logo" aria-label="Purpose Media logo" />
                 <div className="c-login__banner">
                     <h1 className="c-login__title">{isCreate ? "Create Account" : "Sign In"}</h1>
                </div>
            </header>

            <main className="c-login__main">
                 <section className="c-card c-login__form-card">
                    <form className="c-form" onSubmit={handleSubmit} noValidate>
                        {isCreate && (
                            <FormField
                                id="username"
                                label="Username"
                                value={form.username}
                                onChange={handleChange("username")}
                                autoComplete="username"
                            />
                             )}

                            <FormField
                                id="email"
                                type="email"
                                label="Email"
                                value={form.email}
                                onChange={handleChange("email")}
                                autoComplete="email"
                                />

                                <FormField
                                id="password"
                                type="password"
                                label="Password"
                                value={form.password}
                                onChange={handleChange("password")}
                                autoComplete={isCreate ? "new-password" : "current-password"}
                                />

                                {isCreate && (
                                    <FormField
                                        id="confirm"
                                        type="password"
                                        label="Confirm Password"
                                        value={form.confirm}
                                        onChange={handleChange("confirm")}
                                        autoComplete="new-password"
                                    />
                                )}

                                {isCreate && (
                                    <label className="c-check" htmlFor="subscribe">
                                        <input
                                        id="subscribe"
                                        type="checkbox"
                                        className="c-check__input"
                                        checked={form.subscribe}
                                        onChange={handleChange("subscribe")}
                                        />
                                        <span className="c-check__label">Keep me updated with the latest information</span>
                                    </label>
                                )}

                                <div className="c-form__actions">
                                <button className="c-btn c-btn--primary" type="submit" data-testid="submit">
                                    {isCreate ? "Sign Up" : "Sign In"}
                                </button>
                                </div>
                            </form>
                            </section>
                            <aside className="c-login__aside">
                            <div className="c-placeholder c-placeholder--outline">Right column placeholder</div>
                            </aside>
                        </main>
                        <button className="c-help" aria-label="Help">?</button>
                        </div>
  );
}

function FormField({
    id,
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  autoComplete,
}){
    return (
        <div className="c-field">
            <label className="c-field__label" htmlFor={id}>
            {label}
             </label>
            <div className="c-field__control">
                <input
                id={id}
                className="c-field__input"
                type={type}
                value={value}
                onChange={onChange}
                placeholder={placeholder || label}
                autoComplete={autoComplete}
                aria-invalid={false}
            />
            <div className="c-field__suffix" aria-hidden="true" />
      </div>
      <p className="c-field__error" role="alert" hidden>
      </p>
    </div>
    )
}

    
