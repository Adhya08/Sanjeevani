import React from 'react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'buyer' | 'ngo' | 'outline'
  children: React.ReactNode
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  children,
  className = '',
  ...props
}) => {
  const baseClasses =
    'inline-flex items-center justify-center rounded-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50'

  const variantClasses = {
    primary: 'bg-primary-600 text-white hover:bg-primary-700 focus-visible:ring-primary-500',
    secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200 focus-visible:ring-gray-500',
    buyer: 'bg-buyer-600 text-white hover:bg-buyer-700 focus-visible:ring-buyer-500',
    ngo: 'bg-ngo-500 text-white hover:bg-ngo-600 focus-visible:ring-ngo-500',
    outline: 'border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 focus-visible:ring-gray-500',
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