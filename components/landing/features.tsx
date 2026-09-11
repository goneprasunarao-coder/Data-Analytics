import { Brain, LineChart, Radar, Layers, LockKeyhole, FileSpreadsheet } from "lucide-react"

const FEATURES = [
  {
    icon: Brain,
    title: "In-browser prediction model",
    body: "A regularized logistic-regression classifier trains on your dataset entirely client-side, scoring each employee's probability of leaving.",
    tone: "text-[var(--color-accent)]",
  },
  {
    icon: LineChart,
    title: "Executive analytics",
    body: "Headcount, attrition rate, satisfaction, and salary bands roll up into a clean dashboard with department and tenure breakdowns.",
    tone: "text-[var(--color-teal)]",
  },
  {
    icon: Radar,
    title: "Driver analysis",
    body: "Standardized model coefficients reveal which factors push attrition risk up or down, ranked by magnitude and direction.",
    tone: "text-[var(--color-amber)]",
  },
  {
    icon: Layers,
    title: "Robust feature pipeline",
    body: "Median imputation, one-hot encoding, and standardization turn messy HR exports into a reliable 24-dimension feature space.",
    tone: "text-[var(--color-blue)]",
  },
  {
    icon: FileSpreadsheet,
    title: "Bring your own data",
    body: "Upload an Excel or CSV export and the platform maps common HR column names automatically — no schema wrangling required.",
    tone: "text-[var(--color-green)]",
  },
  {
    icon: LockKeyhole,
    title: "Private by design",
    body: "Every computation runs in the browser. Records never touch a server, so sensitive people data stays under your control.",
    tone: "text-[var(--color-rose)]",
  },
]

export function Features() {
  return (
    <section id="platform" className="scroll-mt-20 py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="max-w-2xl">
          <span className="text-sm font-semibold uppercase tracking-wider text-[var(--color-accent)]">
            Platform
          </span>
          <h2 className="mt-3 font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight sm:text-4xl">
            Everything you need to understand attrition
          </h2>
          <p className="mt-4 text-base text-[var(--color-text-secondary)]">
            A complete analytics workspace pairing descriptive BI with predictive modeling — built
            for HR leaders, people analysts, and workforce planners.
          </p>
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f) => (
            <article
              key={f.title}
              className="group rounded-2xl border border-[var(--color-border-strong)] bg-[var(--color-bg-panel)] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-[var(--color-accent-dim)] hover:bg-[var(--color-bg-panel-alt)]"
            >
              <span className="grid h-12 w-12 place-items-center rounded-xl border border-[var(--color-border-strong)] bg-[var(--color-bg-deep)] transition-colors group-hover:border-[var(--color-accent-dim)]">
                <f.icon className={`h-6 w-6 ${f.tone}`} />
              </span>
              <h3 className="mt-5 font-[family-name:var(--font-display)] text-lg font-semibold">
                {f.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-[var(--color-text-secondary)]">
                {f.body}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
