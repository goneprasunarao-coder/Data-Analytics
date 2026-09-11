import Link from "next/link"
import { Activity } from "lucide-react"

export function SiteFooter() {
  return (
    <footer className="border-t border-[var(--color-border-soft)] bg-[var(--color-bg-panel)]/40">
      <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8">
        <div className="flex flex-col justify-between gap-8 md:flex-row">
          <div className="max-w-xs">
            <Link href="/" className="flex items-center gap-2.5">
              <span className="grid h-9 w-9 place-items-center rounded-[10px] bg-gradient-to-br from-[var(--color-accent)] to-[var(--color-accent-dim)]">
                <Activity className="h-5 w-5 text-white" strokeWidth={2.4} />
              </span>
              <span className="font-[family-name:var(--font-display)] text-[17px] font-semibold tracking-tight">
                Workforce<span className="text-[var(--color-accent)]">Signal</span>
              </span>
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-[var(--color-text-muted)]">
              Predictive attrition analytics that run entirely in your browser. Built for people
              teams who care about retention.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-10 sm:grid-cols-3">
            <FooterCol
              title="Platform"
              links={[
                { label: "Overview", href: "/#platform" },
                { label: "How it works", href: "/#how" },
                { label: "Dashboard", href: "/dashboard" },
              ]}
            />
            <FooterCol
              title="Resources"
              links={[
                { label: "Metrics", href: "/#metrics" },
                { label: "FAQ", href: "/#faq" },
                { label: "Model performance", href: "/dashboard" },
              ]}
            />
            <FooterCol
              title="Explore"
              links={[
                { label: "Prediction", href: "/dashboard" },
                { label: "Data explorer", href: "/dashboard" },
              ]}
            />
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-[var(--color-border-soft)] pt-6 sm:flex-row">
          <p className="text-xs text-[var(--color-text-muted)]">
            © {new Date().getFullYear()} Workforce Signal. Analytics demonstration project.
          </p>
          <p className="text-xs text-[var(--color-text-muted)]">
            Built with Next.js · Recharts · in-browser ML
          </p>
        </div>
      </div>
    </footer>
  )
}

function FooterCol({
  title,
  links,
}: {
  title: string
  links: { label: string; href: string }[]
}) {
  return (
    <div>
      <h4 className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-secondary)]">
        {title}
      </h4>
      <ul className="mt-4 space-y-2.5">
        {links.map((l) => (
          <li key={l.label}>
            <Link
              href={l.href}
              className="text-sm text-[var(--color-text-muted)] transition-colors hover:text-[var(--color-text-primary)]"
            >
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
