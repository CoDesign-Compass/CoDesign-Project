import React from 'react'

const QuestionnaireFlowChart = () => {
  // Simplified flow display (funnel analysis)
  const flowSteps = [
    { step: 'Q1', respondents: 1248, completed: 1248, dropRate: 0 },
    { step: 'Q2', respondents: 1089, completed: 1089, dropRate: 12.7 },
    { step: 'Q3', respondents: 967, completed: 967, dropRate: 11.2 },
    { step: 'Q4', respondents: 845, completed: 845, dropRate: 12.6 },
    { step: 'Q5', respondents: 723, completed: 723, dropRate: 14.4 }
  ]

  return (
    <div className="space-y-6">
      {/* Funnel Analysis */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <h2 className="mb-6 text-lg font-semibold text-gray-900 dark:text-white">Questionnaire Funnel Analysis</h2>

        <div className="space-y-4">
          {flowSteps.map((step, index) => {
            const percentage = (step.respondents / flowSteps[0].respondents) * 100
            const width = percentage

            return (
              <div key={index} className="relative">
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="font-medium text-gray-700 dark:text-gray-300">{step.step}</span>
                  <div className="flex items-center gap-4">
                    <span className="text-gray-600 dark:text-gray-400">
                      {step.respondents.toLocaleString()} respondents
                    </span>
                    {index > 0 && (
                      <span className="text-red-600">
                        Drop {step.dropRate}%
                      </span>
                    )}
                  </div>
                </div>
                <div className="h-12 w-full overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800">
                  <div
                    className="flex h-full items-center justify-center rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-500"
                    style={{ width: `${width}%` }}
                  >
                    <span className="text-sm font-semibold text-white">
                      {percentage.toFixed(1)}%
                    </span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        <div className="mt-6 rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">
          <div className="flex items-start gap-3">
            <div className="rounded-full bg-blue-500 p-1">
              <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-blue-900 dark:text-blue-100">Flow Insights</h4>
              <p className="mt-1 text-sm text-blue-800 dark:text-blue-200">
                From Q1 to Q5, total drop rate is 42.1%. Q4 to Q5 has the highest drop rate (14.4%), suggesting optimization needed for this step.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Path Analysis */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <h2 className="mb-6 text-lg font-semibold text-gray-900 dark:text-white">Main Response Paths</h2>

        <div className="space-y-3">
          <div className="flex items-center gap-3 rounded-lg border border-gray-200 p-4 dark:border-gray-700">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
              <span className="font-semibold text-blue-600 dark:text-blue-400">1</span>
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900 dark:text-white">Q1(A) → Q2(Yes) → Q3(Satisfied)</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">320 respondents (25.6%)</p>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-lg border border-gray-200 p-4 dark:border-gray-700">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900/30">
              <span className="font-semibold text-purple-600 dark:text-purple-400">2</span>
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900 dark:text-white">Q1(C) → Q2(Yes) → Q3(Very Satisfied)</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">290 respondents (23.2%)</p>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-lg border border-gray-200 p-4 dark:border-gray-700">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
              <span className="font-semibold text-green-600 dark:text-green-400">3</span>
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900 dark:text-white">Q1(B) → Q2(No) → Q3(Neutral)</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">198 respondents (15.9%)</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default QuestionnaireFlowChart
