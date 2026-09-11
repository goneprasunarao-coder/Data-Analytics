import type { ReactNode } from "react"

export function Panel({
  title,
  subtitle,
  action,
  children,
  className = "",
}: {
  title?: string
  subtitle?: string
  action?: ReactNode
  children: ReactNode
  className?: string
}) {
  return (
    <section
      className={`rounded-2xl border border-[var(--color-border-strong)] bg-[var(--color-bg-panel)] p-5 ${className}`}
    >
      {(title || action) && (
        <header className="mb-4 flex items-start justify-between gap-3">
          <div>
            {title && (
              <h3 className="font-[family-name:var(--font-display)] text-base font-semibold">
                {title}
              </h3>
            )}
            {subtitle && <p className="mt-0.5 text-xs text-[var(--color-text-muted)]">{subtitle}</p>}
          </div>
          {action}
        </header>
      )}
      {children}
    </section>
  )
}
