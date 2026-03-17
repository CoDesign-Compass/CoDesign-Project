import React, { useEffect, useState } from 'react'
import { Users, CheckCircle, FileText, TrendingUp } from 'lucide-react'

const MetricCard = ({ title, value, subtitle, icon, trend, trendUp }) => {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
          <h3 className="mt-2 text-3xl font-semibold text-gray-900 dark:text-white">{value}</h3>
          {subtitle && (
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{subtitle}</p>
          )}
          {trend && (
            <div className="mt-2 flex items-center gap-1">
              <span className={`text-sm ${trendUp ? 'text-green-600' : 'text-red-600'}`}>
                {trend}
              </span>
              <TrendingUp className={`h-4 w-4 ${trendUp ? 'text-green-600' : 'rotate-180 text-red-600'}`} />
            </div>
          )}
        </div>
        <div className="rounded-full bg-blue-50 p-3 dark:bg-blue-900/20">
          {icon}
        </div>
      </div>
    </div>
  )
}

const QuestionnaireMetrics = () => {
   // Mock data
  const metrics = {
    totalRespondents: 1248,
    completionRate: 600,
    averageQuestions: 4,
    questionCoverage: {
      q1: 1248,
      q2: 1089,
      q3: 967,
      q4: 845,
      q5: 723
    }
  }
  // const [metrics, setMetrics] = useState(null)
  // const [loading, setLoading] = useState(true)
  // const [error, setError] = useState(null)
  // const API_BASE = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080'

  // useEffect(() => {
  //   const fetchMetrics = async () => {
  //     try {
  //       const res = await fetch(`${API_BASE}/api/v1/analytics/dashboard/metrics`)
  //       if (!res.ok) throw new Error(`HTTP ${res.status}`)
  //       const data = await res.json()
  //       setMetrics(data)
  //     } catch (e) {
  //       console.error('Failed to load metrics', e)
  //       setError(e.message)
  //     } finally {
  //       setLoading(false)
  //     }
  //   }
  //   fetchMetrics()
  // }, [API_BASE])

  // if (loading) return <p>Loading metrics...</p>
  // if (error) return <p className="text-red-600">Error: {error}</p>
  // if (!metrics) return null

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <MetricCard
        title="Total Respondents"
        value={metrics.totalRespondents.toLocaleString()}
        // value={metrics.totalRespondents?.toLocaleString()}
        subtitle="Cumulative respondents"
        icon={<Users className="h-6 w-6 text-blue-600" />}
        trend="+12.5%"
        trendUp={true}
        // trend={metrics.trend}
        // trendUp={metrics.trendUp}
      />

      <MetricCard
        title="Total Users"
        value={`${metrics.completionRate} users`}
        subtitle="All users in system"
        // value={metrics.totalUsers?.toLocaleString()}
        // subtitle="All users in system"
        icon={<CheckCircle className="h-6 w-6 text-green-600" />}
        trend="+3.2%"
        trendUp={true}
        // trend={metrics.trend}
        // trendUp={metrics.trendUp}
      />

      <MetricCard
        title="Total Issues"
        // value={metrics.totalIssues?.toLocaleString()}
        // subtitle="Total number of issues"
        value={metrics.averageQuestions}
        subtitle="Total number of issues"
        icon={<FileText className="h-6 w-6 text-purple-600" />}
      />

      {/* <MetricCard
        title="Q1 Reach Count"
        value={metrics.questionCoverage.q1.toLocaleString()}
        subtitle="100% reach rate"
        icon={<FileText className="h-6 w-6 text-orange-600" />}
      /> */}
    </div>
  )
}

export default QuestionnaireMetrics
