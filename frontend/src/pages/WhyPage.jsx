import { Link } from "react-router-dom";

export default function WhyPage() {
    return (
        <div>
            <h1>Why Page</h1>
            <Link to="/how">Next → How Page</Link>
        </div>
    );
}
