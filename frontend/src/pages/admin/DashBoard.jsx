import React from 'react'
import MonthlySalesChart from '../../components/tailadmin/ecommerce/MonthlySalesChart'
import EcommerceMetrics from '../../components/tailadmin/ecommerce/EcommerceMetrics'
import MonthlyTarget from '../../components/tailadmin/ecommerce/AnalysisReport'
import Issues from '../../components/tailadmin/ecommerce/Issues'
import QuestionnaireMetrics from '../../components/questionnaire/QuestionnaireMetrics'
import QuestionOptionDistributionChart from '../../components/questionnaire/QuestionOptionDistributionChart'
import QuestionnaireFlowChart from '../../components/questionnaire/QuestionnaireFlowChart'
// import WordCloudComponent from '../../components/questionnaire/WordCloudComponent'
import CurrentQuestionDistribution from '../../components/questionnaire/CurrentQuestionDistribution'


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
    <>
      <div className="min-h-screen bg-gray-50 p-4 dark:bg-gray-900 md:p-6">
      <div className="mx-auto max-w-[1600px]">
        {/* Page Title */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white md:text-3xl">
            Data Dashboard
          </h1>
        </div>

        {/* Dashboard Grid Layout */}
        <div className="grid grid-cols-12 gap-4 md:gap-6">

          {/* Top KPI Overview */}
          <div className="col-span-12">
            <QuestionnaireMetrics />
          </div>

          {/* Top Area - Question Reach Status */}
          <div className="col-span-12">
            <CurrentQuestionDistribution />
          </div>

          {/* Left Middle Area - Quantitative Statistics (7 columns) */}
          <div className="col-span-12 space-y-6 xl:col-span-7">
            <QuestionOptionDistributionChart />
          </div>

          {/* Right Middle Area - Path Analysis (5 columns) */}
          <div className="col-span-12 xl:col-span-5">
            <QuestionnaireFlowChart />
          </div>

          {/* Bottom Area - Qualitative Analysis (Word Cloud) */}
          {/* <div className="col-span-12">
            <WordCloudComponent />
          </div> */}

          


      

        </div>
      </div>
    </div>


    </>
  )
}

export default DashBoard
