'use client'
import React from 'react'

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger'

const BASE =
  'inline-flex items-center gap-[7px] px-[14px] py-[9px] rounded-md text-sm font-semibold cursor-pointer border border-transparent font-[family-name:var(--font-ui)] transition-colors duration-[150ms] no-underline justify-center flex-wrap max-w-full'

const VARIANTS: Record<ButtonVariant, string> = {
  primary:   'bg-[var(--primary)] text-[var(--primary-on)]',
  secondary: 'bg-[var(--secondary)] text-white',
  ghost:     'bg-transparent text-[var(--fg-2)] border-[var(--border)]',
  danger:    'bg-terra-500 text-white',
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
