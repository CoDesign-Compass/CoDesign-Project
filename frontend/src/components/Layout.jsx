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
                    src="/logo192.png" // 占位，用你们的 logo 文件替换
                    alt="Purpose Media Logo"
                    style={{ height: "50px" }}
                />
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
