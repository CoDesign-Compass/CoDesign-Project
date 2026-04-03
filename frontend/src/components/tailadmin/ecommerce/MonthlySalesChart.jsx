import Chart from 'react-apexcharts'
import { Dropdown } from '../ui/dropdown/Dropdown'
import { DropdownItem } from '../ui/dropdown/DropdownItem'
import { MoreDotIcon } from '../icons'
import { useEffect, useMemo, useState } from 'react'

export default function MonthlySalesChart() {
  const API_BASE =
    process.env.REACT_APP_API_BASE_URL ||
    'https://codesign-project.onrender.com'
  const [isOpen, setIsOpen] = useState(false)
  const [monthlyData, setMonthlyData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false

    const fetchMonthlySubmissions = async () => {
      setLoading(true)
      setError('')

      try {
        const res = await fetch(`${API_BASE}/api/submissions/monthly?months=12`)
        if (!res.ok) {
          throw new Error(`Failed to load monthly submissions: ${res.status}`)
        }

        const data = await res.json()
        if (!cancelled) {
          setMonthlyData(Array.isArray(data) ? data : [])
        }
      } catch (err) {
        console.error(err)
        if (!cancelled) {
          setError('Failed to load chart data')
          setMonthlyData([])
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    fetchMonthlySubmissions()

    return () => {
      cancelled = true
    }
  }, [API_BASE])

  const categories = useMemo(() => {
    return monthlyData.map((item) => {
      const [year, month] = String(item.month || '').split('-')
      if (!year || !month) return String(item.month || '')
      const dt = new Date(Number(year), Number(month) - 1, 1)
      return dt.toLocaleString('en-US', { month: 'short' })
    })
  }, [monthlyData])

  const seriesData = useMemo(() => {
    return monthlyData.map((item) => Number(item.count || 0))
  }, [monthlyData])

  const options = {
    colors: ['#465fff'],
    chart: {
      fontFamily: 'Outfit, sans-serif',
      type: 'bar',
      height: 180,
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '39%',
        borderRadius: 5,
        borderRadiusApplication: 'end',
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: 4,
      colors: ['transparent'],
    },
    xaxis: {
      categories,
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    legend: {
      show: true,
      position: 'top',
      horizontalAlign: 'left',
      fontFamily: 'Outfit',
    },
    yaxis: {
      title: {
        text: undefined,
      },
    },
    grid: {
      yaxis: {
        lines: {
          show: true,
        },
      },
    },
    fill: {
      opacity: 1,
    },

    tooltip: {
      x: {
        show: true,
      },
      y: {
        formatter: (val) => `${val}`,
      },
    },
  }

  const series = [
    {
      name: 'Submissions',
      data: seriesData,
    },
  ]

  function toggleDropdown() {
    setIsOpen(!isOpen)
  }

  function closeDropdown() {
    setIsOpen(false)
  }
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
          Monthly Submissions
        </h3>
        <div className="relative inline-block">
          <button className="dropdown-toggle" onClick={toggleDropdown}>
            <MoreDotIcon className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 size-6" />
          </button>
          <Dropdown
            isOpen={isOpen}
            onClose={closeDropdown}
            className="w-40 p-2"
          >
            <DropdownItem
              onItemClick={closeDropdown}
              className="flex w-full font-normal text-left text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
            >
              View More
            </DropdownItem>
            <DropdownItem
              onItemClick={closeDropdown}
              className="flex w-full font-normal text-left text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
            >
              Delete
            </DropdownItem>
          </Dropdown>
        </div>
      </div>

      <div className="max-w-full overflow-x-auto custom-scrollbar">
        <div className="-ml-5 min-w-[650px] xl:min-w-full pl-2">
          <Chart options={options} series={series} type="bar" height={180} />
        </div>
      </div>
      <div className="pb-4 text-xs text-gray-500 dark:text-gray-400">
        {error
          ? error
          : loading
            ? 'Loading monthly submissions...'
            : 'Showing the last 12 months of submitted responses.'}
      </div>
    </div>
  )
}
