import Link from "next/link"
import { ArrowRight, Sparkles, TrendingDown, ShieldCheck } from "lucide-react"
import { HeroPreview } from "./hero-preview"

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-28 pb-16 sm:pt-36 sm:pb-24">
      <div className="mx-auto grid max-w-7xl items-center gap-14 px-5 sm:px-8 lg:grid-cols-[1.05fr_1fr]">
        <div className="relative z-10 animate-fade-up">
          <div className="inline-flex items-center gap-2 rounded-full border border-[var(--color-border-strong)] bg-[var(--color-bg-panel)] px-3.5 py-1.5 text-xs font-medium text-[var(--color-text-secondary)]">
            <Sparkles className="h-3.5 w-3.5 text-[var(--color-accent)]" />
            In-browser ML · No data leaves the client
          </div>

          <h1 className="mt-6 font-[family-name:var(--font-display)] text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
            Turn workforce data into
            <span className="bg-gradient-to-r from-[var(--color-accent)] via-[#a99bff] to-[var(--color-teal)] bg-clip-text text-transparent">
              {" "}
              retention signals
            </span>
          </h1>

          <p className="mt-5 max-w-xl text-base leading-relaxed text-[var(--color-text-secondary)] sm:text-lg">
            Workforce Signal blends business intelligence with a live logistic-regression model to
            predict employee attrition, surface at-risk teams, and quantify the drivers behind every
            departure — all rendered from your own data.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              href="/dashboard"
              className="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-br from-[var(--color-accent)] to-[var(--color-accent-dim)] px-5 py-3 text-sm font-semibold text-white shadow-xl shadow-[rgba(139,124,246,0.3)] transition-transform hover:-translate-y-0.5"
            >
              Explore the dashboard
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link
              href="/#how"
              className="inline-flex items-center gap-2 rounded-xl border border-[var(--color-border-strong)] bg-[var(--color-bg-panel)] px-5 py-3 text-sm font-semibold text-[var(--color-text-primary)] transition-colors hover:bg-[var(--color-bg-raised)]"
            >
              See how it works
            </Link>
          </div>

          <div className="mt-10 flex flex-wrap gap-x-8 gap-y-4">
            <HeroStat icon={TrendingDown} value="5,513" label="Employee records analyzed" />
            <HeroStat icon={ShieldCheck} value="87%+" label="Model ROC-AUC" />
            <HeroStat icon={Sparkles} value="24" label="Engineered features" />
          </div>
        </div>

        <div className="relative z-10 animate-fade-up [animation-delay:120ms]">
          <HeroPreview />
        </div>
      </div>
    </section>
  )
}

function HeroStat({
  icon: Icon,
  value,
  label,
}: {
  icon: typeof TrendingDown
  value: string
  label: string
}) {
  return (
    <div className="flex items-center gap-3">
      <span className="grid h-10 w-10 place-items-center rounded-lg border border-[var(--color-border-strong)] bg-[var(--color-bg-panel)] text-[var(--color-accent)]">
        <Icon className="h-5 w-5" />
      </span>
      <div>
        <div className="font-[family-name:var(--font-display)] text-lg font-semibold leading-none">
          {value}
        </div>
        <div className="mt-1 text-xs text-[var(--color-text-muted)]">{label}</div>
      </div>
    </div>
  )
}
