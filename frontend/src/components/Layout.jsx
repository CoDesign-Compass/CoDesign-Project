export default function Layout({ children }) {
    return (
        <div className="app-layout" style={{ fontFamily: "sans-serif" }}>
            {/* Header */}
            <header
                style={{
                    backgroundColor: "#fff",
                    padding: "1rem",
                    textAlign: "center",
                    borderBottom: "1px solid #eee"
                }}
            >
                <img
                    src="/logo192.png" // 先用 React 默认 logo 占位，后面换成你们的 logo
                    alt="Purpose Media Logo"
                    style={{ height: "50px", marginBottom: "0.5rem" }}
                />
                <h2 style={{ color: "#ffe071", margin: 0 }}>
                    Lived Experience Profile Builder
                </h2>
            </header>

            {/* Main content */}
            <main style={{ minHeight: "70vh", padding: "2rem" }}>
                {children}
            </main>

            {/* Footer */}
            <footer
                style={{
                    backgroundColor: "#fff",
                    padding: "1rem",
                    display: "flex",
                    justifyContent: "space-between",
                    borderTop: "1px solid #eee"
                }}
            >
                <button
                    style={{
                        background: "black",
                        color: "white",
                        padding: "0.5rem 1rem",
                        borderRadius: "6px",
                        border: "none"
                    }}
                >
                    ← Back
                </button>
                <button
                    style={{
                        background: "black",
                        color: "white",
                        padding: "0.5rem 1rem",
                        borderRadius: "6px",
                        border: "none"
                    }}
                >
                    Next →
                </button>
            </footer>
        </div>
    );
}
