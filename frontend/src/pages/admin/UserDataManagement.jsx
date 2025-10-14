import React, { useMemo, useState } from "react";
import {
  Card,
  Space,
  Input,
  Button,
  Table,
  Tag,
  Avatar,
  MessagePlugin,
} from "tdesign-react";
import { SearchIcon, GiftIcon } from "tdesign-icons-react";

export default function UserDataManagement() {
    const seed = [
    { id: "u-1001", name: "User One",   email: "one@email.com",   redeemed: true  },
    { id: "u-1002", name: "User Two",   email: "two@email.com",   redeemed: false },
    { id: "u-1003", name: "User Three", email: "three@email.com", redeemed: true  },
    { id: "u-1004", name: "User Four",  email: "four@email.com",  redeemed: false },
    { id: "u-1005", name: "User Five",  email: "five@email.com",  redeemed: false },
    { id: "u-1006", name: "User Six",   email: "six@email.com",   redeemed: true  },
    { id: "u-1007", name: "User Seven", email: "seven@email.com", redeemed: false },
    { id: "u-1008", name: "User Eight", email: "eight@email.com", redeemed: true  },
    { id: "u-1009", name: "User Nine",  email: "nine@email.com",  redeemed: false },
    { id: "u-1010", name: "User Ten",   email: "ten@email.com",   redeemed: false },
  ];

  const [rows, setRows] = useState(seed);
  const [q, setQ] = useState("");
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });

  const filtered = useMemo(() => {
    if (!q.trim()) return rows;
    const k = q.trim().toLowerCase();
    return rows.filter(
      (r) =>
        r.name.toLowerCase().includes(k) ||
        r.email.toLowerCase().includes(k) ||
        r.id.toLowerCase().includes(k)
    );
  }, [q, rows]);

  const pageData = useMemo(() => {
    const { current, pageSize } = pagination;
    const start = (current - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, pagination]);

  const toggleRedeemed = (record) => {
    setRows((list) =>
      list.map((r) => (r.id === record.id ? { ...r, redeemed: !r.redeemed } : r))
    );
  };

  const sendGift = (record) => {
    // TODO: connect backend
    MessagePlugin.success(`Send gift to ${record.id}`);
  };

  const bulkSendGift = () => {
    if (!selectedRowKeys.length) return;
    MessagePlugin.success(`Bulk send gift to: ${selectedRowKeys.join(", ")}`);
  };

  const columns = [
    { colKey: "row-select", type: "multiple", width: 48, align: "center" },
    {
      colKey: "user",
      title: "User",
      width: 280,
      cell: ({ row }) => (
        <Space size={12} align="center">
          <Avatar size="40px">{row.name?.[0] ?? "U"}</Avatar>
          <div>
            <div style={{ fontWeight: 600 }}>{row.name}</div>
            <div style={{ color: "var(--td-text-color-secondary)" }}>{row.id}</div>
          </div>
        </Space>
      ),
    },
    { colKey: "email", title: "Email", width: 280 },
    {
      colKey: "status",
      title: "Status",
      width: 160,
      cell: ({ row }) =>
        row.redeemed ? (
          <Tag theme="success" variant="light">Redeemed</Tag>
        ) : (
          <Tag theme="default" variant="light">Not redeemed</Tag>
        ),
    },
    {
      colKey: "op",
      title: "Actions",
      align: "right",
      width: 220,
      cell: ({ row }) => (
        <Space size={8}>
          <Button size="small" variant="outline" theme="primary" icon={<GiftIcon />} onClick={() => sendGift(row)}>
            Send Gift
          </Button>
          <Button size="small" variant="outline" onClick={() => toggleRedeemed(row)}>
            Toggle
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: "16px 24px" }}>
      <Card bordered header="User Data Management">
        {/* tool bar */}
        <div style={{ display: "flex", gap: 12, justifyContent: "space-between", marginBottom: 12, flexWrap: "wrap" }}>
          <Space>
            <Button theme="primary" icon={<GiftIcon />} onClick={bulkSendGift} disabled={!selectedRowKeys.length}>
              Send Gift (Selected)
            </Button>
          </Space>
          <Input
            value={q}
            onChange={setQ}
            placeholder="Search by name / email / id"
            suffixIcon={<SearchIcon />}
            style={{ width: 320 }}
            clearable
            onClear={() => setQ("")}
          />
        </div>
        {/* table */}
        <Table
          rowKey="id"
          data={pageData}
          columns={columns}
          hover
          tableLayout="auto"
          bordered
          selectedRowKeys={selectedRowKeys}
          onSelectChange={setSelectedRowKeys}
          pagination={{
            ...pagination,
            total: filtered.length,
            onChange: (pageInfo) => setPagination(pageInfo),
          }}
        />
      </Card>
    </div>
  );

}
