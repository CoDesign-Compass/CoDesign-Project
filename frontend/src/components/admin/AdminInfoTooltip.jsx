export default function AdminInfoTooltip({ label, children }) {
  return (
    <span className="group relative inline-flex h-6 w-6 shrink-0 items-center justify-center self-center align-middle leading-none">
      <button
        type="button"
        className="inline-flex h-6 w-6 items-center justify-center rounded-full text-gray-400 outline-none transition hover:bg-gray-100 hover:text-gray-700 focus:bg-gray-100 focus:text-gray-700 focus:ring-2 focus:ring-indigo-100 dark:text-gray-500 dark:hover:bg-white/10 dark:hover:text-gray-200 dark:focus:bg-white/10 dark:focus:text-gray-200"
        aria-label={label}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          className="h-4 w-4"
        >
          <circle cx="12" cy="12" r="9" strokeWidth="1.8" />
          <path
            d="M12 11.5V16"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M12 8h.01"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
      <span className="pointer-events-none absolute left-1/2 top-8 z-30 w-72 -translate-x-1/2 rounded-lg border border-gray-200 bg-white p-3 text-left text-xs font-normal leading-5 text-gray-600 opacity-0 shadow-lg transition group-hover:opacity-100 group-focus-within:opacity-100 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300">
        {children}
      </span>
    </span>
  )
}
