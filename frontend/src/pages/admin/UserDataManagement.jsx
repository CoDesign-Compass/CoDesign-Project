import React, { useMemo, useState } from "react";

const GiftIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
    <path strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
      d="M20 12v7a2 2 0 0 1-2 2h-3v-9h5ZM9 21H6a2 2 0 0 1-2-2v-7h5v9ZM21 8h-6a2 2 0 0 1 0-4c2 0 3 2 3 2s1-2 3-2a2 2 0 1 1 0 4H3a2 2 0 0 1 0-4c2 0 3 2 3 2s1-2 3-2a2 2 0 0 1 0 4H3M12 8v13" />
  </svg>
);

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
  const [selected, setSelected] = useState(new Set());
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const k = q.trim().toLowerCase();
    if (!k) return rows;
    return rows.filter(r =>
      r.name.toLowerCase().includes(k) ||
      r.email.toLowerCase().includes(k) ||
      r.id.toLowerCase().includes(k)
    );
  }, [q, rows]);

  const total = filtered.length;
  const pageCount = Math.max(1, Math.ceil(total / pageSize));
  const paged = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, page, pageSize]);

  const toggleRow = (id) => {
    setSelected(s => {
      const next = new Set(s);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };
  const toggleRedeemed = (id) => {
    setRows(list => list.map(r => r.id === id ? { ...r, redeemed: !r.redeemed } : r));
  };
  const sendGift = (ids) => {
    if (!ids.length) return;
    alert(`Send gift to: ${ids.join(", ")}`);
  };

  return (
    <div className="space-y-4">
      {/* tool bar */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <h2 className="text-lg font-semibold">User Data Management</h2>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <button
            onClick={() => sendGift(Array.from(selected))}
            disabled={!selected.size}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-indigo-200 bg-indigo-50 px-3.5 py-2 text-sm font-medium text-indigo-700 hover:bg-indigo-100 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <GiftIcon className="h-4 w-4" />
            Send Gift (Selected)
          </button>
          <div className="relative">
            <input
              value={q}
              onChange={(e) => { setQ(e.target.value); setPage(1); }}
              placeholder="Search by name / email / id"
              className="h-10 w-full sm:w-[280px] rounded-xl border border-gray-200 pl-10 pr-3 text-sm outline-none focus:ring-2 focus:ring-indigo-200"
            />
            <svg className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <circle cx="11" cy="11" r="7" strokeWidth="1.8" />
              <path d="M20 20L17 17" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </div>
        </div>
      </div>

      {/* card(mobile) */}
      <div className="grid gap-3 md:hidden">
        {paged.map((r) => (
          <div key={r.id} className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-black/5">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300"
                  checked={selected.has(r.id)}
                  onChange={() => toggleRow(r.id)}
                  aria-label={`Select ${r.id}`}
                />
                <div className="grid h-9 w-9 place-items-center rounded-full bg-indigo-50 text-indigo-600 font-semibold">
                  {r.name?.[0] ?? "U"}
                </div>
                <div>
                  <div className="font-medium">{r.name}</div>
                  <div className="text-xs text-gray-500">{r.id}</div>
                </div>
              </div>
              <span className={[
                "rounded-full px-2.5 py-1 text-xs font-medium ring-1",
                r.redeemed ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
                           : "bg-amber-50 text-amber-700 ring-amber-200"
              ].join(" ")}>
                {r.redeemed ? "Redeemed" : "Not redeemed"}
              </span>
            </div>

            <div className="mt-2 text-sm text-gray-700">{r.email}</div>

            <div className="mt-3 flex justify-end gap-2">
              <button
                onClick={() => sendGift([r.id])}
                className="inline-flex items-center gap-1.5 rounded-lg border border-indigo-200 bg-white px-3 py-1.5 text-xs font-medium text-indigo-700 hover:bg-indigo-50"
              >
                <GiftIcon className="h-4 w-4" />
                Send Gift
              </button>
              <button
                onClick={() => toggleRedeemed(r.id)}
                className="inline-flex items-center rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50"
              >
                Toggle
              </button>
            </div>
          </div>
        ))}
        {paged.length === 0 && (
          <div className="rounded-2xl bg-white p-8 text-center text-gray-500 shadow-sm ring-1 ring-black/5">
            No data
          </div>
        )}
      </div>

      {/* table */}
      <div className="hidden overflow-x-auto rounded-2xl bg-white p-4 shadow-sm ring-1 ring-black/5 md:block">
        <table className="min-w-full text-left">
          <thead>
            <tr className="text-sm text-gray-500">
              <th className="w-10 px-3 py-3">Select</th>
              <th className="px-3 py-3">User</th>
              <th className="px-3 py-3">Email</th>
              <th className="px-3 py-3">Status</th>
              <th className="px-3 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {paged.map((r) => (
              <tr key={r.id} className="text-sm">
                <td className="px-3 py-4">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300"
                    checked={selected.has(r.id)}
                    onChange={() => toggleRow(r.id)}
                  />
                </td>
                <td className="px-3 py-4">
                  <div className="flex items-center gap-3">
                    <div className="grid h-9 w-9 place-items-center rounded-full bg-indigo-50 text-indigo-600 font-semibold">
                      {r.name?.[0] ?? "U"}
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{r.name}</div>
                      <div className="text-gray-500">{r.id}</div>
                    </div>
                  </div>
                </td>
                <td className="px-3 py-4 text-gray-700">{r.email}</td>
                <td className="px-3 py-4">
                  <span className={[
                    "rounded-full px-2.5 py-1 text-xs font-medium ring-1",
                    r.redeemed ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
                               : "bg-amber-50 text-amber-700 ring-amber-200"
                  ].join(" ")}>
                    {r.redeemed ? "Redeemed" : "Not redeemed"}
                  </span>
                </td>
                <td className="px-3 py-4">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => sendGift([r.id])}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-indigo-200 bg-white px-3 py-1.5 text-xs font-medium text-indigo-700 hover:bg-indigo-50"
                    >
                      <GiftIcon className="h-4 w-4" />
                      Send Gift
                    </button>
                    <button
                      onClick={() => toggleRedeemed(r.id)}
                      className="inline-flex items-center rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50"
                    >
                      Toggle
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {paged.length === 0 && (
              <tr><td colSpan={5} className="px-3 py-10 text-center text-gray-500">No data</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* seperate pages */}
      <div className="flex flex-col items-start justify-between gap-3 md:flex-row md:items-center">
        <div className="text-sm text-gray-500">{total} items</div>
        <div className="flex items-center gap-3">
          <select
            value={pageSize}
            onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1); }}
            className="h-9 rounded-lg border border-gray-200 bg-white px-2 pr-8 text-sm"
          >
            {[5, 8, 10, 20, 50].map(n => (
              <option key={n} value={n}>{`${n} / page`}</option>
            ))}
          </select>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              className="h-9 rounded-lg border border-gray-200 bg-white px-3 text-sm hover:bg-gray-50"
            >
              Previous
            </button>
            <span className="px-2 text-sm text-gray-600">
              {page} / {Math.max(1, pageCount)}
            </span>
            <button
              onClick={() => setPage(p => Math.min(pageCount, p + 1))}
              className="h-9 rounded-lg border border-gray-200 bg-white px-3 text-sm hover:bg-gray-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}