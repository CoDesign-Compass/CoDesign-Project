import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function HowPage() {
    const [step, setStep] = useState(0);

    const questions = Array(5).fill(
        "Write in your own words. No names or identifiers."
    );

    const [answers, setAnswers] = useState(Array(questions.length).fill(""));
    const inputRef = useRef(null);
    const endRef = useRef(null);

    useEffect(() => {
        inputRef.current?.focus();
        endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
    }, [step]);

    if (step >= questions.length) {
        return (
            <div style={{ maxWidth: 680, margin: "40px auto" }}>
                <h2 style={{ marginBottom: 16 }}>Your Answer :</h2>
                {questions.map((q, i) => (
                    <div
                        key={i}
                        style={{
                            padding: "12px 16px",
                            borderRadius: 10,
                            background: "#f5f5f5",
                            marginBottom: 10,
                        }}
                    >
                        <div style={{ fontWeight: 600, marginBottom: 6 }}>{q}</div>
                        <div style={{ color: "black" }}>
                            {answers[i] || "(no answer)"}
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    const next = () => setStep((s) => Math.min(s + 1, questions.length));
    const finish = () => setStep(questions.length);

    return (
        <div style={{ maxWidth: "600px", margin: "0 auto" }}>
            <p>
                <strong>How could this be improved?</strong>
            </p>

            {/* 已回答的问题显示 */}
            {questions.slice(0, step).map((q, i) => (
                <div
                    key={i}
                    style={{
                        padding: "12px 16px",
                        borderRadius: 10,
                        background: "#f1f3f5",
                        marginBottom: 10,
                        border: "1px solid #e9ecef",
                    }}
                >
                    <div style={{ fontWeight: 600, marginBottom: 6 }}>{q}</div>
                    <div style={{ whiteSpace: "pre-wrap" }}>{answers[i]}</div>
                </div>
            ))}

            {/* 当前问题输入框 */}
            <AnimatePresence mode="popLayout">
                <motion.div
                    key={step}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.25 }}
                    style={{ display: "flex", gap: 10, marginTop: 8, flexWrap: "wrap" }}
                >
                    <input
                        ref={inputRef}
                        type="text"
                        placeholder={questions[step]}
                        value={answers[step]}
                        onChange={(e) => {
                            const nextAns = [...answers];
                            nextAns[step] = e.target.value;
                            setAnswers(nextAns);
                        }}
                        onKeyDown={(e) => {
                            if (e.key === "Enter" && answers[step].trim()) next();
                        }}
                        style={{
                            flex: 1,
                            minWidth: "60%",
                            padding: "12px 14px",
                            borderRadius: 10,
                            border: "1px solid #ced4da",
                            outline: "none",
                            fontSize: 16,
                        }}
                    />

                    {step > 0 && (
                        <motion.button
                            key="idk"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={finish}
                            style={{
                                background: "#ffe071",
                                border: "none",
                                borderRadius: 10,
                                padding: "12px 18px",
                                fontWeight: 600,
                                cursor: "pointer",
                            }}
                        >
                            I don’t know
                        </motion.button>
                    )}

                    <button
                        onClick={next}
                        disabled={!answers[step].trim()}
                        style={{
                            background: "#ffe071",
                            border: "none",
                            borderRadius: 10,
                            padding: "12px 18px",
                            fontWeight: 600,
                            cursor: answers[step].trim()
                                ? "pointer"
                                : "not-allowed",
                            opacity: answers[step].trim() ? 1 : 0.7,
                        }}
                    >
                        Next
                    </button>
                </motion.div>
            </AnimatePresence>

            <div ref={endRef} />
        </div>
    );
}