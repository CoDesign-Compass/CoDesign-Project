import React, { useState } from 'react'
import MonthlySalesChart from '../../components/tailadmin/ecommerce/MonthlySalesChart'
import EcommerceMetrics from '../../components/tailadmin/ecommerce/EcommerceMetrics'
import MonthlyTarget from '../../components/tailadmin/ecommerce/AnalysisReport'
import Issues from '../../components/tailadmin/ecommerce/Issues'

const SectionCard = ({
  title,
  subtitle,
  children,
  className = '',
  bodyClassName = '',
  headerRight = null,
}) => {
  return (
    <section
      className={`overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-white/[0.03] ${className}`}
    >
      {(title || subtitle || headerRight) && (
        <div className="border-b border-gray-100 px-5 py-4 dark:border-gray-800 md:px-6">
          <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
            <div>
              {title && (
                <h2 className="text-base font-semibold text-gray-800 dark:text-white/90">
                  {title}
                </h2>
              )}
              {subtitle && (
                <p className="mt-1 text-sm leading-6 text-gray-500 dark:text-gray-400">
                  {subtitle}
                </p>
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

const EmptyStateCard = ({
  title,
  description,
  minHeight = 'min-h-[260px]',
}) => {
  return (
    <div
      className={`flex ${minHeight} flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-gray-50/60 px-6 py-10 text-center dark:border-gray-700 dark:bg-white/[0.02]`}
    >
      <div className="max-w-md">
        <h3 className="text-base font-semibold text-gray-800 dark:text-white/90">
          {title}
        </h3>
        <p className="mt-2 text-sm leading-6 text-gray-500 dark:text-gray-400">
          {description}
        </p>
      </div>
    </div>
  )
}

const DashBoard = () => {
  const [issueSortBy, setIssueSortBy] = useState('updated-desc')

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
          Dashboard
        </h1>
        <p className="text-sm leading-6 text-gray-500 dark:text-gray-400">
          Review issue activity, metrics, charts, and analysis in a clearer and
          more consistent layout.
        </p>
      </div>

      {/* Main content grid */}
      <div className="grid grid-cols-12 gap-4 md:gap-6">
        {/* Full width issues section */}
        <div className="col-span-12">
          <SectionCard
            title="Issues Overview"
            subtitle="Monitor recent issue activity and quickly scan the current reporting status. By default, issues are shown by most recently modified first."
            bodyClassName="p-0"
            headerRight={
              <div className="flex items-center gap-2">
                <label
                  htmlFor="issue-sort"
                  className="text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Sort by
                </label>
                <select
                  id="issue-sort"
                  value={issueSortBy}
                  onChange={(e) => setIssueSortBy(e.target.value)}
                  className="min-w-[280px] rounded-xl border border-gray-300 bg-white px-4 py-3 text-base text-gray-700 outline-none transition focus:border-brand-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200"
                >
                  <option value="updated-desc">
                    Last modified: newest first
                  </option>
                  <option value="updated-asc">
                    Last modified: oldest first
                  </option>
                  <option value="created-desc">Created: newest first</option>
                  <option value="created-asc">Created: oldest first</option>
                  <option value="id-asc">Issue ID: ascending</option>
                  <option value="title-asc">Title: A to Z</option>
                </select>
              </div>
            }
          >
            <div className="p-5 md:p-6">
              <Issues sortBy={issueSortBy} />
            </div>
          </SectionCard>
        </div>

        <div className="col-span-12">
          <SectionCard
            title="Key Metrics"
            subtitle="A concise summary of the most important issue and engagement indicators."
          >
            <EcommerceMetrics />
          </SectionCard>
        </div>

        <div className="col-span-12">
          <SectionCard
            title="Monthly Trends"
            subtitle="Track changes over time to support better reporting and decision-making."
          >
            <MonthlySalesChart />
          </SectionCard>
        </div>
      </div>
    </div>
  )
}

export default DashBoard