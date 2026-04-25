import { cn } from '../../lib/utils'

export function Checkbox({ className, ...props }) {
  return (
    <input
      type="checkbox"
      className={cn(
        `
        h-5 w-5 shrink-0 cursor-pointer appearance-none rounded-md
        border border-[#c5cbd3] bg-white
        checked:border-[#A2D2FF] checked:bg-[#A2D2FF]
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffe071] focus-visible:ring-offset-2
        dark:border-[#8a8f98] dark:bg-[#2f2f2f]
        `,
        className,
      )}
      {...props}
    />
  )
}
