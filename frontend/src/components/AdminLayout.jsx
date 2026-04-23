import React, { useState } from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom'

/** 小图标（内联 svg） */
const MenuIcon = (p) => (
  <svg
    viewBox="0 0 24 24"
    className="h-6 w-6"
    fill="none"
    stroke="currentColor"
    {...p}
  >
    <path strokeWidth="2" strokeLinecap="round" d="M4 6h16M4 12h16M4 18h16" />
  </svg>
)
const CloseIcon = (p) => (
  <svg
    viewBox="0 0 24 24"
    className="h-6 w-6"
    fill="none"
    stroke="currentColor"
    {...p}
  >
    <path strokeWidth="2" strokeLinecap="round" d="M6 6l12 12M18 6l-12 12" />
  </svg>
)

const navs = [
  { name: 'Dashboard', path: '/admin/dashboard' },
  { name: 'New Issue', path: '/admin/new-issue' },
  // { name: 'Why Report', path: '/admin/why-report' },
  // { name: 'How Report', path: '/admin/how-report' },
  // { name: 'Profile Report', path: '/admin/profile-report' },
  // { name: 'Engagement Report', path: '/admin/engagement-report' },
  { name: 'Manage Users', path: '/admin/manage-users' },
]

export default function AdminLayoutTail() {
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()

  const NavList = ({ onClickItem }) => (
    <nav className="mt-4 space-y-1">
      {navs.map((n) => {
        const active = pathname === n.path
        return (
          <Link
            key={n.path}
            to={n.path}
            onClick={onClickItem}
            className={[
              'block rounded-xl px-4 py-2.5 text-sm font-medium transition',
              active
                ? 'bg-indigo-50 text-indigo-700 ring-1 ring-indigo-200'
                : 'text-gray-700 hover:bg-gray-50',
            ].join(' ')}
          >
            {n.name}
          </Link>
        )
      })}
    </nav>
  )

  return (
    <div
      className="min-h-screen bg-gray-50"
      style={{ color: 'var(--text-all-black)' }}
    >
      {/* 顶部栏（移动端可见） */}
      <header className="sticky top-0 z-30 flex items-center justify-between bg-white px-4 py-3 shadow-sm md:hidden">
        <button
          aria-label="Open menu"
          onClick={() => setOpen(true)}
          className="inline-flex items-center justify-center rounded-lg border border-gray-200 bg-white p-2"
        >
          <MenuIcon />
        </button>
        <div className="text-base font-semibold">Admin</div>
      </header>

      {/* 抽屉侧栏：移动端 */}
      {open && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setOpen(false)}
          />
          <aside className="relative h-full w-72 bg-white p-4">
            <div className="mb-2 flex items-center justify-between">
              <div className="text-lg font-semibold">CoDesignCompass</div>
              <button
                aria-label="Close menu"
                onClick={() => setOpen(false)}
                className="rounded-lg border border-gray-200 bg-white p-2"
              >
                <CloseIcon />
              </button>
            </div>
            <NavList onClickItem={() => setOpen(false)} />
          </aside>
        </div>
      )}

      <div className="mx-auto grid w-full max-w-[1400px] grid-cols-1 md:grid-cols-[240px_1fr]">
        {/* 左侧栏：桌面端可见 */}
        <aside className="hidden md:block md:min-h-screen md:border-r md:border-gray-200 md:bg-white md:px-4 md:py-6">
          <div className="px-2 text-lg font-semibold">CoDesignCompass</div>
          <NavList />
        </aside>

        {/* 右侧内容区 */}
        <main className="min-h-screen p-4 md:p-8">
          {/* 右侧顶部条（桌面端） */}
          <div className="mb-4 hidden items-center justify-between md:flex">
            <div className="text-lg font-semibold">Admin Dashboard</div>
          </div>

          {/* 页面内容 */}
          <Outlet />
        </main>
      </div>
    </div>
  )
}
