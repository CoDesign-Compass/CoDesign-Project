
export default function HowPage() {
    const questions = Array(5).fill("Write in your own words. No names or identifiers.");

    return (
            <div style={{ maxWidth: "600px", margin: "0 auto" }}>
                <p><strong>How could this be improved?</strong></p>

                {questions.map((placeholder, i) => (
                    <div
                        key={i}
                        style={{ marginBottom: "1rem" }}
                    >
                        <input
                            type="text"
                            placeholder={placeholder}
                            style={{
                                width: "100%",
                                padding: "0.75rem",
                                borderRadius: "6px",
                                border: "1px solid #ccc"
                            }}
                        />
                    </div>
                ))}
            </div>
    );
}
