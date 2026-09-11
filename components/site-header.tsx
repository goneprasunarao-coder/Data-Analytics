"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { Activity, Menu, X } from "lucide-react"

const NAV = [
  { label: "Platform", href: "/#platform" },
  { label: "How it works", href: "/#how" },
  { label: "Metrics", href: "/#metrics" },
  { label: "FAQ", href: "/#faq" },
]

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "border-b border-[var(--color-border-soft)] bg-[rgba(10,14,23,0.82)] backdrop-blur-xl"
          : "border-b border-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="grid h-9 w-9 place-items-center rounded-[10px] bg-gradient-to-br from-[var(--color-accent)] to-[var(--color-accent-dim)] shadow-lg shadow-[rgba(139,124,246,0.35)]">
            <Activity className="h-5 w-5 text-white" strokeWidth={2.4} />
          </span>
          <span className="font-[family-name:var(--font-display)] text-[17px] font-semibold tracking-tight">
            Workforce<span className="text-[var(--color-accent)]">Signal</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-lg px-3.5 py-2 text-sm text-[var(--color-text-secondary)] transition-colors hover:bg-[var(--color-bg-panel)] hover:text-[var(--color-text-primary)]"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <Link
            href="/dashboard"
            className="rounded-lg bg-gradient-to-br from-[var(--color-accent)] to-[var(--color-accent-dim)] px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-[rgba(139,124,246,0.3)] transition-transform hover:-translate-y-0.5"
          >
            Launch dashboard
          </Link>
        </div>

        <button
          className="grid h-10 w-10 place-items-center rounded-lg border border-[var(--color-border-strong)] text-[var(--color-text-secondary)] md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-[var(--color-border-soft)] bg-[var(--color-bg-panel)] px-5 py-4 md:hidden">
          <nav className="flex flex-col gap-1">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-raised)]"
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/dashboard"
              onClick={() => setOpen(false)}
              className="mt-2 rounded-lg bg-gradient-to-br from-[var(--color-accent)] to-[var(--color-accent-dim)] px-4 py-2.5 text-center text-sm font-semibold text-white"
            >
              Launch dashboard
            </Link>
          </nav>
        </div>
      )}
    </header>
  )
}
