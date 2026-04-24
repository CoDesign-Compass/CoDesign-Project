import React, { useState } from 'react'
import MonthlySalesChart from '../../components/tailadmin/ecommerce/MonthlySalesChart'
import EcommerceMetrics from '../../components/tailadmin/ecommerce/EcommerceMetrics'
import Issues from '../../components/tailadmin/ecommerce/Issues'
import SectionCard from '../../components/admin/SectionCard'

const DashBoard = () => {
  const [issueSortBy, setIssueSortBy] = useState('updated-desc')
  const [downloadingLogs, setDownloadingLogs] = useState(false)

  const API_BASE = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080'

  const handleDownloadAiLogs = async () => {
    try {
      setDownloadingLogs(true)

      const response = await fetch(
        `${API_BASE}/api/admin/ai-support-logs/export`,
        {
          method: 'GET',
        },
      )

      if (!response.ok) {
        throw new Error('Failed to export AI support logs')
      }

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)

      const link = document.createElement('a')
      link.href = url
      link.download = 'ai-support-logs.csv'
      document.body.appendChild(link)
      link.click()
      link.remove()

      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error(error)
      alert('Failed to download AI logs.')
    } finally {
      setDownloadingLogs(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Main content grid */}
      <div className="grid grid-cols-12 gap-4 md:gap-6">
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
            headerRight={
              <button
                type="button"
                onClick={handleDownloadAiLogs}
                disabled={downloadingLogs}
                className="inline-flex items-center justify-center rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-white/[0.05]"
              >
                {downloadingLogs ? 'Downloading...' : 'Download AI bot Logs'}
              </button>
            }
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
