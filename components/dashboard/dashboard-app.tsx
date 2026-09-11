"use client"

import { useState } from "react"
import Link from "next/link"
import {
  Activity,
  LayoutDashboard,
  Sparkles,
  Gauge,
  Table2,
  Info,
  ArrowLeft,
  Loader2,
  Menu,
  X,
} from "lucide-react"
import { useWorkforce } from "@/lib/use-workforce"
import { trainModelPipeline } from "@/lib/analytics"
import type { CleanRecord, TrainedPipeline } from "@/lib/types"
import { Overview } from "./sections/overview"
import { Prediction } from "./sections/prediction"
import { ModelPerformance } from "./sections/model-performance"
import { DataExplorer } from "./sections/data-explorer"
import { AboutSection } from "./sections/about"

type SectionId = "overview" | "prediction" | "performance" | "explorer" | "about"

const NAV: { id: SectionId; label: string; icon: typeof LayoutDashboard }[] = [
  { id: "overview", label: "Dashboard", icon: LayoutDashboard },
  { id: "prediction", label: "Prediction", icon: Sparkles },
  { id: "performance", label: "Model performance", icon: Gauge },
  { id: "explorer", label: "Data explorer", icon: Table2 },
  { id: "about", label: "About", icon: Info },
]

export function DashboardApp() {
  const { raw, pipeline, isLoading } = useWorkforce()
  const [section, setSection] = useState<SectionId>("overview")
  const [override, setOverride] = useState<{ data: CleanRecord[]; pipeline: TrainedPipeline | null } | null>(
    null,
  )
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const activeData = override ? override.data : raw
  const activePipeline = override ? override.pipeline : pipeline

  const handleData = (rows: CleanRecord[] | null) => {
    if (rows === null) {
      setOverride(null)
      return
    }
    let trained: TrainedPipeline | null = null
    try {
      trained = trainModelPipeline(rows)
    } catch {
      trained = null
    }
    setOverride({ data: rows, pipeline: trained })
  }

  const activeLabel = NAV.find((n) => n.id === section)?.label ?? ""

  return (
    <div className="relative z-10 flex min-h-screen">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 transform border-r border-[var(--color-border-soft)] bg-[var(--color-bg-panel)] transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-16 items-center gap-2.5 border-b border-[var(--color-border-soft)] px-5">
          <span className="grid h-9 w-9 place-items-center rounded-[10px] bg-gradient-to-br from-[var(--color-accent)] to-[var(--color-accent-dim)]">
            <Activity className="h-5 w-5 text-white" strokeWidth={2.4} />
          </span>
          <span className="font-[family-name:var(--font-display)] text-base font-semibold tracking-tight">
            Workforce<span className="text-[var(--color-accent)]">Signal</span>
          </span>
        </div>

        <nav className="flex flex-col gap-1 p-3">
          {NAV.map((item) => {
            const active = item.id === section
            return (
              <button
                key={item.id}
                onClick={() => {
                  setSection(item.id)
                  setSidebarOpen(false)
                }}
                className={`flex items-center gap-3 rounded-lg px-3.5 py-2.5 text-sm font-medium transition-colors ${
                  active
                    ? "bg-gradient-to-r from-[rgba(139,124,246,0.18)] to-transparent text-[var(--color-text-primary)]"
                    : "text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-panel-alt)] hover:text-[var(--color-text-primary)]"
                }`}
              >
                <item.icon
                  className={`h-4.5 w-4.5 ${active ? "text-[var(--color-accent)]" : ""}`}
                />
                {item.label}
              </button>
            )
          })}
        </nav>

        <div className="absolute inset-x-0 bottom-0 p-3">
          <Link
            href="/"
            className="flex items-center gap-2 rounded-lg border border-[var(--color-border-strong)] px-3.5 py-2.5 text-sm text-[var(--color-text-secondary)] transition-colors hover:text-[var(--color-text-primary)]"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to site
          </Link>
        </div>
      </aside>

      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden
        />
      )}

      {/* Main */}
      <div className="flex min-h-screen flex-1 flex-col lg:pl-64">
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-[var(--color-border-soft)] bg-[rgba(10,14,23,0.82)] px-5 backdrop-blur-xl sm:px-8">
          <div className="flex items-center gap-3">
            <button
              className="grid h-9 w-9 place-items-center rounded-lg border border-[var(--color-border-strong)] text-[var(--color-text-secondary)] lg:hidden"
              onClick={() => setSidebarOpen((v) => !v)}
              aria-label="Toggle sidebar"
            >
              {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
            <div>
              <h1 className="font-[family-name:var(--font-display)] text-lg font-semibold tracking-tight">
                {activeLabel}
              </h1>
              <p className="text-xs text-[var(--color-text-muted)]">
                Workforce attrition analytics
                {override ? " · custom dataset" : ""}
              </p>
            </div>
          </div>
          <span className="hidden items-center gap-2 rounded-full border border-[var(--color-border-strong)] bg-[var(--color-bg-panel)] px-3 py-1.5 text-xs text-[var(--color-text-secondary)] sm:flex">
            <span className="h-2 w-2 animate-pulse rounded-full bg-[var(--color-green)]" />
            {activeData.length.toLocaleString()} records loaded
          </span>
        </header>

        <main className="flex-1 p-5 sm:p-8">
          {isLoading ? (
            <LoadingState />
          ) : (
            <>
              {section === "overview" && <Overview data={activeData} />}
              {section === "prediction" &&
                (activePipeline ? (
                  <Prediction pipeline={activePipeline} />
                ) : (
                  <EmptyModel />
                ))}
              {section === "performance" &&
                (activePipeline ? (
                  <ModelPerformance pipeline={activePipeline} />
                ) : (
                  <EmptyModel />
                ))}
              {section === "explorer" && <DataExplorer data={activeData} onData={handleData} />}
              {section === "about" && <AboutSection />}
            </>
          )}
        </main>
      </div>
    </div>
  )
}

function LoadingState() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
      <Loader2 className="h-8 w-8 animate-spin text-[var(--color-accent)]" />
      <div>
        <p className="font-[family-name:var(--font-display)] text-lg font-semibold">
          Loading workforce data
        </p>
        <p className="mt-1 text-sm text-[var(--color-text-muted)]">
          Cleaning records and training the attrition model in your browser…
        </p>
      </div>
    </div>
  )
}

function EmptyModel() {
  return (
    <div className="flex min-h-[40vh] flex-col items-center justify-center gap-3 text-center">
      <Gauge className="h-8 w-8 text-[var(--color-text-muted)]" />
      <p className="font-[family-name:var(--font-display)] text-lg font-semibold">
        No model available
      </p>
      <p className="max-w-sm text-sm text-[var(--color-text-muted)]">
        The uploaded dataset does not contain enough labeled attrition outcomes to train a model.
        Reset to the bundled dataset from the Data explorer.
      </p>
    </div>
  )
}
