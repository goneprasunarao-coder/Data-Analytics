import { Database, Wand2, Cpu, PieChart } from "lucide-react"

const STEPS = [
  {
    icon: Database,
    step: "01",
    title: "Ingest & clean",
    body: "Raw HR records are normalized — categories tidied, out-of-range values dropped, promotion history collapsed into a single signal.",
  },
  {
    icon: Wand2,
    step: "02",
    title: "Engineer features",
    body: "Numeric fields are imputed and standardized while categorical fields are one-hot encoded into a consistent feature matrix.",
  },
  {
    icon: Cpu,
    step: "03",
    title: "Train & evaluate",
    body: "A logistic-regression model is fit on a stratified 80/20 split, then scored with accuracy, precision, recall, F1, and ROC-AUC.",
  },
  {
    icon: PieChart,
    step: "04",
    title: "Predict & explore",
    body: "Score hypothetical employees, review the confusion matrix, and slice the workforce across departments, tenure, and satisfaction.",
  },
]

export function HowItWorks() {
  return (
    <section id="how" className="scroll-mt-20 border-y border-[var(--color-border-soft)] bg-[var(--color-bg-panel)]/30 py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-semibold uppercase tracking-wider text-[var(--color-teal)]">
            How it works
          </span>
          <h2 className="mt-3 font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight sm:text-4xl">
            From raw export to retention insight
          </h2>
          <p className="mt-4 text-base text-[var(--color-text-secondary)]">
            A transparent, four-stage pipeline you can inspect end to end — no black boxes.
          </p>
        </div>

        <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((s, i) => (
            <div key={s.step} className="relative">
              <div className="h-full rounded-2xl border border-[var(--color-border-strong)] bg-[var(--color-bg-panel)] p-6">
                <div className="flex items-center justify-between">
                  <span className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br from-[var(--color-accent)] to-[var(--color-accent-dim)] text-white">
                    <s.icon className="h-5 w-5" />
                  </span>
                  <span className="font-[family-name:var(--font-display)] text-2xl font-bold text-[var(--color-border-strong)]">
                    {s.step}
                  </span>
                </div>
                <h3 className="mt-5 font-[family-name:var(--font-display)] text-lg font-semibold">
                  {s.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-[var(--color-text-secondary)]">
                  {s.body}
                </p>
              </div>
              {i < STEPS.length - 1 && (
                <div className="absolute right-[-14px] top-1/2 hidden h-px w-7 -translate-y-1/2 bg-[var(--color-border-strong)] lg:block" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
