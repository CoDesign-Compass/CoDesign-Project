import React from 'react'
import BarChartOne from '../../components/tailadmin/charts/bar/BarChartOne'
import MonthlySalesChart from '../../components/tailadmin/ecommerce/MonthlySalesChart'
import EcommerceMetrics from '../../components/tailadmin/ecommerce/EcommerceMetrics'
import MonthlyTarget from '../../components/tailadmin/ecommerce/AnalysisReport'
import Issues from '../../components/tailadmin/ecommerce/Issues'
import QuestionnaireMetrics from '../../components/questionnaire/QuestionnaireMetrics'
import QuestionOptionDistributionChart from '../../components/questionnaire/QuestionOptionDistributionChart'
import QuestionnaireFlowChart from '../../components/questionnaire/QuestionnaireFlowChart'
// import WordCloudComponent from '../../components/questionnaire/WordCloudComponent'
import CurrentQuestionDistribution from '../../components/questionnaire/CurrentQuestionDistribution'


// --- dashboard components ---

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
