import React, { useState } from 'react'
import { useNavigate } from 'react-router'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

const QuestionOptionDistributionChart = () => {
  const navigate = useNavigate()
  const [selectedQuestion, setSelectedQuestion] = useState('question1')

  // Mock data for different question options
  const questionData = {
    question1: [
      { option: 'Option A', count: 450, percentage: 36 },
      { option: 'Option B', count: 380, percentage: 30 },
      { option: 'Option C', count: 280, percentage: 22 },
      { option: 'Option D', count: 138, percentage: 12 }
    ],
    question2: [
      { option: 'Yes', count: 654, percentage: 60 },
      { option: 'No', count: 435, percentage: 40 }
    ],
    question3: [
      { option: 'Very Satisfied', count: 290, percentage: 30 },
      { option: 'Satisfied', count: 387, percentage: 40 },
      { option: 'Neutral', count: 193, percentage: 20 },
      { option: 'Dissatisfied', count: 97, percentage: 10 }
    ]
  }

  // Stacked bar chart data (different path respondent selection ratios)
  const pathData = [
    { question: 'Q1', 'Path A': 320, 'Path B': 280, 'Path C': 450, 'Path D': 198 },
    { question: 'Q2', 'Path A': 280, 'Path B': 320, 'Path C': 380, 'Path D': 109 },
    { question: 'Q3', 'Path A': 250, 'Path B': 290, 'Path C': 320, 'Path D': 107 },
    { question: 'Q4', 'Path A': 220, 'Path B': 250, 'Path C': 280, 'Path D': 95 },
    { question: 'Q5', 'Path A': 190, 'Path B': 210, 'Path C': 240, 'Path D': 83 }
  ]

  const questions = [
    { id: 'question1', label: 'Q1: What is your age range?' },
    { id: 'question2', label: 'Q2: Have you used this product?' },
    { id: 'question3', label: 'Q3: Product satisfaction level?' }
  ]

  return (
    <div className="space-y-6">
      {/* Option Distribution Chart */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Question Option Distribution</h2>
          <select
            value={selectedQuestion}
            onChange={(e) => setSelectedQuestion(e.target.value)}
            className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
          >
            {questions.map((q) => (
              <option key={q.id} value={q.id}>
                {q.label}
              </option>
            ))}
          </select>
        </div>

        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={questionData[selectedQuestion]}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="option" tick={{ fill: '#6b7280', fontSize: 12 }} />
            <YAxis tick={{ fill: '#6b7280', fontSize: 12 }} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#fff',
                border: '1px solid #e5e7eb',
                borderRadius: '8px'
              }}
            />
            <Bar dataKey="count" fill="#3b82f6" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>

        <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {questionData[selectedQuestion].map((item, index) => (
            <div
              key={index}
              className="cursor-pointer rounded-lg bg-gray-50 p-3 transition-all hover:bg-gray-100 hover:shadow-md dark:bg-gray-800/50 dark:hover:bg-gray-800"
              onClick={() => navigate(`/issue/${selectedQuestion}`)}
            >
              <p className="text-xs text-gray-600 dark:text-gray-400">{item.option}</p>
              <p className="mt-1 text-lg font-semibold text-gray-900 dark:text-white">{item.count}</p>
              <p className="text-xs text-gray-500 dark:text-gray-500">{item.percentage}%</p>
            </div>
          ))}
        </div>
      </div>

      {/* Stacked Bar Chart - Different Path Respondents */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <h2 className="mb-6 text-lg font-semibold text-gray-900 dark:text-white">Respondent Distribution by Path</h2>

        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={pathData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="question" tick={{ fill: '#6b7280', fontSize: 12 }} />
            <YAxis tick={{ fill: '#6b7280', fontSize: 12 }} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#fff',
                border: '1px solid #e5e7eb',
                borderRadius: '8px'
              }}
            />
            <Legend />
            <Bar dataKey="Path A" stackId="a" fill="#3b82f6" radius={[0, 0, 0, 0]} />
            <Bar dataKey="Path B" stackId="a" fill="#8b5cf6" radius={[0, 0, 0, 0]} />
            <Bar dataKey="Path C" stackId="a" fill="#10b981" radius={[0, 0, 0, 0]} />
            <Bar dataKey="Path D" stackId="a" fill="#f59e0b" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export default QuestionOptionDistributionChart
