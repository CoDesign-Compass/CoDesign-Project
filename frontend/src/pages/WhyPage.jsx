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



                {/* Buttons: Agree / Disagree / I don't know */}
                <div style={{ display: "flex", gap: "10px", marginTop: "1rem" }}>
                    <button
                        style={{
                            flex: 1,
                            backgroundColor: "#b2f2bb", // 浅绿色
                            border: "none",
                            borderRadius: "6px",
                            padding: "0.75rem",
                            fontWeight: "bold",
                            cursor: "pointer"
                        }}
                    >
                        Agree
                    </button>
                    <button
                        style={{
                            flex: 1,
                            backgroundColor: "#ffa8a8", // 浅红色
                            border: "none",
                            borderRadius: "6px",
                            padding: "0.75rem",
                            fontWeight: "bold",
                            cursor: "pointer"
                        }}
                    >
                        Disagree
                    </button>
                    <button
                        style={{
                            flex: 1,
                            backgroundColor: "#e9ecef", // 灰色
                            border: "none",
                            borderRadius: "6px",
                            padding: "0.75rem",
                            fontWeight: "bold",
                            cursor: "pointer"
                        }}
                    >
                        I don’t know
                    </button>
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
