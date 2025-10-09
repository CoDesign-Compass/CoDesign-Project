import { Card, Divider, List, Typography, Space } from "tdesign-react";
const { Title, Paragraph } = Typography;

export default function WhyReport() {
    const reports = [
        { title: "Themes & Concerns", desc: "Brief description of this report..." },
        { title: "Sentimental Analysis", desc: "Brief description of this report..." },
        { title: "Actionable Insights & Recommendations Analysis", desc: "Brief description of this report..." },
    ];

    return (
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
            <Title tag="h2" style={{ marginBottom: "1rem" }}>
                Why Report
            </Title>

            {/* Summary Card */}
            <Card
                style={{
                    marginBottom: "2rem",
                    backgroundColor: "#f5f1fa",
                    borderRadius: "12px",
                    height: "180px",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
                }}
            >
                <Paragraph>Summary visualization placeholder</Paragraph>
            </Card>

            <Divider />
            <Title tag="h4" style={{ marginBottom: "1rem" }}>
                Featured
            </Title>

            <List
                split={false}
                items={reports.map((r) => ({
                    content: (
                        <Card
                            key={r.title}
                            hoverable
                            style={{
                                marginBottom: "1rem",
                                borderRadius: "10px",
                                boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                            }}
                        >
                            <Space direction="vertical" size={4}>
                                <strong>{r.title}</strong>
                                <Paragraph>{r.desc}</Paragraph>
                            </Space>
                        </Card>
                    ),
                }))}
            />
        </div>
    );
}
