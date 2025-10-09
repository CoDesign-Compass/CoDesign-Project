import { Card, Divider, List, Typography, Space } from "tdesign-react";
const { Title, Paragraph } = Typography;

export default function WhyReport() {
    const reports = [
        { title: "Themes & Concerns", desc: "Brief description of this report..." },
        { title: "Sentimental Analysis", desc: "Brief description of this report..." },
        { title: "Actionable Insights & Recommendations Analysis", desc: "Brief description of this report..." },
    ];

    return (
        <div style={{ padding: "1rem 2rem" }}>
            <Title level={2}>Why Report</Title>

            {/* Summary Card */}
            <Card style={{ margin: "1rem 0", height: "180px", backgroundColor: "#f5f1fa" }}>
                <Paragraph>Summary visualization placeholder</Paragraph>
            </Card>

            <Divider />
            <Title level={4}>Featured</Title>

            {/* Report List */}
            <List
                split={true}
                items={reports.map((r, i) => ({
                    content: (
                        <Space direction="vertical" size={0}>
                            <strong>{r.title}</strong>
                            <Paragraph>{r.desc}</Paragraph>
                        </Space>
                    ),
                    action: <span style={{ fontSize: "20px", cursor: "pointer" }}>⋮</span>,
                }))}
            />
        </div>
    );
}
