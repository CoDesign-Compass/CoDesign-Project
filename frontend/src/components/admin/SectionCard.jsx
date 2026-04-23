import AdminInfoTooltip from './AdminInfoTooltip'

export default function SectionCard({
  title,
  subtitle,
  children,
  className = '',
  bodyClassName = '',
  titleClassName = 'text-xl',
  headerRight = null,
}) {
  return (
    <section
      className={`overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-white/[0.03] ${className}`}
    >
      {(title || subtitle || headerRight) && (
        <div className="flex min-h-[72px] items-center border-b border-gray-100 px-5 py-4 dark:border-gray-800 md:px-6">
          <div className="flex w-full flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              {title && (
                <div className="flex items-center gap-2">
                  <h2
                    className={`${titleClassName} font-semibold text-gray-800 dark:text-white/90`}
                  >
                    {title}
                  </h2>
                  {subtitle && (
                    <AdminInfoTooltip label={`Show ${title} guidance`}>
                      {subtitle}
                    </AdminInfoTooltip>
                  )}
                </div>
              )}
            </div>

            {headerRight && <div className="shrink-0">{headerRight}</div>}
          </div>
        </div>
      )}

      <div className={`p-5 md:p-6 ${bodyClassName}`}>{children}</div>
    </section>
  )
}
