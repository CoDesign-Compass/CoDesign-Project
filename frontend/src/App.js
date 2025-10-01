
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext"; 
import WelcomePage from "./pages/WelcomePage";
import ProfilePage from "./pages/ProfilePage";
import WhyPage from "./pages/WhyPage";
import HowPage from "./pages/HowPage";
import ThankYouPage from "./pages/ThankYouPage";
import Layout from "./components/Layout";
import LoginPage from "./pages/LoginPage";

function App() {
    return (
        <ThemeProvider>
        <Router>
            <Routes>
                <Route path="/" element={<Layout><WelcomePage /></Layout>} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/profile" element={<Layout><ProfilePage /></Layout>} />
                <Route path="/why" element={<Layout><WhyPage /></Layout>} />
                <Route path="/how" element={<Layout><HowPage /></Layout>} />
                <Route path="/thankyou" element={<Layout><ThankYouPage /></Layout>} />
                <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
        </Router>
        </ThemeProvider>
    );
}

export default App;

