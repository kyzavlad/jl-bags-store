import { forwardRef } from 'react'

export const Input = forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className = '', ...props }, ref) => (
    <input
      ref={ref}
      className={[
        'w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm',
        'focus:outline-none focus:ring-2 focus:ring-gray-400 disabled:bg-gray-100',
        className,
      ].join(' ')}
      {...props}
    />
  )
)
Input.displayName = 'Input'

export const Textarea = forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className = '', ...props }, ref) => (
  <textarea
    ref={ref}
    className={[
      'w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm',
      'focus:outline-none focus:ring-2 focus:ring-gray-400 disabled:bg-gray-100',
      className,
    ].join(' ')}
    {...props}
  />
))
Textarea.displayName = 'Textarea'
