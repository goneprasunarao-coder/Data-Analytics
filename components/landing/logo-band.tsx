const ITEMS = [
  "Logistic Regression",
  "Feature Engineering",
  "Stratified Split",
  "ROC-AUC Scoring",
  "Median Imputation",
  "One-Hot Encoding",
  "Standardization",
  "Risk Scoring",
]

export function LogoBand() {
  return (
    <section className="border-y border-[var(--color-border-soft)] bg-[var(--color-bg-panel)]/40 py-6">
      <div className="relative mx-auto max-w-7xl overflow-hidden px-5 sm:px-8">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-[var(--color-bg-deep)] to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-[var(--color-bg-deep)] to-transparent" />
        <div className="flex w-max marquee-track">
          {[...ITEMS, ...ITEMS].map((item, i) => (
            <span
              key={i}
              className="mx-6 whitespace-nowrap font-[family-name:var(--font-display)] text-sm font-medium text-[var(--color-text-muted)]"
            >
              {item}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
