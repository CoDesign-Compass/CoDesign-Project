import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProfilePage from "./pages/ProfilePage";
import WhyPage from "./pages/WhyPage";
import HowPage from "./pages/HowPage";
import ThankYouPage from "./pages/ThankYouPage";
import Layout from "./components/Layout";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/profile" element={<Layout><ProfilePage /></Layout>} />
                <Route path="/why" element={<Layout><WhyPage /></Layout>} />
                <Route path="/how" element={<Layout><HowPage /></Layout>} />
                <Route path="/thankyou" element={<Layout><ThankYouPage /></Layout>} />
            </Routes>
        </Router>
    );
}

export default App;
