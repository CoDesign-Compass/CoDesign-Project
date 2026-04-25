import { cva } from 'class-variance-authority'
import { cn } from '../../lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center font-poppins font-medium transition-all focus-visible:outline-none disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer',
  {
    variants: {
      variant: {
        primary: 'bg-compass-purple text-white hover:bg-[#6a6aa8] shadow-sm rounded-lg',
        yellow: 'bg-compass-yellow text-black hover:bg-[#ffd84f] font-semibold rounded-lg',
        dark: 'bg-[#2f2f2f] border-[3px] border-compass-yellow text-white hover:bg-black rounded-[14px]',
        outline: 'border border-gray-300 bg-transparent hover:bg-black/5 text-[var(--text-color)] rounded-lg',
        ghost: 'bg-transparent hover:bg-black/10 text-[var(--text-color)] underline underline-offset-8 rounded-lg',
        plain: 'bg-transparent border-none text-[var(--text-color)] rounded-lg hover:bg-black/10',
      },
      size: {
        sm: 'h-8 px-3 text-sm',
        md: 'h-10 px-6 text-base',
        lg: 'h-12 px-8 text-lg',
        xl: 'text-[clamp(20px,3.2vw,36px)] py-[clamp(8px,1.2vw,12px)] px-[clamp(18px,3vw,28px)]',
        hero: 'text-[clamp(20px,3.2vw,36px)] py-[clamp(8px,1.2vw,12px)] px-[clamp(18px,3vw,28px)] rounded-lg',
        icon: 'h-8 w-8 p-0',
      },
    },
    defaultVariants: { variant: 'primary', size: 'md' },
  },
)

export function Button({ className, variant, size, ...props }) {
  return (
    <button className={cn(buttonVariants({ variant, size }), className)} {...props} />
  )
}
