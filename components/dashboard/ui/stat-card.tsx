import type { LucideIcon } from "lucide-react"

export function StatCard({
  icon: Icon,
  label,
  value,
  sub,
  tone = "accent",
}: {
  icon: LucideIcon
  label: string
  value: string
  sub?: string
  tone?: "accent" | "teal" | "amber" | "rose" | "green" | "blue"
}) {
  const toneMap: Record<string, string> = {
    accent: "text-[var(--color-accent)] border-[rgba(139,124,246,0.3)] bg-[rgba(139,124,246,0.08)]",
    teal: "text-[var(--color-teal)] border-[rgba(45,212,191,0.3)] bg-[rgba(45,212,191,0.08)]",
    amber: "text-[var(--color-amber)] border-[rgba(245,169,78,0.3)] bg-[rgba(245,169,78,0.08)]",
    rose: "text-[var(--color-rose)] border-[rgba(251,107,135,0.3)] bg-[rgba(251,107,135,0.08)]",
    green: "text-[var(--color-green)] border-[rgba(57,217,138,0.3)] bg-[rgba(57,217,138,0.08)]",
    blue: "text-[var(--color-blue)] border-[rgba(91,141,239,0.3)] bg-[rgba(91,141,239,0.08)]",
  }
  return (
    <div className="rounded-2xl border border-[var(--color-border-strong)] bg-[var(--color-bg-panel)] p-5">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium uppercase tracking-wide text-[var(--color-text-muted)]">
          {label}
        </span>
        <span className={`grid h-9 w-9 place-items-center rounded-lg border ${toneMap[tone]}`}>
          <Icon className="h-4.5 w-4.5" />
        </span>
      </div>
      <div className="mt-4 font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight">
        {value}
      </div>
      {sub && <div className="mt-1 text-xs text-[var(--color-text-muted)]">{sub}</div>}
    </div>
  )
}
