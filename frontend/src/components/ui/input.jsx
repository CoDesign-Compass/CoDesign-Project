import { cn } from '../../lib/utils'

export function Input({ className, ...props }) {
  return (
    <input
      className={cn(
        'w-full h-11 rounded-lg border border-gray-300 bg-white text-gray-900 px-3 text-base outline-none focus:border-blue-400 transition-colors placeholder:text-gray-400 disabled:opacity-50 disabled:cursor-not-allowed box-border',
        className,
      )}
      {...props}
    />
  )
}
