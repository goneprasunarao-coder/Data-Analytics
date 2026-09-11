const STATS = [
  { value: "5,513", label: "Employee records", sub: "in the bundled dataset" },
  { value: "9", label: "Departments", sub: "across the organization" },
  { value: "24", label: "Model features", sub: "numeric + one-hot encoded" },
  { value: "80/20", label: "Train / test split", sub: "stratified by outcome" },
]

export function Metrics() {
  return (
    <section id="metrics" className="scroll-mt-20 py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="rounded-3xl border border-[var(--color-border-strong)] bg-gradient-to-br from-[var(--color-bg-panel)] to-[var(--color-bg-panel-alt)] p-8 sm:p-12">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {STATS.map((s) => (
              <div key={s.label}>
                <div className="font-[family-name:var(--font-display)] text-4xl font-bold tracking-tight text-[var(--color-text-primary)] sm:text-5xl">
                  {s.value}
                </div>
                <div className="mt-3 text-sm font-semibold text-[var(--color-accent)]">{s.label}</div>
                <div className="mt-1 text-xs text-[var(--color-text-muted)]">{s.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
