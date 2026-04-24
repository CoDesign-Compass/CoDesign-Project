import { cn } from '../../lib/utils'

export function Textarea({ className, ...props }) {
  return (
    <textarea
      className={cn(
        'w-full min-h-[120px] rounded-lg border border-gray-300 bg-white text-gray-900 px-3 py-3 text-base outline-none focus:border-blue-400 transition-colors placeholder:text-gray-400 disabled:opacity-50 resize-vertical box-border leading-relaxed',
        className,
      )}
      {...props}
    />
  )
}
