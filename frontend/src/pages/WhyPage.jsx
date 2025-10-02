export default function WhyPage() {
    const questions = Array(5).fill("Write in your own words. No names or identifiers.");

    return (
            <div style={{ maxWidth: "600px", margin: "0 auto" }}>
                {/* Issue Section */}
                <div style={{ marginBottom: "2rem" }}>
          <span
              style={{
                  backgroundColor: "#ffe071",
                  fontWeight: "bold",
                  padding: "0.2rem 0.5rem",
                  borderRadius: "4px"
              }}
          >
            Issue:
          </span>
                    <p style={{ marginTop: "0.5rem" }}>
                        Lorem ipsum dolor sit amet consectetur adipisicing elit?
                    </p>

                    {/* Step indicator */}
                    <div style={{ margin: "1rem 0" }}>
                        <p style={{ fontWeight: "bold" }}>Step 1 of 5</p>
                        <div
                            style={{
                                backgroundColor: "#eee",
                                borderRadius: "5px",
                                height: "8px",
                                width: "100%"
                            }}
                        >
                            <div
                                style={{
                                    backgroundColor: "#ffe071",
                                    height: "100%",
                                    borderRadius: "5px",
                                    width: "40%" // 2/5 进度
                                }}
                            />
                        </div>
                    </div>
                </div>

                {/* Question Section */}
                <p>
                    <strong>Why does this issue matter to you?</strong>
                </p>

                {questions.map((placeholder, i) => (
                    <div
                        key={i}
                        style={{ display: "flex", gap: "10px", marginBottom: "1rem" }}
                    >
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
                        {i > 0 && (
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
                        )}
                    </div>
                ))}
            </div>
    );
}
