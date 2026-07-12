import type { ReactNode } from 'react'

interface Props {
  children: ReactNode
  className?: string
}

export default function HudPanel({ children, className = '' }: Props) {
  return (
    <div className={`relative bg-parchment-100 dark:bg-ink-900 rounded-lg p-5 ${className}`}>
      {/* corner brackets — the signature element */}
      <span className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-gold-500 dark:border-gold-400 rounded-tl-md" />
      <span className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-gold-500 dark:border-gold-400 rounded-tr-md" />
      <span className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-gold-500 dark:border-gold-400 rounded-bl-md" />
      <span className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-gold-500 dark:border-gold-400 rounded-br-md" />
      {children}
    </div>
  )
}