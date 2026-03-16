import React from 'react'
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
}) => {
  return (
    <section
      className={`overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-white/[0.03] ${className}`}
    >
      {(title || subtitle) && (
        <div className="border-b border-gray-100 px-5 py-4 dark:border-gray-800 md:px-6">
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
            subtitle="Monitor recent issue activity and quickly scan the current reporting status."
            bodyClassName="p-0"
          >
            <div className="p-5 md:p-6">
              <Issues />
            </div>
          </SectionCard>
        </div>

        {/* Left column */}
        <div className="col-span-12 space-y-6 xl:col-span-7">
          <SectionCard
            title="Key Metrics"
            subtitle="A concise summary of the most important issue and engagement indicators."
          >
            <EcommerceMetrics />
          </SectionCard>

          <SectionCard
            title="Monthly Trends"
            subtitle="Track changes over time to support better reporting and decision-making."
          >
            <MonthlySalesChart />
          </SectionCard>
        </div>

        {/* Right column */}
        <div className="col-span-12 xl:col-span-5">
          <SectionCard
            title="Analysis Report"
            subtitle="View the latest analysis summary in a dedicated panel with clearer separation."
          >
            <MonthlyTarget />
          </SectionCard>
        </div>

        {/* Reserved block / future extension */}
        <div className="col-span-12 xl:col-span-5">
          <SectionCard
            title="Additional Insights"
            subtitle="This space is reserved for future dashboard content or supporting reports."
          >
            <EmptyStateCard
              title="No content available yet"
              description="This section is intentionally kept as a placeholder so future charts or supporting widgets can be added without changing the overall dashboard layout."
              minHeight="min-h-[220px]"
            />
          </SectionCard>
        </div>

        {/* Word cloud */}
        <div className="col-span-12">
          <SectionCard
            title="Word Cloud"
            subtitle="A visual summary of the most frequently appearing terms from issue-related content."
          >
            <EmptyStateCard
              title="Word cloud preview"
              description="The word cloud area is kept visually ready for content. When connected, this panel should display high-frequency terms in a clean and readable way."
              minHeight="min-h-[320px]"
            />
          </SectionCard>
        </div>

        {/* Reserved wide section */}
        <div className="col-span-12 xl:col-span-7">
          <SectionCard
            title="Upcoming Panel"
            subtitle="Reserved for future tables, reports, or other supporting content."
          >
            <EmptyStateCard
              title="Nothing to display"
              description="This empty state prevents the layout from feeling broken and makes unfinished areas look intentional rather than accidental."
              minHeight="min-h-[220px]"
            />
          </SectionCard>
        </div>
      </div>
    </div>
  )
}

export default DashBoard
