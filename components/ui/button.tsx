import { forwardRef } from 'react'

type Variant = 'primary' | 'outline' | 'ghost' | 'danger'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
}

const styles: Record<Variant, string> = {
  primary: 'bg-primary text-primary-foreground hover:opacity-90',
  outline: 'border border-gray-300 bg-white text-gray-800 hover:bg-gray-50',
  ghost: 'bg-transparent text-gray-700 hover:bg-gray-100',
  danger: 'bg-red-600 text-white hover:bg-red-700',
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', className = '', ...props }, ref) => (
    <button
      ref={ref}
      className={[
        'inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium',
        'transition-colors disabled:opacity-50 disabled:pointer-events-none',
        styles[variant],
        className,
      ].join(' ')}
      {...props}
    />
  )
)
Button.displayName = 'Button'
