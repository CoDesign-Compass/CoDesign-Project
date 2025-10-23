import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";

// user
import WelcomePage from "./pages/user/WelcomePage";
import ProfilePage from "./pages/user/ProfilePage";
import WhyPage from "./pages/user/WhyPage";
import HowPage from "./pages/user/HowPage";
import ThankYouPage from "./pages/user/ThankYouPage";
import Layout from "./components/Layout";
import LoginPage from "./pages/user/LoginPage";
import CreateAccountPage from "./pages/user/CreateAccountPage";

// admin
import AdminLayout from "./components/AdminLayout";
import DashBoard from "./pages/admin/DashBoard";
import CreateNewIssue from "./pages/admin/CreateNewIssue";
import IssueReport from "./pages/admin/IssueReport";
import WhyReport from "./pages/admin/WhyReport";
import HowReport from "./pages/admin/HowReport";
import ProfileReport from "./pages/admin/ProfileReport";
import EngagementReport from "./pages/admin/EngagementReport";
import UserDataManagement from "./pages/admin/UserDataManagement";

function App() {
    return (
        <ThemeProvider>
            <Router>
                <Routes>
                    {/* ---------- USER ROUTES ---------- */}
                    <Route path="/" element={<Layout><WelcomePage /></Layout>} />
                    <Route path="/login" element={<Layout><LoginPage /></Layout>} />
                    <Route path="/profile" element={<Layout><ProfilePage /></Layout>} />
                    <Route path="/why" element={<Layout><WhyPage /></Layout>} />
                    <Route path="/how" element={<Layout><HowPage /></Layout>} />
                    <Route path="/thankyou" element={<Layout><ThankYouPage /></Layout>} />
                    <Route path="/createaccount" element={<Layout><CreateAccountPage /></Layout>} />

                    {/* ---------- ADMIN ROUTES ---------- */}
                    <Route path="/admin" element={<AdminLayout />}>
                        <Route path="dashboard" element={<DashBoard />} />
                        <Route path="new-issue" element={<CreateNewIssue />} />
                        <Route path="issue-report" element={<IssueReport />} />
                        <Route path="why-report" element={<WhyReport />} />
                        <Route path="how-report" element={<HowReport />} />
                        <Route path="profile-report" element={<ProfileReport />} />
                        <Route path="engagement-report" element={<EngagementReport />} />
                        <Route path="manage-users" element={<UserDataManagement />} />
                    </Route>

                    {/* ---------- DEFAULT ---------- */}
                    <Route path="*" element={<Navigate to="/login" replace />} />
                </Routes>
            </Router>
        </ThemeProvider>
    );
}

export default App;

