import { Link, Outlet } from "react-router-dom";

export default function AdminLayout() {
    return (
        <div style={{ display: "flex", minHeight: "100vh" }}>
            {/* Sidebar */}
            <aside
                style={{
                    width: "220px",
                    backgroundColor: "#fff7cc", // 柔和黄色背景
                    borderRight: "1px solid #ddd",
                    padding: "1.5rem",
                }}
            >
                <h2 style={{ fontWeight: "bold", color: "#000", marginBottom: "2rem" }}>
                    CoDesignCompass
                </h2>

                <nav style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                    <Link to="/admin/dashboard">Dashboard</Link>
                    <Link to="/admin/new-issue">New Issue</Link>
                    <Link to="/admin/issue-report">Issue Report</Link>
                    <Link to="/admin/why-report">Why Report</Link>
                    <Link to="/admin/how-report">How Report</Link>
                    <Link to="/admin/profile-report">Profile Report</Link>
                    <Link to="/admin/engagement-report">Engagement Report</Link>
                    <Link to="/admin/manage-users">Manage Users</Link>
                </nav>
            </aside>

            {/* Main content */}
            <main style={{ flex: 1, padding: "2rem" }}>
                <Outlet /> {/* 子页面会在这里显示 */}
            </main>
        </div>
    );
}
