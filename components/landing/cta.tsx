import Link from "next/link"
import { ArrowRight } from "lucide-react"

export function Cta() {
  return (
    <section className="py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="relative overflow-hidden rounded-3xl border border-[var(--color-border-strong)] bg-[var(--color-bg-panel)] p-10 text-center sm:p-16">
          <div className="pointer-events-none absolute -top-24 left-1/2 h-64 w-[38rem] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(139,124,246,0.28),transparent_70%)] blur-2xl" />
          <div className="relative">
            <h2 className="mx-auto max-w-2xl font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight sm:text-4xl">
              See who is at risk before they hand in notice
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-base text-[var(--color-text-secondary)]">
              Launch the interactive dashboard and start exploring attrition signals across your
              workforce in seconds.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link
                href="/dashboard"
                className="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-br from-[var(--color-accent)] to-[var(--color-accent-dim)] px-6 py-3 text-sm font-semibold text-white shadow-xl shadow-[rgba(139,124,246,0.3)] transition-transform hover:-translate-y-0.5"
              >
                Launch dashboard
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
