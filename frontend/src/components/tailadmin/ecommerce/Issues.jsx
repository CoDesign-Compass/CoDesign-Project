import { ChatIcon, ArrowDownIcon, ArrowUpIcon, GroupIcon } from '../icons'
import Badge from '../ui/badge/Badge'

export default function Issues() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 md:gap-6">
      {/* <!-- Metric Item Start --> */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <h4>ISSUE 1</h4>
        <div className="flex items-center flex-start mt-5 gap-4">
          <div className="flex items-center justify-center w-10 h-10 bg-gray-100 rounded-xl dark:bg-gray-800">
            <ChatIcon className="text-gray-800 size-6 dark:text-white/90" />
          </div>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Are integrated services helpful for consumers?
          </span>
        </div>

        <div className="flex items-end justify-between mt-5">
          <div>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              Paticipants 5,359
            </h4>
          </div>

          <Badge color="success">
            <ArrowUpIcon />
            3.05%
          </Badge>
        </div>
      </div>
      {/* <!-- Metric Item End --> */}
      {/* <!-- Metric Item Start --> */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <h4>ISSUE 2</h4>
        <div className="flex items-center flex-start mt-5 gap-4">
          <div className="flex items-center justify-center w-10 h-10 bg-gray-100 rounded-xl dark:bg-gray-800">
            <ChatIcon className="text-gray-800 size-6 dark:text-white/90" />
          </div>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Are integrated services helpful for consumers?
          </span>
        </div>

        <div className="flex items-end justify-between mt-5">
          <div>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              Paticipants 3,729
            </h4>
          </div>

          <Badge color="success">
            <ArrowUpIcon />
            3.05%
          </Badge>
        </div>
      </div>
      {/* <!-- Metric Item End --> */}
      {/* <!-- Metric Item Start --> */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <h4>ISSUE 3</h4>
        <div className="flex items-center flex-start mt-5 gap-4">
          <div className="flex items-center justify-center w-10 h-10 bg-gray-100 rounded-xl dark:bg-gray-800">
            <ChatIcon className="text-gray-800 size-6 dark:text-white/90" />
          </div>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Are integrated services helpful for consumers?
          </span>
        </div>

        <div className="flex items-end justify-between mt-5">
          <div>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              Paticipants 1,333
            </h4>
          </div>

          <Badge color="error">
            <ArrowDownIcon />
            9.05%
          </Badge>
        </div>
      </div>
      {/* <!-- Metric Item End --> */}
    </div>
  )
}
