import { cn } from '../../lib/utils'

export function Checkbox({ className, ...props }) {
  return (
    <input
      type="checkbox"
      className={cn(
        'w-4 h-4 rounded border-gray-300 accent-compass-yellow cursor-pointer flex-shrink-0',
        className,
      )}
      {...props}
    />
  )
}
