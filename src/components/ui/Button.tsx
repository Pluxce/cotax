'use client'
import React from 'react'

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger'

const BASE =
  'inline-flex items-center justify-center gap-2 px-3.5 py-[9px] rounded-[10px] text-sm font-semibold leading-none whitespace-nowrap cursor-pointer border font-[family-name:var(--font-ui)] transition-colors duration-150 no-underline shadow-none disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lagune-500 focus-visible:ring-offset-2'

const VARIANTS: Record<ButtonVariant, string> = {
  primary: 'border-transparent bg-lagune-500 text-white hover:bg-lagune-600 active:bg-lagune-700',
  secondary: 'border-transparent bg-forest-600 text-white hover:bg-forest-700',
  ghost: 'border-ink-200 bg-transparent text-ink-700 hover:bg-ink-50 hover:text-ink-900',
  danger: 'border-transparent bg-terra-500 text-white hover:bg-terra-600',
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  children: React.ReactNode
}

export function Button({ variant = 'primary', children, style, className, ...rest }: ButtonProps) {
  return (
    <button
      className={`${BASE} ${VARIANTS[variant]}${className ? ` ${className}` : ''}`}
      style={style}
      {...rest}
    >
      {children}
    </button>
  )
}