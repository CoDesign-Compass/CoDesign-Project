import { useLocation, useNavigate } from "react-router-dom";

export default function Layout({ children }) {
    const location = useLocation();
    const navigate = useNavigate();

    // 定义页面顺序
    const pages = ["/","/profile", "/why", "/how", "/thankyou"];
    const currentIndex = pages.indexOf(location.pathname);

    const goBack = () => {
        if (currentIndex > 0) {
            navigate(pages[currentIndex - 1]);
        }
    };

    const goNext = () => {
        if (currentIndex < pages.length - 1) {
            navigate(pages[currentIndex + 1]);
        }
    };

    return (
        <div className="app-layout" style={{ fontFamily: "sans-serif" }}>
            {/* Header */}
            <header
                style={{
                    backgroundColor: "#fff",
                    padding: "1rem",
                    textAlign: "center",
                }}
            >
                <img
                    src="/logo.png"
                    alt="Purpose Media Logo"
                    style={{ height: "50px" }}
                />
            </header>

            {/* Main content */}
            <main style={{ minHeight: "70vh"}}>
                {children}
            </main>

            {/* Footer with navigation */}
            <footer
                style={{
                    backgroundColor: "#fff",
                    padding: "1rem",
                    display: "flex",
                    justifyContent: "space-between",
                    borderTop: "1px solid #eee"
                }}
            >
                {/* Back 按钮（第一页隐藏） */}
                {currentIndex > 0 ? (
                    <button
                        onClick={goBack}
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
                ) : (
                    <div></div>
                )}

                {/* Next 按钮（最后一页隐藏） */}
                {currentIndex < pages.length - 1 ? (
                    <button
                        onClick={goNext}
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
                ) : (
                    <div></div>
                )}
            </footer>
        </div>
    );
}
