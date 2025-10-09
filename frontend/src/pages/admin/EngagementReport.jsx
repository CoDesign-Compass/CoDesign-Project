import { Card, Divider, List, Typography, Space } from "tdesign-react";
const { Title, Paragraph } = Typography;

export default function EngagementReport() {
    const reports = [
        { title: "Engagement & Response Quality Analysis", desc: "Brief description of this report..." },
        { title: "User Feedback Summary", desc: "Brief description of this report..." },
        { title: "Actionable Insights", desc: "Brief description of this report..." },
    ];

    return (
        <div style={{ padding: "1rem 2rem" }}>
            <Title tag="h2">Engagement Report</Title>

            <Card style={{ margin: "1rem 0", height: "180px", backgroundColor: "#f5f1fa" }}>
                <Paragraph>Summary visualization placeholder</Paragraph>
            </Card>

            <Divider />
            <Title tag="h4">Featured</Title>

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
