"use client"

import { useMemo, useRef, useState } from "react"
import { Search, Upload, ChevronLeft, ChevronRight, RotateCcw, Filter } from "lucide-react"
import { Panel } from "../ui/panel"
import { cleanRecord, mapRowsFromSheet, uniqueSorted, fmtMoney } from "@/lib/analytics"
import type { CleanRecord } from "@/lib/types"

const PAGE_SIZE = 12

export function DataExplorer({
  data,
  onData,
}: {
  data: CleanRecord[]
  onData: (rows: CleanRecord[] | null) => void
}) {
  const [query, setQuery] = useState("")
  const [dept, setDept] = useState("")
  const [attr, setAttr] = useState("")
  const [page, setPage] = useState(0)
  const [uploadMsg, setUploadMsg] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const depts = useMemo(() => uniqueSorted(data, "dept"), [data])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return data.filter((d) => {
      if (dept && d.dept !== dept) return false
      if (attr && d.attrition !== attr) return false
      if (q) {
        const hay = `${d.name ?? ""} ${d.id} ${d.title ?? ""} ${d.city ?? ""}`.toLowerCase()
        if (!hay.includes(q)) return false
      }
      return true
    })
  }, [data, query, dept, attr])

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const current = Math.min(page, pageCount - 1)
  const rows = filtered.slice(current * PAGE_SIZE, current * PAGE_SIZE + PAGE_SIZE)

  const resetPage = () => setPage(0)

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setBusy(true)
    setUploadMsg(null)
    try {
      const XLSX = await import("xlsx")
      const buf = await file.arrayBuffer()
      const wb = XLSX.read(buf, { type: "array", cellDates: true })
      const sheet = wb.Sheets[wb.SheetNames[0]]
      const json = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, { defval: null })
      const mapped = mapRowsFromSheet(json)
      const cleaned = mapped.map(cleanRecord)
      if (!cleaned.length) throw new Error("No rows found")
      onData(cleaned)
      resetPage()
      setUploadMsg(`Loaded ${cleaned.length.toLocaleString()} records from ${file.name}`)
    } catch (err) {
      setUploadMsg(`Could not read file: ${(err as Error).message}`)
    } finally {
      setBusy(false)
      if (fileRef.current) fileRef.current.value = ""
    }
  }

  return (
    <div className="space-y-5">
      <Panel
        title="Data explorer"
        subtitle={`${filtered.length.toLocaleString()} of ${data.length.toLocaleString()} records`}
        action={
          <div className="flex flex-wrap items-center gap-2">
            <input
              ref={fileRef}
              type="file"
              accept=".xlsx,.xls,.csv"
              onChange={handleFile}
              className="hidden"
            />
            <button
              onClick={() => fileRef.current?.click()}
              disabled={busy}
              className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-br from-[var(--color-accent)] to-[var(--color-accent-dim)] px-3.5 py-2 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5 disabled:opacity-60"
            >
              <Upload className="h-4 w-4" />
              {busy ? "Reading…" : "Upload data"}
            </button>
            <button
              onClick={() => {
                onData(null)
                setUploadMsg("Restored the bundled dataset")
                resetPage()
              }}
              className="inline-flex items-center gap-2 rounded-lg border border-[var(--color-border-strong)] bg-[var(--color-bg-deep)] px-3.5 py-2 text-sm font-medium text-[var(--color-text-secondary)] transition-colors hover:text-[var(--color-text-primary)]"
            >
              <RotateCcw className="h-4 w-4" />
              Reset
            </button>
          </div>
        }
      >
        {uploadMsg && (
          <div className="mb-4 rounded-lg border border-[var(--color-border-strong)] bg-[var(--color-bg-deep)] px-3.5 py-2.5 text-xs text-[var(--color-text-secondary)]">
            {uploadMsg}
          </div>
        )}

        <div className="mb-4 grid gap-3 sm:grid-cols-[1.6fr_1fr_1fr]">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-text-muted)]" />
            <input
              value={query}
              onChange={(e) => {
                setQuery(e.target.value)
                resetPage()
              }}
              placeholder="Search name, ID, title, city…"
              className="w-full rounded-lg border border-[var(--color-border-strong)] bg-[var(--color-bg-deep)] py-2 pl-9 pr-3 text-sm outline-none transition-colors focus:border-[var(--color-accent)]"
            />
          </div>
          <SelectFilter value={dept} onChange={setDept} onPick={resetPage} placeholder="All departments">
            {depts.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </SelectFilter>
          <SelectFilter value={attr} onChange={setAttr} onPick={resetPage} placeholder="Any attrition">
            <option value="Yes">Left (Yes)</option>
            <option value="No">Stayed (No)</option>
          </SelectFilter>
        </div>

        <div className="overflow-x-auto rounded-xl border border-[var(--color-border-soft)]">
          <table className="w-full min-w-[820px] text-left text-sm">
            <thead>
              <tr className="border-b border-[var(--color-border-soft)] bg-[var(--color-bg-deep)] text-xs uppercase tracking-wide text-[var(--color-text-muted)]">
                <Th>ID</Th>
                <Th>Name</Th>
                <Th>Department</Th>
                <Th>Title</Th>
                <Th>Age</Th>
                <Th>Tenure</Th>
                <Th>Salary</Th>
                <Th>Sat.</Th>
                <Th>Attrition</Th>
              </tr>
            </thead>
            <tbody>
              {rows.map((d) => (
                <tr
                  key={d.id}
                  className="border-b border-[var(--color-border-soft)] transition-colors last:border-0 hover:bg-[var(--color-bg-panel-alt)]"
                >
                  <Td className="font-mono text-xs text-[var(--color-text-muted)]">{d.id}</Td>
                  <Td>{d.name ?? "—"}</Td>
                  <Td>{d.dept ?? "—"}</Td>
                  <Td className="text-[var(--color-text-secondary)]">{d.title ?? "—"}</Td>
                  <Td>{d.age ?? "—"}</Td>
                  <Td>{d.tenure !== null ? `${d.tenure}y` : "—"}</Td>
                  <Td>{d.salary !== null ? fmtMoney(d.salary) : "—"}</Td>
                  <Td>{d.satisfaction ?? "—"}</Td>
                  <Td>
                    {d.attrition ? (
                      <span
                        className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${
                          d.attrition === "Yes"
                            ? "bg-[rgba(251,107,135,0.15)] text-[var(--color-rose)]"
                            : "bg-[rgba(57,217,138,0.15)] text-[var(--color-green)]"
                        }`}
                      >
                        {d.attrition}
                      </span>
                    ) : (
                      <span className="text-[var(--color-text-muted)]">—</span>
                    )}
                  </Td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-sm text-[var(--color-text-muted)]">
                    <Filter className="mx-auto mb-2 h-5 w-5" />
                    No records match your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <span className="text-xs text-[var(--color-text-muted)]">
            Page {current + 1} of {pageCount}
          </span>
          <div className="flex gap-2">
            <PagerBtn disabled={current === 0} onClick={() => setPage(current - 1)}>
              <ChevronLeft className="h-4 w-4" />
            </PagerBtn>
            <PagerBtn disabled={current >= pageCount - 1} onClick={() => setPage(current + 1)}>
              <ChevronRight className="h-4 w-4" />
            </PagerBtn>
          </div>
        </div>
      </Panel>
    </div>
  )
}

function SelectFilter({
  value,
  onChange,
  onPick,
  placeholder,
  children,
}: {
  value: string
  onChange: (v: string) => void
  onPick: () => void
  placeholder: string
  children: React.ReactNode
}) {
  return (
    <select
      value={value}
      onChange={(e) => {
        onChange(e.target.value)
        onPick()
      }}
      className="w-full rounded-lg border border-[var(--color-border-strong)] bg-[var(--color-bg-deep)] px-3 py-2 text-sm outline-none transition-colors focus:border-[var(--color-accent)]"
    >
      <option value="">{placeholder}</option>
      {children}
    </select>
  )
}

function Th({ children }: { children: React.ReactNode }) {
  return <th className="whitespace-nowrap px-4 py-3 font-medium">{children}</th>
}

function Td({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <td className={`whitespace-nowrap px-4 py-3 ${className}`}>{children}</td>
}

function PagerBtn({
  children,
  disabled,
  onClick,
}: {
  children: React.ReactNode
  disabled: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="grid h-8 w-8 place-items-center rounded-lg border border-[var(--color-border-strong)] bg-[var(--color-bg-deep)] text-[var(--color-text-secondary)] transition-colors hover:text-[var(--color-text-primary)] disabled:cursor-not-allowed disabled:opacity-40"
    >
      {children}
    </button>
  )
}
