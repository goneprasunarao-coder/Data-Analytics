"use client"

import { useMemo } from "react"
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import { Target, Crosshair, Radar, Sigma, Gauge } from "lucide-react"
import { Panel } from "../ui/panel"
import { StatCard } from "../ui/stat-card"
import { CHART, tooltipStyle } from "../ui/chart-theme"
import { featureLabel, fmtInt, fmtPct } from "@/lib/analytics"
import type { TrainedPipeline } from "@/lib/types"

export function ModelPerformance({ pipeline }: { pipeline: TrainedPipeline }) {
  const { metrics, model, featureNames } = pipeline

  const coefs = useMemo(() => {
    return featureNames
      .map((name, j) => ({ label: featureLabel(name), value: +model.w[j].toFixed(3) }))
      .sort((a, b) => Math.abs(b.value) - Math.abs(a.value))
      .slice(0, 12)
      .reverse()
  }, [featureNames, model])

  const cm = metrics.confusion
  const cmCells = [
    { label: "True negatives", value: cm.tn, tone: CHART.green, note: "Stayed · predicted stay" },
    { label: "False positives", value: cm.fp, tone: CHART.amber, note: "Stayed · predicted leave" },
    { label: "False negatives", value: cm.fn, tone: CHART.rose, note: "Left · predicted stay" },
    { label: "True positives", value: cm.tp, tone: CHART.accent, note: "Left · predicted leave" },
  ]

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
        <StatCard icon={Target} label="Accuracy" value={fmtPct(metrics.accuracy)} tone="blue" />
        <StatCard icon={Crosshair} label="Precision" value={fmtPct(metrics.precision)} tone="teal" />
        <StatCard icon={Radar} label="Recall" value={fmtPct(metrics.recall)} tone="amber" />
        <StatCard icon={Sigma} label="F1 score" value={fmtPct(metrics.f1)} tone="accent" />
        <StatCard icon={Gauge} label="ROC-AUC" value={metrics.auc.toFixed(3)} tone="rose" />
      </div>

      <div className="grid gap-5 lg:grid-cols-[1.5fr_1fr]">
        <Panel
          title="Feature importance"
          subtitle="Logistic-regression coefficients (standardized). Positive → higher attrition risk"
        >
          <ResponsiveContainer width="100%" height={420}>
            <BarChart
              data={coefs}
              layout="vertical"
              margin={{ top: 4, right: 16, left: 10, bottom: 4 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke={CHART.grid} horizontal={false} />
              <XAxis
                type="number"
                tick={{ fill: CHART.axis, fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                type="category"
                dataKey="label"
                width={150}
                tick={{ fill: CHART.axis, fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "rgba(139,124,246,0.06)" }} />
              <Bar dataKey="value" name="Coefficient" radius={[0, 5, 5, 0]}>
                {coefs.map((c, i) => (
                  <Cell key={i} fill={c.value >= 0 ? CHART.rose : CHART.green} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Panel>

        <div className="space-y-5">
          <Panel title="Confusion matrix" subtitle={`Held-out test set · ${fmtInt(metrics.nTest)} employees`}>
            <div className="grid grid-cols-2 gap-3">
              {cmCells.map((c) => (
                <div
                  key={c.label}
                  className="rounded-xl border border-[var(--color-border-strong)] bg-[var(--color-bg-deep)] p-4"
                  style={{ borderColor: `${c.tone}55` }}
                >
                  <div
                    className="font-[family-name:var(--font-display)] text-2xl font-bold"
                    style={{ color: c.tone }}
                  >
                    {fmtInt(c.value)}
                  </div>
                  <div className="mt-1 text-xs font-medium text-[var(--color-text-secondary)]">
                    {c.label}
                  </div>
                  <div className="mt-0.5 text-[11px] text-[var(--color-text-muted)]">{c.note}</div>
                </div>
              ))}
            </div>
          </Panel>

          <Panel title="Training summary">
            <dl className="space-y-3 text-sm">
              <Row label="Model type" value="Logistic Regression (L2)" />
              <Row label="Labeled records" value={fmtInt(metrics.nLabeled)} />
              <Row label="Training set" value={fmtInt(metrics.nTrain)} />
              <Row label="Test set" value={fmtInt(metrics.nTest)} />
              <Row label="Features" value={fmtInt(featureNames.length)} />
              <Row label="Base attrition rate" value={fmtPct(metrics.posRate)} />
            </dl>
          </Panel>
        </div>
      </div>
    </div>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between border-b border-[var(--color-border-soft)] pb-2.5 last:border-0 last:pb-0">
      <dt className="text-[var(--color-text-muted)]">{label}</dt>
      <dd className="font-medium text-[var(--color-text-primary)]">{value}</dd>
    </div>
  )
}
