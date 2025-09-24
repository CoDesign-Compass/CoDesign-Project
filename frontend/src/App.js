import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProfilePage from "./pages/ProfilePage";
import WhyPage from "./pages/WhyPage";
import HowPage from "./pages/HowPage";
import ThankYouPage from "./pages/ThankYouPage";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/why" element={<WhyPage />} />
                <Route path="/how" element={<HowPage />} />
                <Route path="/thankyou" element={<ThankYouPage />} />
            </Routes>
        </Router>
    );
}

export default App;
