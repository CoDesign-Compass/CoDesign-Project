import { Layout, Menu } from "tdesign-react";
import {
    DashboardIcon,
    AddIcon,
    UserIcon,
    ChartIcon,
    AppIcon,
    ChartBarIcon,
    LineIcon,
} from "tdesign-icons-react";
import { Link, Outlet, useLocation } from "react-router-dom";

const { Header, Aside, Content } = Layout;

export default function AdminLayout() {
    const location = useLocation();

    const menuItems = [
        { name: "Dashboard", path: "/admin/dashboard", icon: <DashboardIcon /> },
        { name: "New Issue", path: "/admin/new-issue", icon: <AddIcon /> },
        { name: "Issue Report", path: "/admin/issue-report", icon: <ChartIcon /> },
        { name: "Why Report", path: "/admin/why-report", icon: <ChartBarIcon /> },
        { name: "How Report", path: "/admin/how-report", icon: <LineIcon /> },
        { name: "Profile Report", path: "/admin/profile-report", icon: <AppIcon /> },
        { name: "Engagement Report", path: "/admin/engagement-report", icon: <ChartIcon /> },
        { name: "Manage Users", path: "/admin/manage-users", icon: <UserIcon /> },
    ];

    return (
        <Layout style={{ height: "100vh", backgroundColor: "#fafafa" }}>
            <Aside
                style={{
                    backgroundColor: "#fff7cc",
                    borderRight: "1px solid #eee",
                    padding: "1.5rem 0",
                    width: "220px",
                }}
            >
                <div style={{ textAlign: "center", fontWeight: "bold", fontSize: "1.2rem", marginBottom: "2rem" }}>
                    CoDesignCompass
                </div>

                <Menu
                    value={location.pathname}
                    style={{ border: "none", backgroundColor: "transparent" }}
                >
                    {menuItems.map((item) => (
                        <Menu.Item key={item.path} value={item.path} icon={item.icon}>
                            <Link to={item.path}>{item.name}</Link>
                        </Menu.Item>
                    ))}
                </Menu>
            </Aside>

            <Layout>
                <Header
                    style={{
                        backgroundColor: "#fff",
                        borderBottom: "1px solid #eee",
                        padding: "0.5rem 2rem",
                        fontWeight: "bold",
                        fontSize: "1.1rem",
                    }}
                >
                    Admin Dashboard
                </Header>

                <Content
                    style={{
                        padding: "2rem",
                        backgroundColor: "#fafafa",
                        overflowY: "auto",
                    }}
                >
                    <Outlet />
                </Content>
            </Layout>
        </Layout>
    );
}
