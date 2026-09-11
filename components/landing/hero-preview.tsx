import { Users, TrendingDown, Gauge, Building2 } from "lucide-react"

const BARS = [
  { label: "Sales", value: 82 },
  { label: "Ops", value: 64 },
  { label: "Eng", value: 41 },
  { label: "Finance", value: 33 },
  { label: "HR", value: 52 },
  { label: "IT", value: 28 },
]

export function HeroPreview() {
  return (
    <div className="relative">
      <div className="absolute -inset-6 rounded-[28px] bg-gradient-to-br from-[rgba(139,124,246,0.18)] to-[rgba(45,212,191,0.1)] blur-2xl" />
      <div className="relative rounded-[20px] border border-[var(--color-border-strong)] bg-[var(--color-bg-panel)] p-4 shadow-2xl shadow-black/40">
        <div className="flex items-center justify-between border-b border-[var(--color-border-soft)] px-1 pb-3">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-[var(--color-rose)]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[var(--color-amber)]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[var(--color-green)]" />
          </div>
          <span className="text-[11px] text-[var(--color-text-muted)]">Attrition Overview · Live</span>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-4">
          <MiniStat icon={Users} label="Headcount" value="5,513" tone="text-[var(--color-blue)]" />
          <MiniStat icon={TrendingDown} label="Attrition" value="16.2%" tone="text-[var(--color-rose)]" />
          <MiniStat icon={Gauge} label="Avg satisfaction" value="3.4 / 5" tone="text-[var(--color-teal)]" />
          <MiniStat icon={Building2} label="Departments" value="9" tone="text-[var(--color-amber)]" />
        </div>

        <div className="mt-4 rounded-xl border border-[var(--color-border-soft)] bg-[var(--color-bg-deep)] p-4">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-xs font-medium text-[var(--color-text-secondary)]">
              Attrition risk by department
            </span>
            <span className="text-[10px] text-[var(--color-text-muted)]">%</span>
          </div>
          <div className="flex h-32 items-end justify-between gap-2">
            {BARS.map((b) => (
              <div key={b.label} className="flex flex-1 flex-col items-center gap-1.5">
                <div className="flex w-full flex-1 items-end">
                  <div
                    className="w-full rounded-t-md bg-gradient-to-t from-[var(--color-accent-dim)] to-[var(--color-accent)]"
                    style={{ height: `${b.value}%` }}
                  />
                </div>
                <span className="text-[10px] text-[var(--color-text-muted)]">{b.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="absolute -right-4 -top-6 hidden animate-float-slow rounded-xl border border-[var(--color-border-strong)] bg-[var(--color-bg-raised)] px-4 py-3 shadow-xl sm:block">
        <div className="text-[10px] uppercase tracking-wide text-[var(--color-text-muted)]">Risk score</div>
        <div className="mt-1 flex items-baseline gap-1">
          <span className="font-[family-name:var(--font-display)] text-2xl font-bold text-[var(--color-rose)]">
            0.78
          </span>
          <span className="text-[11px] text-[var(--color-text-muted)]">high</span>
        </div>
      </div>
    </div>
  )
}

function MiniStat({
  icon: Icon,
  label,
  value,
  tone,
}: {
  icon: typeof Users
  label: string
  value: string
  tone: string
}) {
  return (
    <div className="rounded-xl border border-[var(--color-border-soft)] bg-[var(--color-bg-deep)] p-3">
      <Icon className={`h-4 w-4 ${tone}`} />
      <div className="mt-2 font-[family-name:var(--font-display)] text-lg font-semibold leading-none">
        {value}
      </div>
      <div className="mt-1 text-[11px] text-[var(--color-text-muted)]">{label}</div>
    </div>
  )
}
