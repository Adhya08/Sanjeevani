import React from 'react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'slate' | 'rust' | 'outline'
  children: React.ReactNode
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  children,
  className = '',
  ...props
}) => {
  const baseClasses =
    'inline-flex items-center justify-center font-sans font-medium text-sm transition-none border focus-visible:ring-2 focus-visible:ring-turmeric focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50'

  const variantClasses = {
    primary: 'bg-turmeric text-paper border-ink hover:bg-turmeric/90',
    secondary: 'bg-paper text-ink border-ink hover:bg-paper/80',
    slate: 'bg-slate text-paper border-ink hover:bg-slate/90',
    rust: 'bg-rust text-paper border-ink hover:bg-rust/90',
    outline: 'border-ink bg-transparent text-ink hover:bg-slate/10',
  }

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}