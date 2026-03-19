import React, { useState, useMemo } from 'react'
import { TrendingUp, Users, Clock, ChevronLeft, ChevronRight } from 'lucide-react'
import { Link } from 'react-router'

// Generate 100 mock questions
const generateQuestions = () => {
  const themes = ['Transportation', 'Housing & Living', 'Food & Consumption', 'Digital Life', 'Entertainment & Leisure']
  const questions = []

  const questionTemplates = {
    'Transportation': [
      'What\'s your main way to get to work/school?'
    ],
    'Housing & Living': [
      'What matters most to you in your living environment?',

    ],
    'Food & Consumption': [
      'What is your most common way of eating?'
    ],
    'Digital Life': [
      'What type of apps do you use most often?',
    ],
    'Entertainment & Leisure': [
      'What is your favorite way to spend free time?'
    ]
  }

  let questionIndex = 1
  themes.forEach(theme => {
    const templates = questionTemplates[theme]
    templates.forEach(template => {
      const baseReached = 1248 - (questionIndex - 1) * 12
      const reachRate = Math.max(30, 100 - (questionIndex - 1) * 0.7)

      questions.push({
        questionId: `Q${questionIndex}`,
        questionText: template,
        totalReached: Math.max(300, baseReached + Math.floor(Math.random() * 100)),
        reachRate: Math.round(reachRate * 10) / 10,
        lastUpdated: `${Math.floor(Math.random() * 60)} min ago`,
        topOptions: [
          {
            option: generateOption(theme, 1),
            count: Math.floor(Math.random() * 300) + 200,
            percentage: Math.floor(Math.random() * 20) + 30
          },
          {
            option: generateOption(theme, 2),
            count: Math.floor(Math.random() * 200) + 150,
            percentage: Math.floor(Math.random() * 15) + 20
          }
        ],
        theme
      })
      questionIndex++
    })
  })

  return questions
}

const generateOption = (theme, index) => {
  const options = {
    'Demographics': ['18-24 years', '25-34 years', '35-44 years', '45+ years', 'Male', 'Female', 'Tier 1 city', 'Tier 2 city'],
    'Housing & Living': ['Yes', 'No', 'Daily', 'Weekly', 'Occasionally', 'Never', 'Feature A', 'Feature B'],
    'Food & Consumption': ['Very Satisfied', 'Satisfied', 'Neutral', 'Dissatisfied', 'Very Dissatisfied', 'Excellent', 'Good', 'Poor'],
    'Digital Life': ['Data Analytics', 'Report Generation', 'Online Collaboration', 'Mobile Support', 'API Integration', 'Automation', 'Batch Operations', 'Templates'],
    'Entertainment & Leisure': ['9-10 (Promoters)', '7-8 (Passives)', '0-6 (Detractors)', 'Would recommend', 'Would not recommend', 'Reasonable price', 'Powerful features', 'Easy to use']
  }

  const themeOptions = options[theme] || ['Option A', 'Option B', 'Option C', 'Option D']
  return themeOptions[index % themeOptions.length]
}

const CurrentQuestionDistribution = () => {
  const [selectedTheme, setSelectedTheme] = useState('All')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

  // Generate all questions
  const allQuestions = useMemo(() => generateQuestions(), [])

  // Theme list
  const themes = ['All', 'Transportation', 'Housing & Living', 'Food & Consumption', 'Digital Life', 'Entertainment & Leisure']

  // Filter questions by theme
  const filteredQuestions = useMemo(() => {
    if (selectedTheme === 'All') {
      return allQuestions
    }
    return allQuestions.filter(q => q.theme === selectedTheme)
  }, [allQuestions, selectedTheme])

  // Calculate total pages
  const totalPages = Math.ceil(filteredQuestions.length / itemsPerPage)

  // Get current page questions
  const currentQuestions = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    return filteredQuestions.slice(startIndex, endIndex)
  }, [filteredQuestions, currentPage])

  // Reset page when theme changes
  const handleThemeChange = (theme) => {
    setSelectedTheme(theme)
    setCurrentPage(1)
  }

  // Pagination
  const goToPage = (page) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)))
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Question Reach Status</h2>
          <div className="flex items-center gap-2 rounded-lg bg-green-50 px-3 py-1.5 dark:bg-green-900/20">
            <div className="h-2 w-2 animate-pulse rounded-full bg-green-500"></div>
            <span className="text-sm font-medium text-green-700 dark:text-green-400">Live</span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          <span>{allQuestions.length} questions total</span>
          <span>·</span>
          <span>{filteredQuestions.length} results</span>
        </div>
      </div>

      {/* Theme Selector */}
      <div className="mb-6 flex flex-wrap gap-2">
        {themes.map((theme) => (
          <button
            key={theme}
            onClick={() => handleThemeChange(theme)}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${
              selectedTheme === theme
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
            }`}
          >
            {theme}
            {theme !== 'All' && (
              <span className="ml-2 text-xs opacity-75">
                ({allQuestions.filter(q => q.theme === theme).length})
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Question List */}
      <div className="space-y-4">
        {currentQuestions.length > 0 ? (
          currentQuestions.map((stat) => (
            <Link
              key={stat.questionId}
              to={`/admin/issue-report/${stat.questionId}`}
            >
              <div className="rounded-xl border border-gray-200 bg-gradient-to-r from-gray-50 to-white p-4 transition-all hover:shadow-md dark:border-gray-700 dark:from-gray-800/50 dark:to-gray-800/30"
              >
                <div className="mb-3 flex items-start justify-between">
                  <div className="flex-1">
                    <div className="mb-1 flex items-center gap-2">
                      <span className="rounded-md bg-blue-100 px-2 py-0.5 text-xs font-semibold text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                        {stat.questionId}
                      </span>
                      <span className="rounded-md bg-purple-100 px-2 py-0.5 text-xs font-medium text-purple-700 dark:bg-purple-900/30 dark:text-purple-400">
                        {stat.theme}
                      </span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {stat.questionText}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-gray-600 dark:text-gray-400">
                      <div className="flex items-center gap-1">
                        <Users className="h-3.5 w-3.5" />
                        <span>{stat.totalReached.toLocaleString()} reached</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <TrendingUp className="h-3.5 w-3.5" />
                        <span>{stat.reachRate}% reach rate</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />
                        <span>{stat.lastUpdated}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Reach Rate Progress Bar */}
                <div className="mb-3 h-2 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-500"
                    style={{ width: `${stat.reachRate}%` }}
                  />
                </div>

                {/* Top Options */}
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {stat.topOptions.map((option, optIndex) => (
                    <div
                      key={optIndex}
                      className="flex items-center justify-between rounded-lg bg-white p-3 dark:bg-gray-800"
                    >
                      <div className="flex-1">
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          Top #{optIndex + 1}: {option.option}
                        </p>
                        <div className="mt-1 flex items-center gap-2">
                          <p className="font-semibold text-gray-900 dark:text-white">
                            {option.count}
                          </p>
                          <span className="text-xs text-gray-500">({option.percentage}%)</span>
                        </div>
                      </div>
                      <div className="ml-3 h-12 w-12 rounded-full bg-gradient-to-br from-blue-100 to-blue-50 p-3 dark:from-blue-900/30 dark:to-blue-800/20">
                        <svg className="h-full w-full" viewBox="0 0 36 36">
                          <circle
                            cx="18"
                            cy="18"
                            r="16"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="3"
                            strokeDasharray={`${option.percentage * 1.005}, 100.5`}
                            className="text-blue-600 dark:text-blue-400"
                          />
                        </svg>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Link>
          ))
        ) : (
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-8 text-center dark:border-gray-700 dark:bg-gray-800/50">
            <p className="text-gray-600 dark:text-gray-400">No questions found in this theme</p>
          </div>
        )}
      </div>

      {/* Pagination Controls */}
      {filteredQuestions.length > itemsPerPage && (
        <div className="mt-6 flex items-center justify-between border-t border-gray-200 pt-4 dark:border-gray-700">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Showing {(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, filteredQuestions.length)}
            {' '}of {filteredQuestions.length}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className={`flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium transition-all ${
                currentPage === 1
                  ? 'cursor-not-allowed bg-gray-100 text-gray-400 dark:bg-gray-800 dark:text-gray-600'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
              }`}
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </button>

            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum
                if (totalPages <= 5) {
                  pageNum = i + 1
                } else if (currentPage <= 3) {
                  pageNum = i + 1
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i
                } else {
                  pageNum = currentPage - 2 + i
                }

                return (
                  <button
                    key={pageNum}
                    onClick={() => goToPage(pageNum)}
                    className={`h-9 w-9 rounded-lg text-sm font-medium transition-all ${
                      currentPage === pageNum
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
                    }`}
                  >
                    {pageNum}
                  </button>
                )
              })}
            </div>

            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium transition-all ${
                currentPage === totalPages
                  ? 'cursor-not-allowed bg-gray-100 text-gray-400 dark:bg-gray-800 dark:text-gray-600'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
              }`}
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default CurrentQuestionDistribution
