import { Card, Divider, List, Typography, Space } from "tdesign-react";
const { Title, Paragraph } = Typography;

export default function ProfileReport() {
    const reports = [
        { title: "Themes & Concerns", desc: "Brief description of this report..." },
        { title: "Demographics & Participation Metrics", desc: "Brief description of this report..." },
        { title: "Actionable Insights & Recommendations Analysis", desc: "Brief description of this report..." },
    ];

    return (
        <div style={{ padding: "1rem 2rem" }}>
            <Title tag="h2">Profile Report</Title>

            <Card style={{ margin: "1rem 0", height: "180px", backgroundColor: "#f5f1fa" }}>
                <Paragraph>Summary visualization placeholder</Paragraph>
            </Card>

            <Divider />
            <Title tag="h4">Featured</Title>

            <List split>
                {reports.map((r, i) => (
                    <List.ListItem
                        key={i}
                        action={<span style={{ fontSize: "20px", cursor: "pointer" }}>⋮</span>}
                    >
                        <Space direction="vertical" size={0}>
                            <strong>{r.title}</strong>
                            <Paragraph>{r.desc}</Paragraph>
                        </Space>
                    </List.ListItem>
                ))}
            </List>
        </div>
    );
}
