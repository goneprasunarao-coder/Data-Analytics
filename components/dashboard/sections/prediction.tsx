"use client"

import { useMemo, useState } from "react"
import { Sparkles, AlertTriangle, ShieldCheck, ArrowUpRight, ArrowDownRight } from "lucide-react"
import { Panel } from "../ui/panel"
import { CHART } from "../ui/chart-theme"
import {
  CAT_LEVELS,
  applyScale,
  predictProba,
  vectorizeForPrediction,
  featureLabel,
} from "@/lib/analytics"
import type { TrainedPipeline, PredictionInput } from "@/lib/types"

const DEFAULTS: PredictionInput = {
  age: 32,
  dept: "Sales",
  tenure: 3,
  edu: "Masters",
  training: 20,
  marital: "Single",
  perf: 3,
  workmode: "Onsite",
  satisfaction: 3,
  gender: "Male",
  overtime: "No",
  everPromoted: 0,
}

function Field({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium text-[var(--color-text-secondary)]">
        {label}
      </span>
      {children}
    </label>
  )
}

const selectCls =
  "w-full rounded-lg border border-[var(--color-border-strong)] bg-[var(--color-bg-deep)] px-3 py-2 text-sm text-[var(--color-text-primary)] outline-none transition-colors focus:border-[var(--color-accent)]"

export function Prediction({ pipeline }: { pipeline: TrainedPipeline }) {
  const [input, setInput] = useState<PredictionInput>(DEFAULTS)

  const result = useMemo(() => {
    const vec = vectorizeForPrediction(input)
    const scaled = applyScale(vec, pipeline.scaler.mean, pipeline.scaler.std)
    const proba = predictProba(pipeline.model, scaled)

    const contributions = pipeline.featureNames
      .map((name, j) => ({
        name,
        label: featureLabel(name),
        value: pipeline.model.w[j] * scaled[j],
      }))
      .filter((c) => Math.abs(c.value) > 0.01)
      .sort((a, b) => Math.abs(b.value) - Math.abs(a.value))
      .slice(0, 6)

    return { proba, contributions }
  }, [input, pipeline])

  const pct = Math.round(result.proba * 100)
  const level = result.proba >= 0.6 ? "High" : result.proba >= 0.35 ? "Moderate" : "Low"
  const levelTone =
    level === "High" ? CHART.rose : level === "Moderate" ? CHART.amber : CHART.green
  const circumference = 2 * Math.PI * 52

  const set = <K extends keyof PredictionInput>(key: K, value: PredictionInput[K]) =>
    setInput((prev) => ({ ...prev, [key]: value }))

  return (
    <div className="grid gap-5 lg:grid-cols-[1.4fr_1fr]">
      <Panel
        title="Employee attributes"
        subtitle="Adjust the profile to estimate attrition probability"
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Age">
            <input
              type="number"
              min={18}
              max={70}
              value={input.age}
              onChange={(e) => set("age", Number(e.target.value))}
              className={selectCls}
            />
          </Field>
          <Field label="Years at company">
            <input
              type="number"
              min={0}
              max={40}
              step={0.5}
              value={input.tenure}
              onChange={(e) => set("tenure", Number(e.target.value))}
              className={selectCls}
            />
          </Field>
          <Field label="Department">
            <select
              value={input.dept}
              onChange={(e) => set("dept", e.target.value)}
              className={selectCls}
            >
              {CAT_LEVELS.dept.map((d) => (
                <option key={d}>{d}</option>
              ))}
            </select>
          </Field>
          <Field label="Education">
            <select
              value={input.edu}
              onChange={(e) => set("edu", e.target.value)}
              className={selectCls}
            >
              {["High School", "Diploma", "Masters", "PhD"].map((d) => (
                <option key={d}>{d}</option>
              ))}
            </select>
          </Field>
          <Field label="Marital status">
            <select
              value={input.marital}
              onChange={(e) => set("marital", e.target.value)}
              className={selectCls}
            >
              {["Single", "Married", "Widowed"].map((d) => (
                <option key={d}>{d}</option>
              ))}
            </select>
          </Field>
          <Field label="Work mode">
            <select
              value={input.workmode}
              onChange={(e) => set("workmode", e.target.value)}
              className={selectCls}
            >
              {["Onsite", "Remote"].map((d) => (
                <option key={d}>{d}</option>
              ))}
            </select>
          </Field>
          <Field label="Gender">
            <select
              value={input.gender}
              onChange={(e) => set("gender", e.target.value)}
              className={selectCls}
            >
              {["Male", "Female"].map((d) => (
                <option key={d}>{d}</option>
              ))}
            </select>
          </Field>
          <Field label="Works overtime">
            <select
              value={input.overtime}
              onChange={(e) => set("overtime", e.target.value)}
              className={selectCls}
            >
              {["No", "Yes"].map((d) => (
                <option key={d}>{d}</option>
              ))}
            </select>
          </Field>
          <Field label={`Performance rating: ${input.perf}`}>
            <input
              type="range"
              min={1}
              max={5}
              step={1}
              value={input.perf}
              onChange={(e) => set("perf", Number(e.target.value))}
              className="w-full accent-[var(--color-accent)]"
            />
          </Field>
          <Field label={`Satisfaction score: ${input.satisfaction}`}>
            <input
              type="range"
              min={1}
              max={5}
              step={1}
              value={input.satisfaction}
              onChange={(e) => set("satisfaction", Number(e.target.value))}
              className="w-full accent-[var(--color-accent)]"
            />
          </Field>
          <Field label={`Training hours (last yr): ${input.training}`}>
            <input
              type="range"
              min={0}
              max={80}
              step={1}
              value={input.training}
              onChange={(e) => set("training", Number(e.target.value))}
              className="w-full accent-[var(--color-accent)]"
            />
          </Field>
          <Field label="Ever promoted">
            <select
              value={input.everPromoted}
              onChange={(e) => set("everPromoted", Number(e.target.value))}
              className={selectCls}
            >
              <option value={0}>No</option>
              <option value={1}>Yes</option>
            </select>
          </Field>
        </div>
      </Panel>

      <div className="space-y-5">
        <Panel title="Attrition risk" subtitle="Model-estimated probability of leaving">
          <div className="flex flex-col items-center py-2">
            <div className="relative h-[140px] w-[140px]">
              <svg className="h-full w-full -rotate-90" viewBox="0 0 120 120">
                <circle cx="60" cy="60" r="52" fill="none" stroke={CHART.grid} strokeWidth="12" />
                <circle
                  cx="60"
                  cy="60"
                  r="52"
                  fill="none"
                  stroke={levelTone}
                  strokeWidth="12"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={circumference * (1 - result.proba)}
                  style={{ transition: "stroke-dashoffset 0.6s ease, stroke 0.4s ease" }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="font-[family-name:var(--font-display)] text-3xl font-bold">
                  {pct}%
                </span>
                <span className="text-[11px] text-[var(--color-text-muted)]">probability</span>
              </div>
            </div>

            <div
              className="mt-4 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-semibold"
              style={{ background: `${levelTone}1f`, color: levelTone }}
            >
              {level === "High" ? (
                <AlertTriangle className="h-4 w-4" />
              ) : level === "Low" ? (
                <ShieldCheck className="h-4 w-4" />
              ) : (
                <Sparkles className="h-4 w-4" />
              )}
              {level} risk
            </div>
          </div>
        </Panel>

        <Panel title="Top contributing factors" subtitle="Standardized effect on this prediction">
          <ul className="space-y-2.5">
            {result.contributions.map((c) => {
              const up = c.value > 0
              return (
                <li key={c.name} className="flex items-center justify-between gap-3">
                  <span className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)]">
                    {up ? (
                      <ArrowUpRight className="h-4 w-4 flex-none text-[var(--color-rose)]" />
                    ) : (
                      <ArrowDownRight className="h-4 w-4 flex-none text-[var(--color-green)]" />
                    )}
                    {c.label}
                  </span>
                  <div className="flex h-2 w-24 flex-none overflow-hidden rounded-full bg-[var(--color-bg-deep)]">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${Math.min(100, Math.abs(c.value) * 60)}%`,
                        marginLeft: up ? "auto" : undefined,
                        background: up ? CHART.rose : CHART.green,
                      }}
                    />
                  </div>
                </li>
              )
            })}
          </ul>
          <p className="mt-4 text-xs leading-relaxed text-[var(--color-text-muted)]">
            Red factors increase predicted attrition risk; green factors reduce it. Effects reflect
            this profile against the trained model.
          </p>
        </Panel>
      </div>
    </div>
  )
}
