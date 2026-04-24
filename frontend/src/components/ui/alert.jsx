import { cn } from '../../lib/utils'

export function Alert({ className, variant = 'info', ...props }) {
  return (
    <div
      role={variant === 'error' ? 'alert' : 'status'}
      aria-live={variant === 'error' ? 'assertive' : 'polite'}
      className={cn(
        'w-full rounded-lg border px-4 py-3 text-sm leading-relaxed',
        variant === 'error' && 'border-red-200 bg-red-50 text-red-800',
        variant === 'success' && 'border-green-200 bg-green-50 text-green-800',
        variant === 'info' && 'border-gray-200 bg-gray-50 text-[var(--text-color)]',
        className,
      )}
      {...props}
    />
  )
}
