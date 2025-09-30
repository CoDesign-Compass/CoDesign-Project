import Layout from "../components/Layout";

export default function WhyPage() {
    const questions = Array(5).fill("Write in your own words. No names or identifiers.");

    return (
            <div style={{ maxWidth: "600px", margin: "0 auto" }}>
                <h2>Step 2 of 5</h2>
                <p><strong>Why does this issue matter to you?</strong></p>

                {questions.map((placeholder, i) => (
                    <div key={i} style={{ display: "flex", gap: "10px", marginBottom: "1rem" }}>
                        <input
                            type="text"
                            placeholder={placeholder}
                            style={{
                                flex: 1,
                                padding: "0.75rem",
                                borderRadius: "6px",
                                border: "1px solid #ccc"
                            }}
                        />
                        <button
                            style={{
                                background: "#ffe071",
                                border: "none",
                                borderRadius: "6px",
                                padding: "0.75rem 1rem",
                                cursor: "pointer"
                            }}
                        >
                            I don’t know.
                        </button>
                    </div>
                ))}
            </div>
    );
}
